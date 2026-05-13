import { createSlice } from "@reduxjs/toolkit";

// Safely parse token from localStorage
let parsedToken = null;
try {
  const storedToken = localStorage.getItem("token");
  if (storedToken && storedToken !== "undefined") {
    parsedToken = JSON.parse(storedToken);
  }
} catch (error) {
  console.error("Error parsing token from localStorage:", error);
  parsedToken = null;
}

const initialState = {
  signupData: null,
  loading: false,
  token: parsedToken,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setSignupData(state, value) {
      state.signupData = value.payload;
    },
    setLoading(state, value) {
      state.loading = value.payload;
    },
    setToken(state, value) {
      state.token = value.payload;
    },
  },
});

export const { setSignupData, setLoading, setToken } = authSlice.actions;

export default authSlice.reducer;
