import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootRedcuer";
import { authApi } from "@/features/api/authApi";
import { courseApi } from "@/features/api/courseApi";
import { purchaseApi } from "@/features/api/purchaseApi";

export const appStore = configureStore({
    reducer: rootReducer,
    middleware:(defaultMiddlewarw) => defaultMiddlewarw().concat(authApi.middleware, courseApi.middleware, purchaseApi.middleware),
});

const initializeApp = async () => {
    await appStore.dispatch(authApi.endpoints.loadUser.initiate({}, {forceRefetch:true}))
}
initializeApp();
