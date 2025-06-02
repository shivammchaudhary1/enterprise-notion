import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as authAPI from "../redux/api/authAPI";
import {
  showSuccessToast,
  showErrorToast,
  showWarningToast,
  dismissAllToasts,
} from "../utils/toast";

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      validationErrors: null,
      message: null,

      // Actions
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null, validationErrors: null }),
      clearMessage: () => set({ message: null }),

      setCredentials: (payload) => {
        const { user, token } = payload;
        set((prev) => ({
          ...prev,
          token: token || prev.token,
          user: user || prev.user,
          isAuthenticated: !!(token || prev.token),
        }));

        if (token) {
          authAPI.setToken(token);
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
          message: null,
          validationErrors: null,
        });

        authAPI.clearToken();
        showSuccessToast("You have been logged out successfully");
        setTimeout(() => dismissAllToasts(), 1000);
      },

      // Async Actions
      registerUser: async (userData) => {
        set({
          isLoading: true,
          error: null,
          validationErrors: null,
          message: null,
        });

        try {
          const response = await authAPI.register(userData);
          const { user, token, message } = response.data;

          set({
            isLoading: false,
            user,
            token,
            isAuthenticated: true,
            message:
              message || "Registration successful! Welcome to our platform!",
            error: null,
            validationErrors: null,
          });

          authAPI.setToken(token);
          showSuccessToast(message || "Registration successful!");

          return response.data;
        } catch (error) {
          const errorData = {
            isLoading: false,
            error: error.response?.data?.message || "Registration failed",
            validationErrors: error.response?.data?.errors || null,
            user: null,
            token: null,
            isAuthenticated: false,
          };

          set(errorData);
          showErrorToast(errorData.error);
          throw error;
        }
      },

      loginUser: async (credentials) => {
        set({
          isLoading: true,
          error: null,
          validationErrors: null,
          message: null,
        });

        try {
          const response = await authAPI.login(credentials);
          const { user, token, message } = response.data;

          set({
            isLoading: false,
            user,
            token,
            isAuthenticated: true,
            message: message || `Welcome back, ${user.name}!`,
            error: null,
            validationErrors: null,
          });

          authAPI.setToken(token);
          showSuccessToast(message || `Welcome back, ${user.name}!`);

          return response.data;
        } catch (error) {
          const errorData = {
            isLoading: false,
            error: error.response?.data?.message || "Login failed",
            validationErrors: error.response?.data?.errors || null,
            user: null,
            token: null,
            isAuthenticated: false,
          };

          set(errorData);
          showErrorToast(errorData.error);
          throw error;
        }
      },

      getCurrentUser: async () => {
        const { token } = get();
        if (!token) {
          throw new Error("No token found");
        }

        set({ isLoading: true, error: null });

        try {
          const response = await authAPI.getCurrentUser();
          const { user } = response.data;

          set({
            isLoading: false,
            user,
            isAuthenticated: true,
            error: null,
          });

          return response.data;
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.message || "Failed to get user data",
            user: null,
            token: null,
            isAuthenticated: false,
            validationErrors: null,
          });

          authAPI.clearToken();
          throw error;
        }
      },

      forgotPassword: async (email) => {
        set({
          isLoading: true,
          error: null,
          validationErrors: null,
          message: null,
        });

        try {
          const response = await authAPI.forgotPassword(email);
          const { message } = response.data;

          set({
            isLoading: false,
            message,
          });

          showSuccessToast(message);
          return response.data;
        } catch (error) {
          const errorData = {
            isLoading: false,
            error:
              error.response?.data?.message || "Failed to send reset email",
            validationErrors: error.response?.data?.errors || null,
          };

          set(errorData);
          showErrorToast(errorData.error);
          throw error;
        }
      },

      resetPassword: async (resetData) => {
        set({
          isLoading: true,
          error: null,
          validationErrors: null,
          message: null,
        });

        try {
          const response = await authAPI.resetPassword(resetData);
          const { user, token, message } = response.data;

          set({
            isLoading: false,
            user,
            token,
            isAuthenticated: true,
            message,
          });

          authAPI.setToken(token);
          showSuccessToast(message);

          return response.data;
        } catch (error) {
          const errorData = {
            isLoading: false,
            error: error.response?.data?.message || "Password reset failed",
            validationErrors: error.response?.data?.errors || null,
          };

          set(errorData);
          showErrorToast(errorData.error);
          throw error;
        }
      },

      // Google Authentication Actions
      initiateGoogleLogin: () => {
        set({ isLoading: true });
        try {
          window.location.href = "http://localhost:8080/api/auth/google";
        } catch (error) {
          set({
            isLoading: false,
            error: "Failed to initiate Google login",
          });
          showErrorToast("Failed to initiate Google login");
        }
      },

      handleAuthCallback: async (token) => {
        set({
          isLoading: true,
          error: null,
          validationErrors: null,
          message: null,
        });

        try {
          const response = await authAPI.handleAuthCallback(token);
          const { user } = response;

          set({
            isLoading: false,
            user,
            token,
            isAuthenticated: true,
            message: `Welcome${user.name ? ", " + user.name : ""}!`,
            error: null,
            validationErrors: null,
          });

          showSuccessToast("Successfully logged in with Google");
          return response;
        } catch (error) {
          const errorData = {
            isLoading: false,
            error: "Failed to complete Google authentication",
            user: null,
            token: null,
            isAuthenticated: false,
          };

          set(errorData);
          showErrorToast(errorData.error);
          throw error;
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
