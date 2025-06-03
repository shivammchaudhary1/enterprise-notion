import { create } from "zustand";
import { aiAPI } from "../redux/api/aiAPI";

const useAIStore = create((set) => ({
  // State
  loading: false,
  error: null,
  generatedTags: [],

  // Actions
  generateTags: async (content, existingTags = []) => {
    set({ loading: true, error: null });
    try {
      const response = await aiAPI.generateTags(content, existingTags);
      set({ generatedTags: response.tags || [], loading: false });
      return response;
    } catch (error) {
      set({
        error: error.message || "Failed to generate tags",
        loading: false,
      });
      throw error;
    }
  },

  clearGeneratedTags: () => {
    set({ generatedTags: [], error: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));

export default useAIStore;
