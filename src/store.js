import { configureStore } from "@reduxjs/toolkit";
import firebaseReducer from "./firebaseSlice";

export const store = configureStore({
    reducer: {
        firebase: firebaseReducer
    },
})