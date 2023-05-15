import { createSlice } from "@reduxjs/toolkit";

const initialState = { searchKeyword: "" };

const searchSlice = createSlice({
    name: "jobSearch",
    initialState,
    reducers: {
        jobSearch: (state, action) => {
            state.searchKeyword = action.payload;
        }
    }
});

export default searchSlice.reducer;
export const { jobSearch } = searchSlice.actions;
