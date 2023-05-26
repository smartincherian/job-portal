import { createSlice } from "@reduxjs/toolkit";

const initialState = { searchWord: "" };

const searchWordSlice = createSlice({
  name: "jobSearch",
  initialState,
  reducers: {
    jobSearchWord: (state, action) => {
      state.searchWord = action.payload;
    },
  },
});

export default searchWordSlice.reducer;
export const { jobSearchWord } = searchWordSlice.actions;
