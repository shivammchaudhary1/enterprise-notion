import { GoogleGenerativeAI } from "@google/generative-ai";
import { getWorkspaceContent } from "../utils/workspaceUtils.js";

class AssistantService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async processQuery(question, history = [], workspaceId) {
    try {
      // Get relevant workspace content
      const relevantContent = await getWorkspaceContent(question, workspaceId);
      

      // Convert history format to Gemini's format
      const formattedHistory = history.map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));

      // Start a new chat
      const chat = this.model.startChat({
        history: formattedHistory,
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.7,
        },
      });

      // Generate response
      const prompt = `You are a helpful workspace assistant. Answer questions based on the following workspace content: ${relevantContent.content}. 
                     If the workspace content doesn't contain relevant information, clearly indicate that you're using general knowledge.
                     Question: ${question}`;

      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      const answer = response.text();

      return {
        answer,
        sources: relevantContent.sources || [],
      };
    } catch (error) {
      console.error("Error processing assistant query:", error);
      throw new Error("Failed to process your question. Please try again.");
    }
  }
}

export default new AssistantService();
