import NextAuth, { User, NextAuthConfig, Session, Account } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import instanceAuth from '@config/instanceAuth.config';
import { AuthenticationApi, LoginRequestDTO } from '@TechCell-Project/tech-cell-server-node-sdk';
import { axiosAuth } from '@libs/axios';
import jwtDecode, { JwtPayload } from 'jwt-decode';

const authApi = new AuthenticationApi();

/**
 * @see https://authjs.dev/
 */
export const nextAuthConfig: NextAuthConfig = {
    providers: [
        CredentialsProvider({
            credentials: {
                emailOrUsername: {
                    label: 'emailOrUsername',
                    type: 'emailOrUsername',
                    placeholder: 'jsmith@example.com',
                },
                password: { label: 'password', type: 'password' },
            },
            async authorize(credentials, req) {
                const payload: LoginRequestDTO = {
                    emailOrUsername: (credentials?.emailOrUsername as string) ?? '',
                    password: (credentials?.password as string) ?? '',
                };

                return authApi
                    .login({ loginRequestDTO: payload })
                    .then((response) => {
                        return response.data as unknown as User;
                    })
                    .catch((err) => {
                        console.error(err.message);
                        return null;
                    });
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
        }),
    ],
    callbacks: {
        async signIn({ user, account }: { user: User; account: Account | null }) {
            if (account?.provider === 'google') {
                try {
                    const { data: userData } = await authApi.google({
                        googleLoginRequestDTO: {
                            idToken: account.id_token ?? '',
                        },
                    });
                    Object.assign(user, {
                        // assign custom properties of backend
                        ...userData,

                        //remove default properties of google
                        id: undefined,
                        name: undefined,
                        sub: undefined,
                        picture: undefined,
                        image: undefined,
                        iat: undefined,
                        exp: undefined,
                        jti: undefined,
                    });
                    return true;
                } catch (error) {
                    console.error(error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user }: { token: any; user: User | null; account: any }) {
            if (user) {
                token = { ...token, ...user };
            }

            if (token?.accessToken) {
                const accessToken = jwtDecode<JwtPayload>(token.accessToken);
                const now = Date.now() / 1000;

                if (token?.refreshToken && accessToken.exp && accessToken.exp < now) {
                    const refreshToken = jwtDecode<JwtPayload>(token.refreshToken);
                    if (refreshToken.exp && refreshToken.exp < now) {
                        return null;
                    }

                    try {
                        const { data } = await authApi.getNewToken({
                            newTokenRequestDTO: {
                                refreshToken: token.refreshToken,
                            },
                        });
                        token = { ...data };
                    } catch (error) {
                        console.error(error);
                        return null;
                    }
                }
            }

            return token;
        },
        async session({ session, token }: { session: Session; token: any }) {
            if (token) {
                session.user = token;
                instanceAuth.defaults.headers.common.Authorization = `Bearer ${token.accessToken}`;
                axiosAuth.defaults.headers.common.Authorization = `Bearer ${token.accessToken}`;
            }
            return session;
        },
        async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
            if (url.startsWith('/')) return `${baseUrl}${url}`;
            else if (new URL(url).origin === baseUrl) return url;
            return baseUrl;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/dang-nhap',
        error: '/dang-nhap',
    },
    logger: {
        debug: (...data: any[]) => console.debug({ ...data }),
        error: (...data: any[]) => console.error({ ...data }),
        warn: (...data: any[]) => console.warn({ ...data }),
    },
};

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
    update,
} = NextAuth(nextAuthConfig);