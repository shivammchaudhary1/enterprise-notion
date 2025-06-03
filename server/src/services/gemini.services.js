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

/**
 * Generate structured meeting notes from a transcript
 * @param {string} transcript - The meeting transcript text
 * @returns {Promise<string>} - Structured meeting notes in markdown format
 */
export const generateMeetingNotes = async (transcript) => {
  if (
    !transcript ||
    typeof transcript !== "string" ||
    transcript.trim().length === 0
  ) {
    throw new Error(
      "Invalid transcript provided. Please provide a non-empty string."
    );
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `As an AI assistant, analyze the following meeting transcript and create professional, well-structured meeting notes. Ensure the notes are concise, clear, and well-organized, using markdown for proper headings and bullet points.

Include the following sections:

1.  **Meeting Summary**: A brief overview of the discussion, 2-3 sentences.
2.  **Key Points & Decisions**: Important discussion points and any decisions made.
3.  **Action Items**: Specific tasks to be completed, including assignees if explicitly mentioned in the transcript.
4.  **Follow-up Tasks**: Any tasks that require subsequent attention or review.
5.  **Important Dates/Deadlines**: Any crucial dates or deadlines that were discussed.

---
Transcript:
${transcript}
---

Your response should strictly adhere to the markdown format with appropriate headings and bullet points as outlined above. Do not include any conversational filler or introductory/concluding remarks outside of the generated notes.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    if (!response || !response.text()) {
      throw new Error("The AI model did not return a valid response.");
    }

    return response.text();
  } catch (error) {
    console.error("Error generating meeting notes:", error);
    // Provide a more user-friendly error message
    throw new Error(
      "Failed to generate meeting notes. Please try again later or check the transcript content."
    );
  }
};

/**
 * Generate semantic tags from document content
 * @param {string} content - The document content to analyze
 * @param {string[]} existingTags - Array of existing tags to avoid duplicates
 * @returns {Promise<string[]>} - Array of generated tags
 */
export const generateTags = async (content, existingTags = []) => {
  if (!content || typeof content !== "string" || content.trim().length === 0) {
    throw new Error(
      "Invalid content provided. Please provide a non-empty string."
    );
  }

  const prompt = `
    Analyze the following text content and generate relevant semantic tags that would be useful for search and categorization.
    The tags should be specific, descriptive, and help in understanding the main topics and themes of the content.
    
    Rules for tag generation:
    1. Generate between 5-10 tags
    2. Each tag should be 1-3 words maximum
    3. Tags should be in lowercase
    4. Focus on key topics, themes, and domain-specific terminology
    5. Avoid generic tags that don't add value
    6. Consider technical terms if present
    7. Include any mentioned technologies, tools, or frameworks
    
    Here are the existing tags (avoid duplicates): ${existingTags.join(", ")}
    
    Content to analyze:
    ${content}
    
    Return only a JSON array of tags, nothing else. Example format: ["tag1", "tag2", "tag3"]
  `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean and parse the response
    let cleanedText = text.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText
        .replace(/^```json\s*/, "")
        .replace(/\s*```$/, "");
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    let tags;
    try {
      tags = JSON.parse(cleanedText);
      if (!Array.isArray(tags)) {
        throw new Error("AI response is not an array");
      }
    } catch (parseError) {
      // If parsing fails, try to extract tags from the text response
      tags = cleanedText
        .replace(/[\[\]"]/g, "")
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
    }

    // Remove any duplicates with existing tags
    const uniqueTags = tags.filter((tag) => !existingTags.includes(tag));
    return uniqueTags;
  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw new Error(`Failed to generate tags: ${error.message}`);
  }
};
