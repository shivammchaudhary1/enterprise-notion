import { create } from "zustand";
import { aiAPI } from "../redux/api/aiAPI";

const useAIStore = create((set) => ({
  // State
  isLoading: false,
  error: null,
  generatedNotes: "",

  // Actions
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  setGeneratedNotes: (notes) => set({ generatedNotes: notes }),

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

  clearState: () => {
    set({
      isLoading: false,
      error: null,
      generatedNotes: "",
    });
  },
}));

export default useAIStore;
