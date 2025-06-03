import assistantService from "../services/assistant.service.js";

class AssistantController {
  async query(req, res) {
    try {
      const { question, history, workspaceId } = req.body;

      if (!question) {
        return res.status(400).json({ error: "Question is required" });
      }

      const response = await assistantService.processQuery(
        question,
        history,
        workspaceId
      );

      return res.json(response);
    } catch (error) {
      console.error("Assistant controller error:", error);
      return res.status(500).json({
        error: "An error occurred while processing your request",
      });
    }
  }
}

export default new AssistantController();
