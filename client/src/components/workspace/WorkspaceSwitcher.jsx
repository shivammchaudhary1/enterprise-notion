import React, { useState } from "react";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Typography,
  Avatar,
  Divider,
  ListItemIcon,
  ListItemText,
  IconButton,
  useTheme,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import { useWorkspace } from "../../hooks/useWorkspace";
import { useDocument } from "../../hooks/useDocument";
import CreateWorkspaceModal from "./CreateWorkspaceModal";

const WorkspaceSwitcher = ({ onWorkspaceSettings, onMemberManagement }) => {
  const theme = useTheme();
  const { workspaces, currentWorkspace, setActiveWorkspace, loading } =
    useWorkspace();
  const { resetDocumentState, loadWorkspaceDocuments } = useDocument();

  const [anchorEl, setAnchorEl] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [error, setError] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleWorkspaceSelect = async (workspace) => {
    try {
      setError(null);

      if (!workspace?._id) {
        console.error("Invalid workspace selected:", workspace);
        setError("Invalid workspace selected");
        return;
      }

      console.log("Starting workspace switch to:", workspace.name);

      // Reset document state before switching workspace
      console.log("Resetting document state...");
      try {
        await resetDocumentState();
        console.log("Document state reset completed");
      } catch (resetError) {
        console.error("Error resetting document state:", resetError);
        setError("Failed to reset document state");
        return;
      }

      // Set the active workspace
      console.log("Setting active workspace...");
      try {
        await setActiveWorkspace(workspace);
        console.log("Active workspace set successfully");
      } catch (workspaceError) {
        console.error("Error setting active workspace:", workspaceError);
        setError("Failed to set active workspace");
        return;
      }

      // Load the documents for the new workspace
      console.log("Loading workspace documents...");
      try {
        await loadWorkspaceDocuments(workspace._id);
        console.log("Workspace documents loaded successfully");
      } catch (loadError) {
        console.error("Error loading workspace documents:", loadError);
        setError("Failed to load workspace documents");
        return;
      }

      console.log("Workspace switch completed successfully");
      handleMenuClose();
    } catch (error) {
      console.error("Error switching workspace:", {
        error,
        workspace,
        errorMessage: error.message,
        stack: error.stack,
      });
      setError(error.message || "Failed to switch workspace");
      // Keep the menu open if there's an error
      return;
    }
  };

  const handleCreateWorkspace = () => {
    setCreateModalOpen(true);
    handleMenuClose();
  };

  const handleWorkspaceSettings = () => {
    if (onWorkspaceSettings && currentWorkspace) {
      onWorkspaceSettings(currentWorkspace);
    }
    handleMenuClose();
  };

  const handleMemberManagement = () => {
    if (onMemberManagement && currentWorkspace) {
      onMemberManagement(currentWorkspace);
    }
    handleMenuClose();
  };

  const getWorkspaceAvatar = (workspace) => {
    if (workspace.emoji) {
      return (
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1,
            backgroundColor: theme.palette.primary.main,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
          }}
        >
          {workspace.emoji}
        </Box>
      );
    }

    return (
      <Avatar
        sx={{
          width: 32,
          height: 32,
          borderRadius: 1,
          backgroundColor: theme.palette.primary.main,
          fontSize: "14px",
          fontWeight: 600,
        }}
      >
        {workspace.name.charAt(0).toUpperCase()}
      </Avatar>
    );
  };

  if (!currentWorkspace) {
    return (
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleCreateWorkspace}
          disabled={loading}
        >
          Create Workspace
        </Button>
        <CreateWorkspaceModal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
        />
      </Box>
    );
  }

  return (
    <Box>
      {/* Current Workspace Display */}
      <Button
        fullWidth
        onClick={handleMenuOpen}
        sx={{
          justifyContent: "space-between",
          p: 1.5,
          borderRadius: 2,
          textTransform: "none",
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {getWorkspaceAvatar(currentWorkspace)}
          <Box sx={{ textAlign: "left", overflow: "hidden" }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: 150,
              }}
            >
              {currentWorkspace.name}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: 150,
                display: "block",
              }}
            >
              {currentWorkspace.memberCount || 0} member
              {currentWorkspace.memberCount !== 1 ? "s" : ""}
            </Typography>
          </Box>
        </Box>
        <ExpandMoreIcon sx={{ color: theme.palette.text.secondary }} />
      </Button>

      {/* Workspace Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            width: 280,
            maxHeight: 400,
          },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {error && (
          <Box
            sx={{ p: 2, bgcolor: "error.light", color: "error.contrastText" }}
          >
            <Typography variant="body2">{error}</Typography>
          </Box>
        )}

        {/* Current Workspace Header */}
        <Box sx={{ p: 2, backgroundColor: theme.palette.grey[50] }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            {getWorkspaceAvatar(currentWorkspace)}
            <Box>
              <Typography variant="subtitle2" fontWeight={600}>
                {currentWorkspace.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {currentWorkspace.memberCount || 0} member
                {currentWorkspace.memberCount !== 1 ? "s" : ""}
              </Typography>
            </Box>
          </Box>

          {/* Quick Actions */}
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={handleWorkspaceSettings}
              title="Workspace Settings"
            >
              <SettingsIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={handleMemberManagement}
              title="Manage Members"
            >
              <PeopleIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Divider />

        {/* Other Workspaces */}
        <Box sx={{ maxHeight: 200, overflow: "auto" }}>
          {workspaces
            .filter((ws) => ws._id !== currentWorkspace._id)
            .map((workspace) => (
              <MenuItem
                key={workspace._id}
                onClick={() => handleWorkspaceSelect(workspace)}
                sx={{ py: 1 }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {getWorkspaceAvatar(workspace)}
                </ListItemIcon>
                <ListItemText
                  primary={workspace.name}
                  secondary={`${workspace.memberCount || 0} member${
                    workspace.memberCount !== 1 ? "s" : ""
                  }`}
                  primaryTypographyProps={{
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                  secondaryTypographyProps={{
                    fontSize: "12px",
                  }}
                />
              </MenuItem>
            ))}
        </Box>

        <Divider />

        {/* Create New Workspace */}
        <MenuItem onClick={handleCreateWorkspace} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText
            primary="Create workspace"
            primaryTypographyProps={{
              fontSize: "14px",
              fontWeight: 500,
            }}
          />
        </MenuItem>
      </Menu>

      {/* Create Workspace Modal */}
      <CreateWorkspaceModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </Box>
  );
};

export default WorkspaceSwitcher;
