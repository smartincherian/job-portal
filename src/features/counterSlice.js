import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  count1: 0,
  count2: 10,
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    //reducer functions
    //same name for action
    increment: (state, action) => {
      //automatically initial state
      state.count1 = state.count1 + 1;
    },

    decrement: (state, action) => {
      state.count1 = state.count1 - 1;
    },
    incrementBy5: (state, action) => {
      state.count2 = state.count2 + 5;
    },
    decrementBy5: (state, action) => {
      state.count2 = state.count2 - 5;
    },
  },
});

//redux reducer
export default counterSlice.reducer;
//actions export
export const { increment, decrement, incrementBy5, decrementBy5 } = counterSlice.actions;
