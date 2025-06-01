import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authAPI from "../api/authAPI";
import {
  showSuccessToast,
  showErrorToast,
  showWarningToast,
  dismissAllToasts,
} from "../../utils/toast";

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  validationErrors: null,
  message: null,
};

// Async thunks
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);
      return response.data;
    } catch (error) {
      // Handle validation errors
      if (error.response?.data?.errors) {
        return rejectWithValue({
          message: error.response.data.message,
          errors: error.response.data.errors,
        });
      }
      return rejectWithValue({
        message: error.response?.data?.message || "Registration failed",
      });
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      return response.data;
    } catch (error) {
      // Handle validation errors
      if (error.response?.data?.errors) {
        return rejectWithValue({
          message: error.response.data.message,
          errors: error.response.data.errors,
        });
      }
      return rejectWithValue({
        message: error.response?.data?.message || "Login failed",
      });
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      if (!auth.token) {
        return rejectWithValue("No token found");
      }
      const response = await authAPI.getCurrentUser();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get user data"
      );
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.message = null;
      // Clear token from memory
      authAPI.clearToken();
      // Show logout toast
      showSuccessToast("You have been logged out successfully");
      // Dismiss all toasts after logout
      setTimeout(() => dismissAllToasts(), 1000);
    },
    clearError: (state) => {
      state.error = null;
      state.validationErrors = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      // Set token in memory for API calls
      authAPI.setToken(token);
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.validationErrors = null;
        state.message = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.message =
          action.payload.message ||
          "Registration successful! Welcome to our platform!";
        state.error = null;
        state.validationErrors = null;
        // Set token in memory for API calls
        authAPI.setToken(action.payload.token);
        // Show success toast
        showSuccessToast(state.message);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Registration failed";
        state.validationErrors = action.payload?.errors || null;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        // Show error toast
        showErrorToast(state.error);
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.validationErrors = null;
        state.message = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.message =
          action.payload.message ||
          `Welcome back, ${action.payload.user.name}!`;
        state.error = null;
        state.validationErrors = null;
        // Set token in memory for API calls
        authAPI.setToken(action.payload.token);
        // Show success toast
        showSuccessToast(state.message);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Login failed";
        state.validationErrors = action.payload?.errors || null;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        // Show error toast
        showErrorToast(state.error);
      })
      // Get current user
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        // Clear token from memory
        authAPI.clearToken();
      });
  },
});

export const { logout, clearError, clearMessage, setCredentials } =
  authSlice.actions;
export default authSlice.reducer;
