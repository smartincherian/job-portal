import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  uid: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signin: (state, action) => {
      state.email = action.payload.email;
      state.uid = action.payload.uid;
    },
    reset: () => initialState,
  },
});

export default userSlice.reducer;
export const { signin, reset } = userSlice.actions;
