import {
  generateMeetingNotes,
  generateTags,
  generateContentSuggestion,
} from "../services/gemini.services.js";

export const processMeetingTranscript = async (req, res) => {
  try {
    const { transcript } = req.body;

    if (!transcript) {
      return res.status(400).json({ error: "No transcript provided" });
    }

    const notes = await generateMeetingNotes(transcript);

    res.json({
      success: true,
      notes,
    });
  } catch (error) {
    console.error("Error processing meeting transcript:", error);
    res.status(500).json({
      error: "Failed to process meeting transcript",
      details: error.message,
    });
  }
};

export const generateSuggestion = async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "No topic provided" });
    }

    const suggestion = await generateContentSuggestion(topic);

    res.json({
      success: true,
      suggestion,
    });
  } catch (error) {
    console.error("Error generating content suggestion:", error);
    res.status(500).json({
      error: "Failed to generate content suggestion",
      details: error.message,
    });
  }
};

export const generateDocumentTags = async (req, res) => {
  try {
    const { content, existingTags = [] } = req.body;

    if (!content) {
      return res.status(400).json({ error: "No content provided" });
    }

    const tags = await generateTags(content, existingTags);

    res.json({
      success: true,
      tags,
    });
  } catch (error) {
    console.error("Error generating tags:", error);
    res.status(500).json({
      error: "Failed to generate tags",
      details: error.message,
    });
  }
};
