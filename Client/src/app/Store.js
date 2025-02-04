import { configureStore } from "@reduxjs/toolkit";
import authRedcuer from "../features/authSlice";

export const appStore = configureStore({
    reducer: {
        auth: authRedcuer
    }
});