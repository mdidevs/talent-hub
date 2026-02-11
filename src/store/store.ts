import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/auth.slice";
import wizardReducer from "./wizard/wizard.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    wizard: wizardReducer,
  },
});

// Types for TS app-wide usage
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
