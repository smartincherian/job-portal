import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "empty",
  age: 0,
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    submit: (state, action) => {
      console.log(state);
      console.log(action.payload);
      state.name = action.payload.name;
      state.age = action.payload.age;
    },
  },
});

export default formSlice.reducer;
export const { submit } = formSlice.actions;
