import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootRedcuer";
import { authApi } from "@/features/api/authApi";

export const appStore = configureStore({
    reducer: rootReducer,
    middleware:(defaultMiddlewarw) => defaultMiddlewarw().concat(authApi.middleware)
});
