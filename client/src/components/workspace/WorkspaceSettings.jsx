import React, { useState } from "react";
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Alert,
  Divider,
  useTheme,
  CircularProgress,
} from "@mui/material";
import {
  Close as CloseIcon,
  Settings as SettingsIcon,
  Public as PublicIcon,
  Lock as LockIcon,
  Group as GroupIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { useWorkspace } from "../../hooks/useWorkspace";

const WorkspaceSettings = ({ open, onClose, workspace }) => {
  const theme = useTheme();
  const { updateWorkspace, updateLoading } = useWorkspace();

  const [formData, setFormData] = useState({
    name: workspace?.name || "",
    description: workspace?.description || "",
    emoji: workspace?.emoji || "🏠",
    settings: {
      isPublic: workspace?.settings?.isPublic || false,
      allowMemberInvites: workspace?.settings?.allowMemberInvites || false,
    },
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSettingChange = (setting) => (event) => {
    setFormData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [setting]: event.target.checked,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await updateWorkspace(workspace._id, formData);
      setSuccess("Workspace settings updated successfully");
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setError(error.message || "Failed to update workspace settings");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
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
          <SettingsIcon color="primary" />
          <Typography variant="h6" fontWeight="bold">
            Workspace Settings
          </Typography>
        </Box>
        <IconButton onClick={onClose} disabled={updateLoading}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              Basic Information
            </Typography>
            <TextField
              fullWidth
              label="Workspace Name"
              value={formData.name}
              onChange={handleInputChange("name")}
              disabled={updateLoading}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={handleInputChange("description")}
              multiline
              rows={3}
              disabled={updateLoading}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              Visibility & Access
            </Typography>

            <Box sx={{ mb: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.settings.isPublic}
                    onChange={handleSettingChange("isPublic")}
                    disabled={updateLoading}
                  />
                }
                label={
                  <Box sx={{ ml: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {formData.settings.isPublic ? (
                        <PublicIcon color="primary" />
                      ) : (
                        <LockIcon color="action" />
                      )}
                      <Typography variant="body1" fontWeight="medium">
                        {formData.settings.isPublic
                          ? "Public Workspace"
                          : "Private Workspace"}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {formData.settings.isPublic
                        ? "Anyone can view this workspace"
                        : "Only invited members can access this workspace"}
                    </Typography>
                  </Box>
                }
              />
            </Box>

            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.settings.allowMemberInvites}
                    onChange={handleSettingChange("allowMemberInvites")}
                    disabled={updateLoading}
                  />
                }
                label={
                  <Box sx={{ ml: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <GroupIcon
                        color={
                          formData.settings.allowMemberInvites
                            ? "primary"
                            : "action"
                        }
                      />
                      <Typography variant="body1" fontWeight="medium">
                        Member Invitations
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {formData.settings.allowMemberInvites
                        ? "Members can invite others to this workspace"
                        : "Only admins can invite members"}
                    </Typography>
                  </Box>
                }
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={onClose}
            disabled={updateLoading}
            sx={{
              textTransform: "none",
              borderRadius: 2,
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={updateLoading}
            startIcon={
              updateLoading ? <CircularProgress size={20} /> : <EditIcon />
            }
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 3,
            }}
          >
            {updateLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default WorkspaceSettings;
