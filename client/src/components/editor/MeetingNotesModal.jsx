import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
  Typography,
  Paper,
  IconButton,
  Alert,
  useTheme,
} from "@mui/material";
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import useAIStore from "../../stores/aiStore";
import { useDocument } from "../../hooks/useDocument";
import { useWorkspace } from "../../hooks/useWorkspace";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import ReactMarkdown from "react-markdown";

const MeetingNotesModal = ({ open, onClose, onSave, currentDocument }) => {
  const theme = useTheme();
  const [transcript, setTranscript] = useState("");
  const [saving, setSaving] = useState(false);
  const { generateMeetingNotes, clearState, isLoading, error, generatedNotes } =
    useAIStore();
  const { updateDocument } = useDocument();
  const { currentWorkspace } = useWorkspace();

  useEffect(() => {
    if (open) {
      clearState();
      setTranscript("");
    }
  }, [open, clearState]);

  const handleGenerateNotes = async () => {
    if (!transcript.trim()) {
      showErrorToast("Please enter a meeting transcript");
      return;
    }

    try {
      await generateMeetingNotes(transcript);
    } catch (err) {
      showErrorToast(err.message || "Failed to generate meeting notes");
      console.error("Failed to generate notes:", err);
    }
  };

  const handleSaveNotes = async () => {
    if (!generatedNotes || !currentWorkspace?._id || !currentDocument?._id) {
      showErrorToast("Cannot save notes: No workspace or document selected");
      return;
    }

    setSaving(true);
    try {
      // Get the current document's content
      const currentContent = currentDocument.content || {
        type: "doc",
        content: [],
      };

      // Parse the markdown content into proper document structure
      const meetingNotesContent = [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [
            {
              type: "text",
              text: `Meeting Notes - ${new Date().toLocaleDateString()}`,
            },
          ],
        },
      ];

      // Split the generated notes by line and convert to proper structure
      const notesLines = generatedNotes.split("\n");
      notesLines.forEach((line) => {
        if (line.trim()) {
          if (line.startsWith("#")) {
            // Handle headings
            const level = line.match(/^#+/)[0].length;
            const text = line.replace(/^#+\s*/, "");
            meetingNotesContent.push({
              type: "heading",
              attrs: { level: Math.min(level, 3) },
              content: [{ type: "text", text }],
            });
          } else if (line.startsWith("- ") || line.startsWith("* ")) {
            // Handle bullet points
            const text = line.replace(/^[-*]\s*/, "");
            meetingNotesContent.push({
              type: "bulletList",
              content: [
                {
                  type: "listItem",
                  content: [
                    {
                      type: "paragraph",
                      content: [{ type: "text", text }],
                    },
                  ],
                },
              ],
            });
          } else {
            // Regular paragraph
            meetingNotesContent.push({
              type: "paragraph",
              content: [{ type: "text", text: line }],
            });
          }
        }
      });

      // Create new content by combining existing content with meeting notes
      const updatedContent = {
        type: "doc",
        content: [
          ...(currentContent.content || []),
          // Add a divider before meeting notes
          {
            type: "horizontalRule",
          },
          ...meetingNotesContent,
        ],
      };

      // Update the existing document
      const response = await updateDocument(currentDocument._id, {
        content: updatedContent,
        metadata: {
          ...currentDocument.metadata,
          lastMeetingNotes: {
            addedAt: new Date().toISOString(),
            transcript: transcript,
          },
        },
      });

      // Extract the updated document from the response
      const updatedDoc = response.data?.document || response.data;

      if (!updatedDoc) {
        throw new Error("Failed to update document: Invalid response format");
      }

      showSuccessToast("Meeting notes added to document");
      if (onSave) onSave(updatedDoc);
      handleClose();
    } catch (err) {
      console.error("Error saving notes:", err);
      showErrorToast(err.message || "Failed to save meeting notes");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setTranscript("");
    clearState();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          height: "80vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <DescriptionIcon color="primary" />
          <Typography variant="h6" fontWeight="bold">
            {generatedNotes
              ? "Generated Meeting Notes"
              : "Generate Meeting Notes"}
          </Typography>
        </Box>
        <IconButton onClick={handleClose} disabled={isLoading || saving}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!currentDocument && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Please select a document to add meeting notes
          </Alert>
        )}

        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <CircularProgress />
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            height: "100%",
          }}
        >
          {!generatedNotes ? (
            <TextField
              multiline
              rows={15}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Paste your meeting transcript here..."
              fullWidth
              variant="outlined"
              disabled={isLoading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
              }}
            />
          ) : (
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                height: "100%",
                overflow: "auto",
                bgcolor: "background.default",
                "& img": { maxWidth: "100%" },
                "& h1, & h2, & h3": {
                  mt: 2,
                  mb: 1,
                  fontWeight: "bold",
                  fontFamily: theme.typography.fontFamily,
                },
                "& h1": { fontSize: "1.8rem" },
                "& h2": { fontSize: "1.4rem" },
                "& h3": { fontSize: "1.2rem" },
                "& ul, & ol": { pl: 3, mb: 2 },
                "& p": { mb: 1.5, lineHeight: 1.6 },
                "& li": { mb: 0.5 },
                "& code": {
                  bgcolor: "background.paper",
                  px: 0.5,
                  py: 0.25,
                  borderRadius: 0.5,
                  fontFamily: "monospace",
                },
              }}
            >
              <ReactMarkdown>{generatedNotes}</ReactMarkdown>
            </Paper>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={handleClose}
          disabled={isLoading || saving}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Cancel
        </Button>
        {!generatedNotes ? (
          <Button
            onClick={handleGenerateNotes}
            variant="contained"
            disabled={isLoading || !transcript.trim()}
            sx={{ textTransform: "none", borderRadius: 2, px: 3 }}
          >
            {isLoading ? "Generating..." : "Generate Notes"}
          </Button>
        ) : (
          <Button
            onClick={handleSaveNotes}
            variant="contained"
            disabled={saving || !currentDocument}
            startIcon={<SaveIcon />}
            sx={{ textTransform: "none", borderRadius: 2, px: 3 }}
          >
            {saving ? "Saving..." : "Add to Document"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default MeetingNotesModal;
