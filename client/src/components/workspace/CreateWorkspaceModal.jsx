import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  IconButton,
  useTheme,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useWorkspace } from "../../hooks/useWorkspace";
import { showSuccessToast, showErrorToast } from "../../utils/toast";

const EMOJI_OPTIONS = [
  "🏠",
  "📋",
  "💼",
  "🚀",
  "💡",
  "📚",
  "🎯",
  "⚡",
  "🔬",
  "🎨",
];

const CreateWorkspaceModal = ({ open, onClose }) => {
  const theme = useTheme();
  const { createWorkspace, createLoading } = useWorkspace();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    emoji: "🏠",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleEmojiSelect = (emoji) => {
    setFormData((prev) => ({
      ...prev,
      emoji,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Workspace name is required";
    } else if (formData.name.length > 100) {
      newErrors.name = "Workspace name cannot exceed 100 characters";
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = "Description cannot exceed 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const newWorkspace = await createWorkspace(formData);
      showSuccessToast("Workspace created successfully!");
      handleClose();
    } catch (error) {
      showErrorToast(error.message || "Failed to create workspace");
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      emoji: "🏠",
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={600}>
            Create New Workspace
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 2 }}>
          {/* Emoji Selection */}
          <Box mb={3}>
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              Choose an icon
            </Typography>
            <Grid container spacing={1}>
              {EMOJI_OPTIONS.map((emoji) => (
                <Grid item key={emoji}>
                  <IconButton
                    onClick={() => handleEmojiSelect(emoji)}
                    sx={{
                      border: `2px solid ${
                        formData.emoji === emoji
                          ? theme.palette.primary.main
                          : "transparent"
                      }`,
                      borderRadius: 1,
                      fontSize: "20px",
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    {emoji}
                  </IconButton>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Workspace Name */}
          <TextField
            fullWidth
            label="Workspace Name"
            value={formData.name}
            onChange={handleInputChange("name")}
            error={!!errors.name}
            helperText={errors.name}
            sx={{ mb: 2 }}
            autoFocus
            required
          />

          {/* Description */}
          <TextField
            fullWidth
            label="Description (optional)"
            value={formData.description}
            onChange={handleInputChange("description")}
            error={!!errors.description}
            helperText={errors.description}
            multiline
            rows={3}
            placeholder="What's this workspace for?"
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} disabled={createLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={createLoading || !formData.name.trim()}
            sx={{
              minWidth: 100,
              textTransform: "none",
            }}
          >
            {createLoading ? "Creating..." : "Create Workspace"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateWorkspaceModal;
