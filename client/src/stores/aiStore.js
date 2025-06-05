import { create } from "zustand";
import { aiAPI } from "../redux/api/aiAPI";

const useAIStore = create((set) => ({
  // State
  isLoading: false,
  error: null,
  generatedNotes: "",
  contentSuggestion: "",

  // Actions
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  setGeneratedNotes: (notes) => set({ generatedNotes: notes }),
  setContentSuggestion: (suggestion) => set({ contentSuggestion: suggestion }),

  // Async Actions
  generateMeetingNotes: async (transcript) => {
    set({ isLoading: true, error: null, generatedNotes: "" });

    try {
      const response = await aiAPI.generateMeetingNotes(transcript);

      if (!response.success || !response.notes) {
        throw new Error("Invalid response format from server");
      }

      set({
        generatedNotes: response.notes,
        isLoading: false,
        error: null,
      });

      return response.notes;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to generate meeting notes";
      console.error("Error generating meeting notes:", error);

      set({
        error: errorMessage,
        isLoading: false,
        generatedNotes: "",
      });
      throw error;
    }
  },

  generateContentSuggestion: async (topic) => {
    set({ isLoading: true, error: null, contentSuggestion: "" });

    try {
      const response = await aiAPI.generateContentSuggestion(topic);

      if (!response.success || !response.suggestion) {
        throw new Error("Invalid response format from server");
      }

      set({
        contentSuggestion: response.suggestion,
        isLoading: false,
        error: null,
      });

      return response.suggestion;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to generate content suggestion";
      console.error("Error generating content suggestion:", error);

      set({
        error: errorMessage,
        isLoading: false,
        contentSuggestion: "",
      });
      throw error;
    }
  },

  clearState: () => {
    set({
      isLoading: false,
      error: null,
      generatedNotes: "",
      contentSuggestion: "",
    });
  },
}));

export default useAIStore;
