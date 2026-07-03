import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../api/authApi";

// Async thunks calling the authApi
export const loginUserAsync = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await authApi.login(email, password);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to log in.");
    }
  }
);

export const registerUserAsync = createAsyncThunk(
  "auth/registerUser",
  async ({ name, email, mobile, targetExam, password }, { rejectWithValue }) => {
    try {
      const data = await authApi.register(name, email, mobile, targetExam, password);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to register.");
    }
  }
);

export const logoutUserAsync = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
      return null;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to log out.");
    }
  }
);

export const checkSessionAsync = createAsyncThunk(
  "auth/checkSession",
  async (_, { rejectWithValue }) => {
    try {
      const data = await authApi.getMe();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Session expired.");
    }
  }
);

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: true, // Start as true so we check session on load without flash of login page
  sessionChecked: false,
  error: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      state.sessionChecked = true;
    },
    updateTargetExam(state, action) {
      if (state.user) {
        state.user.targetExam = action.payload;
      }
    },
    clearAuthError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login flow
      .addCase(loginUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = {
          name: action.payload.name || "Rahul",
          targetExam: action.payload.targetExam || "SSC CGL",
          daysLeft: 47,
          overallProgress: 34,
          syllabusProgress: {
            quant: 34,
            reasoning: 58,
            english: 45,
            general: 22
          }
        };
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register flow
      .addCase(registerUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = {
          name: action.payload.name,
          targetExam: action.payload.targetExam || "SSC CGL",
          daysLeft: 47,
          overallProgress: 0,
          syllabusProgress: {
            quant: 0,
            reasoning: 0,
            english: 0,
            general: 0
          }
        };
      })
      .addCase(registerUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Check session flow
      .addCase(checkSessionAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkSessionAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.sessionChecked = true;
        state.user = {
          name: action.payload.name || "Rahul",
          targetExam: action.payload.targetExam || "SSC CGL",
          daysLeft: 47,
          overallProgress: 34,
          syllabusProgress: {
            quant: 34,
            reasoning: 58,
            english: 45,
            general: 22
          }
        };
      })
      .addCase(checkSessionAsync.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.sessionChecked = true;
        state.user = null;
      })
      // Logout flow
      .addCase(logoutUserAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUserAsync.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logoutUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
      });
  }
});

export const { logout, updateTargetExam, clearAuthError } = authSlice.actions;

export default authSlice.reducer;
