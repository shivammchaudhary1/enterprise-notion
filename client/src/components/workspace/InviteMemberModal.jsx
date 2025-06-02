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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  IconButton,
  Chip,
  useTheme,
  CircularProgress,
} from "@mui/material";
import {
  Close as CloseIcon,
  PersonAdd as PersonAddIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import { useWorkspace } from "../../hooks/useWorkspace";

const InviteMemberModal = ({ open, onClose, workspaceId, onSuccess }) => {
  const theme = useTheme();
  const { addMember } = useWorkspace();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const roles = [
    { value: "viewer", label: "Viewer", description: "Can view and comment" },
    {
      value: "editor",
      label: "Editor",
      description: "Can view, comment, and edit",
    },
    {
      value: "admin",
      label: "Admin",
      description: "Can manage members and settings",
    },
  ];

  const handleClose = () => {
    if (!loading) {
      setEmail("");
      setRole("viewer");
      setError("");
      setSuccess("");
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!workspaceId) {
      setError("No workspace selected");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await addMember(workspaceId, {
        email: email.trim().toLowerCase(),
        role,
      });

      // Handle different response types
      const responseData = response?.data || response;

      if (responseData.workspace) {
        // Existing user was added directly
        setSuccess(`${email} has been added to the workspace`);
      } else if (responseData.invitation) {
        // New user - invitation was sent
        setSuccess(`Invitation sent to ${email}`);
      } else {
        // Fallback success message
        setSuccess(`Successfully processed invitation for ${email}`);
      }

      setEmail("");
      setRole("viewer");

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }

      // Close modal after a short delay to show success message
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error) {
      console.error("Failed to invite member:", error);
      setError(error.message || "Failed to send invitation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: theme.shadows[10],
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
          <PersonAddIcon color="primary" />
          <Typography variant="h6" fontWeight="bold">
            Invite Member
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          disabled={loading}
          sx={{ color: theme.palette.text.secondary }}
        >
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
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter the email address of the person you want to invite"
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <EmailIcon sx={{ color: "action.active", mr: 1 }} />
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth disabled={loading}>
              <InputLabel>Role</InputLabel>
              <Select
                value={role}
                label="Role"
                onChange={(e) => setRole(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                {roles.map((roleOption) => (
                  <MenuItem key={roleOption.value} value={roleOption.value}>
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {roleOption.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {roleOption.description}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              The person will receive an email invitation to join this
              workspace. They'll need to create an account if they don't have
              one already.
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleClose}
            disabled={loading}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 3,
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !email.trim()}
            startIcon={
              loading ? <CircularProgress size={20} /> : <PersonAddIcon />
            }
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 3,
              minWidth: 120,
            }}
          >
            {loading ? "Sending..." : "Send Invitation"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default InviteMemberModal;
