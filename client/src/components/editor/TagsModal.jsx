import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  CircularProgress,
  IconButton,
  TextField,
  Alert,
  useTheme,
} from "@mui/material";
import {
  Close as CloseIcon,
  LocalOffer as TagIcon,
  Add as AddIcon,
  Tag as HashtagIcon,
} from "@mui/icons-material";
import { useDocument } from "../../hooks/useDocument";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import useAIStore from "../../store/useAIStore";

const TagsModal = ({ open, onClose, currentDocument }) => {
  const theme = useTheme();
  const { updateDocument } = useDocument();
  const [selectedTags, setSelectedTags] = useState([]);
  const [customTag, setCustomTag] = useState("");

  // Get AI store state and actions
  const {
    loading,
    error,
    generatedTags,
    generateTags,
    clearGeneratedTags,
    clearError,
  } = useAIStore();

  useEffect(() => {
    if (open && currentDocument) {
      // Initialize selected tags from document metadata
      setSelectedTags(currentDocument.metadata?.tags || []);
      // Clear any previous generated tags when modal opens
      clearGeneratedTags();
    }
  }, [open, currentDocument, clearGeneratedTags]);

  const handleGenerateTags = async () => {
    if (!currentDocument?.content) {
      showErrorToast("No content to analyze");
      return;
    }

    try {
      // Extract text content from the document
      const textContent = extractTextFromContent(currentDocument.content);
      await generateTags(textContent, selectedTags);
    } catch (err) {
      showErrorToast(err.message || "Failed to generate tags");
    }
  };

  const extractTextFromContent = (content) => {
    let text = "";
    const extractFromNode = (node) => {
      if (node.type === "text") {
        text += node.text + " ";
      } else if (node.content) {
        node.content.forEach(extractFromNode);
      }
    };

    if (content.content) {
      content.content.forEach(extractFromNode);
    }
    return text.trim();
  };

  const handleTagSelect = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const handleAddCustomTag = () => {
    const trimmedTag = customTag.trim().replace(/^#/, ""); // Remove # if user added it
    if (trimmedTag && !selectedTags.includes(trimmedTag)) {
      setSelectedTags([...selectedTags, trimmedTag]);
      setCustomTag("");
    }
  };

  const handleSave = async () => {
    try {
      // Preserve existing metadata while updating tags
      const updatedMetadata = {
        ...(currentDocument.metadata || {}),
        tags: selectedTags,
      };

      // Update document with new metadata
      const response = await updateDocument(currentDocument._id, {
        metadata: updatedMetadata,
      });

      if (!response.data?.document) {
        throw new Error("Failed to update document");
      }

      showSuccessToast("Tags updated successfully");
      onClose();
    } catch (err) {
      console.error("Error saving tags:", err);
      showErrorToast(err.message || "Failed to save tags");
    }
  };

  // Clear error when modal closes
  useEffect(() => {
    if (!open) {
      clearError();
    }
  }, [open, clearError]);

  // Custom styles for chips
  const tagChipStyle = {
    borderRadius: "16px",
    "& .MuiChip-label": {
      fontWeight: 500,
    },
    "& .MuiChip-icon": {
      color: "inherit",
      marginLeft: "4px",
    },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TagIcon color="primary" />
          <Typography variant="h6" fontWeight="bold">
            Document Tags
          </Typography>
        </Box>
        <IconButton onClick={onClose} disabled={loading} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Selected Tags */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
            Selected Tags
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {selectedTags.length > 0 ? (
              selectedTags.map((tag) => (
                <Chip
                  key={tag}
                  label={`#${tag}`}
                  onDelete={() => handleTagRemove(tag)}
                  color="primary"
                  icon={<HashtagIcon />}
                  sx={{
                    ...tagChipStyle,
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                  }}
                />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No tags selected
              </Typography>
            )}
          </Box>
        </Box>

        {/* Add Custom Tag */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
            Add Custom Tag
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              size="small"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              placeholder="Enter a tag (without #)"
              fullWidth
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAddCustomTag();
                }
              }}
              InputProps={{
                startAdornment: (
                  <HashtagIcon sx={{ color: "text.secondary", mr: 1 }} />
                ),
              }}
            />
            <Button
              variant="contained"
              onClick={handleAddCustomTag}
              disabled={!customTag.trim()}
              startIcon={<AddIcon />}
            >
              Add
            </Button>
          </Box>
        </Box>

        {/* AI Generated Tags */}
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1.5,
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              AI Suggested Tags
            </Typography>
            <Button
              size="small"
              onClick={handleGenerateTags}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} /> : null}
              variant="outlined"
            >
              {loading ? "Generating..." : "Generate"}
            </Button>
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {generatedTags.length > 0 ? (
              generatedTags.map((tag) => (
                <Chip
                  key={tag}
                  label={`#${tag}`}
                  onClick={() => handleTagSelect(tag)}
                  icon={<HashtagIcon />}
                  variant="outlined"
                  sx={{
                    ...tagChipStyle,
                    opacity: selectedTags.includes(tag) ? 0.5 : 1,
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                {loading
                  ? "Generating tags..."
                  : "Click generate to get AI suggested tags"}
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 3,
          pt: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading}
          startIcon={<TagIcon />}
        >
          Save Tags
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TagsModal;
