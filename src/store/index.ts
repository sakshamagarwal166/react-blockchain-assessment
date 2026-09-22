import { configureStore } from "@reduxjs/toolkit";
import blockNumberReducer from "./blockNumberSlice";

export const store = configureStore({
  reducer: {
    blockNumber: blockNumberReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
