import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootRedcuer";
import { authApi } from "@/features/api/authApi";
import { courseApi } from "@/features/api/courseApi";
import { purchaseApi } from "@/features/api/purchaseApi";
import { courseProgressApi } from "@/features/api/courseProgressApi";

export const appStore = configureStore({
    reducer: rootReducer,
    middleware:(defaultMiddlewarw) => defaultMiddlewarw().concat(authApi.middleware, courseApi.middleware, purchaseApi.middleware, courseProgressApi.middleware),
});

const initializeApp = async () => {
    await appStore.dispatch(authApi.endpoints.loadUser.initiate({}, {forceRefetch:true}))
}
initializeApp();
