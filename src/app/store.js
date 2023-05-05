import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "../features/counterSlice";
import formSlice from "../features/formSlice";
import loggedInUserSlice from "../features/loggedInUserSlice";
import jobListingsSlice from "../features/jobListingsSlice";

export const store = configureStore({
  reducer: {
    counter: counterSlice,
    form: formSlice,
    user: loggedInUserSlice,
    listings: jobListingsSlice,
  },
});
