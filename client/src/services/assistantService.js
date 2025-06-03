import api from "../api/axios";

class AssistantService {
  async query(question, history = [], workspaceId) {
    try {
      const response = await api.post("/api/assistant/query", {
        question,
        history,
        workspaceId,
      });
      return response.data;
    } catch (error) {
      console.error("Error querying assistant:", error);
      throw error;
    }
  }
}

export default new AssistantService();
