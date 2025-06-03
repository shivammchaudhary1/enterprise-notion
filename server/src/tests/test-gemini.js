import { parseTasksFromText } from "../services/gemini.services.js";

const testGeminiService = async () => {
  try {
    const testInput =
      "Create a high priority presentation for the marketing team by tomorrow at 3pm, and assign it to John";
    const userName = "TestUser";
    const userContacts = [{ shortName: "John", fullName: "John Smith" }];

    console.log("Testing Gemini service with input:", testInput);
    const result = await parseTasksFromText(testInput, userName, userContacts);
    console.log("\nParsed Tasks:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Test failed:", error);
  }
};

testGeminiService();
