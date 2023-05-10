import { configureStore } from "@reduxjs/toolkit";
import formSlice from "../features/formSlice";
import loggedInUserSlice from "../features/loggedInUserSlice";
import jobListingsSlice from "../features/jobListingsSlice";

export const store = configureStore({
  reducer: {
    form: formSlice,
    user: loggedInUserSlice,
    listings: jobListingsSlice,
  },
});
