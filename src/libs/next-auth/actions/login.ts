'use server';

import { signIn } from '@/auth';
import { RootPath } from '@/constants/enum';
import { LoginModel } from '@/models';
import { isAxiosError } from 'axios';
import { AuthError } from 'next-auth';

export const login = async (values: Required<LoginModel>, callbackUrl?: string | null) => {
    const { emailOrUsername, password } = values;

    try {
        await signIn('credentials', {
            emailOrUsername,
            password,
            // redirectTo: callbackUrl ?? RootPath.Home,
        });
    } catch (error) {
        console.log(error);

        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return { errorMsg: 'Invalid credentials!' };
                case 'CallbackRouteError':
                    const err = error.cause?.err;
                    if (isAxiosError(err)) {
                        return {
                            errorMsg: err.message,
                            code: err.response?.status,
                        };
                    }
                    return { errorMsg: error.cause?.err?.message as string };
                default:
                    return { errorMsg: 'Something went wrong!' };
            }
        }
    }
};
