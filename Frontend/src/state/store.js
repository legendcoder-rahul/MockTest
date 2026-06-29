import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../auth/state/authSlice";
import examReducer from "./examSlice";
import aiReducer from "./aiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    exam: examReducer,
    ai: aiReducer
  }
});
