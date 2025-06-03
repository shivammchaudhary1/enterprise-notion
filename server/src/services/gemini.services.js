import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../config/environment/default.js";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(config.geminiApiKey);

/**
 * Parse natural language text to extract structured task data
 * @param {string} textInput - Raw text input from user
 * @param {string} userName - Name of the logged-in user
 * @param {Array} userContacts - User's contacts for assignee resolution
 * @returns {Promise<Array>} - Array of parsed tasks
 */
export const parseTasksFromText = async (
  textInput,
  userName,
  userContacts = []
) => {
  try {
    // Get current date in IST
    const currentDate = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const istDate = new Date(currentDate.getTime() + istOffset);
    const currentDateTime =
      istDate.toISOString().slice(0, 19).replace("T", " ") + " IST";

    // Create contacts lookup string
    const contactsInfo =
      userContacts.length > 0
        ? `Known contacts: ${userContacts
            .map((c) => `${c.shortName} (${c.fullName})`)
            .join(", ")}`
        : "No contacts available";

    const prompt = `
SYSTEM INSTRUCTION: You are a task extraction assistant that identifies tasks from natural language text and structures them according to specific rules.

USER CONTEXT: The current date and time is ${currentDateTime}. The logged-in user is ${userName}. ${contactsInfo}

USER INPUT: ${textInput}

REQUIRED OUTPUT FORMAT: Generate a JSON array where each item represents a task with the following properties:
- taskName: string (concise action, max 100 chars)
- assignee: string (defaulting to the logged-in user if not specified)
- dueDate: string (ISO 8601 UTC format converted from IST interpretation)
- priority: string (P1, P2, P3, or P4, defaulting to P3)
- confidence: number (0.0-1.0 indicating parsing confidence)

IMPORTANT: The output must match the MongoDB task schema structure exactly:
{
  taskName: String (required, max 100 chars),
  assignee: String (required),
  dueDate: Date (required, ISO format),
  priority: String (enum: ["P1", "P2", "P3", "P4"], default: "P3"),
  createdBy: ObjectId (will be added by backend),
  confidence: Number (min: 0.0, max: 1.0, default: 1.0),
  createdAt: Date (auto-generated)
}

PARSING RULES:

1. TASK NAME EXTRACTION:
   - Extract concise phrase describing core action and subject
   - Maximum 100 characters
   - Use "-" if core action is unclear
   - Examples: "Finish presentation slides", "Call with marketing team"

2. ASSIGNEE RESOLUTION:
   - Default to "${userName}" if no assignee specified
   - Cross-reference with contacts list when available
   - Use full name if found in contacts, otherwise use mentioned name

3. DUE DATE PARSING:
   - Convert all dates to ISO 8601 UTC format
   - Interpret input as IST (Indian Standard Time)
   - Default time: 23:59:59 IST if only date provided
   - Special keywords: "noon" = 12:00:00 PM IST, "midnight" = 12:00:00 AM IST
   - Relative dates based on current date: ${currentDateTime}

4. PRIORITY ASSIGNMENT:
   - P1: Critical/urgent tasks (keywords: urgent, ASAP, critical, top priority)
   - P2: High importance (keywords: important, high priority)
   - P3: Normal tasks (default)
   - P4: Low priority (keywords: low priority, when you have time)

5. CONFIDENCE SCORE:
   - High confidence: 0.8-1.0 (clear, unambiguous tasks)
   - Medium confidence: 0.5-0.79 (some ambiguity)
   - Low confidence: <0.5 (requires manual confirmation)

Return ONLY the JSON array, no additional text or formatting.`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean and parse the response
    let cleanedText = text.trim();

    // Remove markdown code block markers if present
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText
        .replace(/^```json\s*/, "")
        .replace(/\s*```$/, "");
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    let parsedTasks;
    try {
      parsedTasks = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Raw response:", text);
      throw new Error("Failed to parse AI response into valid JSON");
    }

    // Validate and sanitize the parsed tasks
    if (!Array.isArray(parsedTasks)) {
      throw new Error("AI response is not an array");
    }

    // Validate each task and convert dates
    const validatedTasks = parsedTasks.map((task, index) => {
      // Validate required fields
      if (!task.taskName || typeof task.taskName !== "string") {
        task.taskName = "-";
        task.confidence = Math.min(task.confidence || 0, 0.3);
      }

      if (!task.assignee || typeof task.assignee !== "string") {
        task.assignee = userName;
      }

      if (!task.priority || !["P1", "P2", "P3", "P4"].includes(task.priority)) {
        task.priority = "P3";
      }

      if (
        typeof task.confidence !== "number" ||
        task.confidence < 0 ||
        task.confidence > 1
      ) {
        task.confidence = 0.5;
      }

      // Convert due date to proper Date object
      if (task.dueDate) {
        try {
          const dueDate = new Date(task.dueDate);
          if (isNaN(dueDate.getTime())) {
            // If invalid date, set to end of today in IST converted to UTC
            const today = new Date();
            today.setHours(23, 59, 59, 999);
            task.dueDate = today.toISOString();
            task.confidence = Math.min(task.confidence, 0.4);
          } else {
            task.dueDate = dueDate.toISOString();
          }
        } catch (error) {
          // Fallback to end of today
          const today = new Date();
          today.setHours(23, 59, 59, 999);
          task.dueDate = today.toISOString();
          task.confidence = Math.min(task.confidence, 0.4);
        }
      } else {
        // Default to end of today if no due date
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        task.dueDate = today.toISOString();
        task.confidence = Math.min(task.confidence, 0.5);
      }

      return task;
    });

    return validatedTasks;
  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw new Error(`Failed to parse tasks: ${error.message}`);
  }
};
