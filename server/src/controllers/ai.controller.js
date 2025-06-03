import { generateMeetingNotes } from "../services/gemini.services.js";

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
