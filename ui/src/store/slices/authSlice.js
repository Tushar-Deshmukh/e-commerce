import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSignIn: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },

    setSignOut: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { setSignIn, setSignOut } = authSlice.actions;

export const getAuthUser = (state) => state.auth.user;

export default authSlice.reducer;