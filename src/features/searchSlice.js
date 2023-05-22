import { createSlice } from "@reduxjs/toolkit";

const initialState = { searchResult: [] };

const searchSlice = createSlice({
    name: "jobSearch",
    initialState,
    reducers: {
        jobSearch: (state, action) => {
            state.searchResult = action.payload;
        }
    }
});

export default searchSlice.reducer;
export const { jobSearch } = searchSlice.actions;
