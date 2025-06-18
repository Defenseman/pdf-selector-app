import { configureStore } from "@reduxjs/toolkit";
import fragmentReducer from '../store/slices/fragmentSlice';

export const store = configureStore({
    reducer: {
        fragments: fragmentReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;