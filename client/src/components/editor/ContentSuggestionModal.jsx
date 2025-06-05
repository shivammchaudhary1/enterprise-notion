import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import useAIStore from "../../stores/aiStore";
import { showErrorToast } from "../../utils/toast";

const ContentSuggestionModal = ({ open, onClose, onSave, currentDocument }) => {
  const [topic, setTopic] = useState("");
  const {
    isLoading,
    contentSuggestion,
    generateContentSuggestion,
    clearState,
  } = useAIStore();

  const handleGenerateClick = async () => {
    if (!topic.trim()) {
      showErrorToast("Please enter a topic");
      return;
    }

    try {
      await generateContentSuggestion(topic);
    } catch (error) {
      console.error("Failed to generate content suggestion:", error);
      showErrorToast(error.message || "Failed to generate content suggestion");
    }
  };

  const handleSaveClick = () => {
    if (contentSuggestion && onSave) {
      onSave(contentSuggestion);
      handleClose();
    }
  };

  const handleClose = () => {
    setTopic("");
    clearState();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>AI Content Suggestion</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3, mt: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Enter a topic, and the AI will generate a brief content suggestion.
          </Typography>
          <TextField
            label="Topic"
            variant="outlined"
            fullWidth
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter your topic here..."
            disabled={isLoading}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleGenerateClick}
            disabled={isLoading || !topic.trim()}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Generate"
            )}
          </Button>
        </Box>

        {contentSuggestion && (
          <Box
            sx={{
              p: 2,
              mt: 2,
              bgcolor: "action.hover",
              borderRadius: 1,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Generated Suggestion:
            </Typography>
            <Typography variant="body1">{contentSuggestion}</Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleSaveClick}
          variant="contained"
          disabled={!contentSuggestion}
        >
          Save to Document
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContentSuggestionModal;
