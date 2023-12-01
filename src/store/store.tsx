import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import createWebStorage from 'redux-persist/es/storage/createWebStorage';
import { attributeSlice, authSlice, cartsSlice, categorySlice, productSlice } from './slices';

// @ts-ignore
const makeStore = () =>
    configureStore({
        reducer: {},
        devTools: true,
    });

const createNoopStorage = () => {
    return {
        getItem(_key: any) {
            return Promise.resolve(null);
        },
        setItem(_key: any, value: any) {
            return Promise.resolve(value);
        },
        removeItem(_key: any) {
            return Promise.resolve();
        },
    };
};

const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();

const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['product', 'attribute', 'category', 'carts'],
};

const rootReducer = combineReducers({
    auth: authSlice.reducer,
    product: productSlice.reducer,
    cart: cartsSlice.reducer,
    attribute: attributeSlice.reducer,
    category: categorySlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;