import { createSlice } from "@reduxjs/toolkit";

const initialState = { listings: [] };

const jobListingsSlice = createSlice({
  name: "jobListings",
  initialState,
  reducers: {
    jobListings: (state, action) => {
      console.log(action.payload);
      state.listings = action.payload;
    },
    jobListingSelected: (state, action) => {
      console.log(action.payload);
      state.listingSelected = action.payload;
    },
  },
});

export default jobListingsSlice.reducer;
export const { jobListings, jobListingSelected } = jobListingsSlice.actions;
