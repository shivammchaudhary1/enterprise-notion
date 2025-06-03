import { create } from "zustand";
import { assistantAPI } from "../redux/api/assistantAPI";
import { showErrorToast } from "../utils/toast";

const useAssistantStore = create((set, get) => ({
  // State
  messages: [],
  isLoading: false,
  error: null,

  // Actions
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  clearMessages: () => set({ messages: [] }),

  // Async Actions
  sendMessage: async (message) => {
    if (!message || typeof message !== "string" || !message.trim()) {
      showErrorToast("Please enter a valid message");
      return;
    }

    set({ isLoading: true, error: null });

    try {
      // Get current messages
      const currentMessages = get().messages;

      // Create user message
      const userMessage = {
        content: message.trim(),
        timestamp: Date.now(),
        role: "user",
      };

      // Add user message to state immediately
      set((state) => ({
        messages: [...state.messages, userMessage],
      }));

      // Format conversation history
      const conversationHistory = currentMessages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      console.log("Sending message to API:", {
        message: message.trim(),
        historyLength: conversationHistory.length,
        history: conversationHistory,
      });

      // Send to API
      const response = await assistantAPI.query(
        message.trim(),
        conversationHistory
      );

      console.log("Received API response:", response);

      // Validate response
      if (!response || typeof response.answer !== "string") {
        throw new Error("Invalid response format from API");
      }

      // Create assistant message
      const assistantMessage = {
        content: response.answer,
        timestamp: Date.now(),
        sources: Array.isArray(response.sources) ? response.sources : [],
        role: "assistant",
      };

      // Update state with assistant message
      set((state) => ({
        messages: [...state.messages, assistantMessage],
        isLoading: false,
        error: null,
      }));

      return assistantMessage;
    } catch (error) {
      console.error("Error in sendMessage:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to get assistant response";
      set({
        isLoading: false,
        error: errorMessage,
      });
      showErrorToast(errorMessage);
      throw error;
    }
  },
}));

export default useAssistantStore;
