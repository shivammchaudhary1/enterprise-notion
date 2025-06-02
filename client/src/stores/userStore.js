import { create } from "zustand";
import * as userAPI from "../redux/api/userAPI";

const useUserStore = create((set, get) => ({
  // State
  profile: null,
  preferences: {
    theme: "light",
    notifications: true,
    emailNotifications: true,
  },
  loading: false,
  error: null,

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  setLocalTheme: (theme) =>
    set((state) => ({
      preferences: { ...state.preferences, theme },
    })),

  // Async Actions
  fetchUserProfile: async () => {
    set({ loading: true, error: null });

    try {
      const response = await userAPI.getUserProfile();
      const profile = response.data;

      set({
        loading: false,
        profile,
        preferences: profile.preferences || get().preferences,
        error: null,
      });

      return profile;
    } catch (error) {
      const errorMessage = error.message || "Failed to fetch user profile";

      set({
        loading: false,
        error: errorMessage,
      });

      throw error;
    }
  },

  updateProfile: async (profileData) => {
    set({ loading: true, error: null });

    try {
      const response = await userAPI.updateProfile(profileData);
      const updatedProfile = response.data;

      set({
        loading: false,
        profile: updatedProfile,
        preferences: updatedProfile.preferences || get().preferences,
        error: null,
      });

      return updatedProfile;
    } catch (error) {
      const errorMessage = error.message || "Failed to update profile";

      set({
        loading: false,
        error: errorMessage,
      });

      throw error;
    }
  },

  fetchUserPreferences: async () => {
    const state = get();

    // Prevent multiple simultaneous calls
    if (state.loading) {
      return state.preferences;
    }

    set({ loading: true, error: null });

    try {
      const response = await userAPI.getUserPreferences();

      set({
        loading: false,
        preferences: response.data,
        error: null,
      });

      return response.data;
    } catch (error) {
      const errorMessage = error.message || "Failed to fetch preferences";

      set({
        loading: false,
        error: errorMessage,
      });

      // Return current preferences instead of throwing
      // This prevents the component from retrying continuously
      console.warn("Using local preferences due to API error:", errorMessage);
      return state.preferences;
    }
  },

  updatePreferences: async (preferencesData) => {
    set({ loading: true, error: null });

    try {
      const response = await userAPI.updatePreferences(preferencesData);

      set({
        loading: false,
        preferences: response.data.preferences || response.data,
        error: null,
      });

      return response.data;
    } catch (error) {
      const errorMessage = error.message || "Failed to update preferences";

      set({
        loading: false,
        error: errorMessage,
      });

      throw error;
    }
  },
}));

export default useUserStore;
