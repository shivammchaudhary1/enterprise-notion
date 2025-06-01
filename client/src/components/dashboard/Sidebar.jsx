import React, { useState, useEffect } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Divider,
  Button,
  useTheme,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Search as SearchIcon,
  Home as HomeIcon,
  Inbox as InboxIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  People as PeopleIcon,
  Help as HelpIcon,
  Logout as LogoutIcon,
  ExpandMore as ExpandMoreIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import ThemeToggle from "../ui/ThemeToggle";
import { useAuthLogout } from "../../hooks/useAuthLogout";
import { useWorkspace } from "../../hooks/useWorkspace";
import { useDocument } from "../../hooks/useDocument";
import { useSelector } from "react-redux";
import CreateWorkspaceModal from "../workspace/CreateWorkspaceModal";
import DocumentTree from "../workspace/DocumentTree";

const Sidebar = ({ onDocumentSelect, selectedDocumentId }) => {
  const theme = useTheme();
  const handleLogout = useAuthLogout();
  const { user } = useSelector((state) => state.auth);
  const {
    workspaces,
    currentWorkspace,
    loadUserWorkspaces,
    setActiveWorkspace,
    loading: workspaceLoading,
  } = useWorkspace();
  const {
    documentTree,
    favorites,
    loadWorkspaceDocuments,
    loadFavoriteDocuments,
    createDocument,
    loading: documentLoading,
  } = useDocument();

  const [createWorkspaceOpen, setCreateWorkspaceOpen] = useState(false);
  const [workspaceMenuAnchor, setWorkspaceMenuAnchor] = useState(null);
  const [showFavorites, setShowFavorites] = useState(false);

  // Load user workspaces on component mount
  useEffect(() => {
    loadUserWorkspaces();
  }, [loadUserWorkspaces]);

  // Load documents when current workspace changes
  useEffect(() => {
    if (currentWorkspace) {
      loadWorkspaceDocuments(currentWorkspace._id);
      loadFavoriteDocuments(currentWorkspace._id);
    }
  }, [currentWorkspace, loadWorkspaceDocuments, loadFavoriteDocuments]);

  // Set first workspace as current if none selected
  useEffect(() => {
    if (workspaces.length > 0 && !currentWorkspace) {
      setActiveWorkspace(workspaces[0]);
    }
  }, [workspaces, currentWorkspace, setActiveWorkspace]);

  const handleWorkspaceSelect = (workspace) => {
    setActiveWorkspace(workspace);
    setWorkspaceMenuAnchor(null);
  };

  const handleCreateNewPage = async () => {
    if (!currentWorkspace) return;

    try {
      const newDoc = await createDocument({
        title: "Untitled",
        workspace: currentWorkspace._id,
        parent: null,
        position: documentTree.length,
      }).unwrap();

      if (onDocumentSelect) {
        onDocumentSelect(newDoc);
      }
    } catch (error) {
      console.error("Failed to create document:", error);
    }
  };

  const menuItems = [
    {
      icon: <SearchIcon />,
      text: "Search",
      shortcut: "⌘K",
      onClick: () => {
        // TODO: Implement search modal
      },
    },
    {
      icon: <HomeIcon />,
      text: "Home",
      onClick: () => {
        if (onDocumentSelect) {
          onDocumentSelect(null);
        }
      },
    },
    {
      icon: <InboxIcon />,
      text: "Inbox",
      onClick: () => {
        // TODO: Implement inbox
      },
    },
    {
      icon: <SettingsIcon />,
      text: "Settings",
      onClick: () => {
        // TODO: Implement settings
      },
    },
  ];

  const teamspaces = [
    { name: "Shivam Chaudhary's Workspace", emoji: "🏠", active: true },
    { name: "Engineering Docs", emoji: "📋" },
  ];

  return (
    <Box
      sx={{
        width: 240,
        height: "100vh",
        backgroundColor: theme.palette.background.sidebar,
        borderRight: `1px solid ${theme.palette.divider}`,
        display: "flex",
        flexDirection: "column",
        p: 1,
      }}
    >
      {/* User Header */}
      <Box sx={{ p: 1, mb: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar
              sx={{
                width: 24,
                height: 24,
                fontSize: "12px",
                bgcolor: "#8b5cf6",
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </Avatar>
            <Typography variant="body2" fontWeight={500} color="text.primary">
              {user?.name || "User"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <ThemeToggle size="small" variant="dropdown" />
            <IconButton
              onClick={handleLogout}
              size="small"
              sx={{
                color: theme.palette.text.secondary,
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                  color: theme.palette.error.main,
                },
                transition: "all 0.2s ease",
              }}
              title="Logout"
            >
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Search and Main Menu */}
      <List sx={{ px: 0 }}>
        {menuItems.map((item, index) => (
          <ListItem
            key={index}
            onClick={item.onClick}
            sx={{
              py: 0.5,
              px: 1,
              borderRadius: 1,
              cursor: "pointer",
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <ListItemIcon
              sx={{ minWidth: 32, color: theme.palette.text.secondary }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{
                "& .MuiListItemText-primary": {
                  fontSize: "14px",
                  fontWeight: 400,
                  color: theme.palette.text.primary,
                },
              }}
            />
            {item.shortcut && (
              <Typography variant="caption" color="text.secondary">
                {item.shortcut}
              </Typography>
            )}
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 1 }} />

      {/* Favorites Section */}
      {favorites.length > 0 && (
        <>
          <Box sx={{ px: 1, mb: 1 }}>
            <Button
              onClick={() => setShowFavorites(!showFavorites)}
              sx={{
                justifyContent: "flex-start",
                color: theme.palette.text.secondary,
                textTransform: "none",
                fontSize: "12px",
                fontWeight: 600,
                width: "100%",
                minHeight: "auto",
                p: 0,
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
              endIcon={
                <ExpandMoreIcon
                  sx={{
                    transform: showFavorites
                      ? "rotate(0deg)"
                      : "rotate(-90deg)",
                    transition: "transform 0.2s",
                    fontSize: "16px",
                  }}
                />
              }
            >
              <StarIcon sx={{ fontSize: 16, mr: 1 }} />
              Favorites
            </Button>
          </Box>

          {showFavorites && (
            <Box sx={{ mb: 2 }}>
              <DocumentTree
                documents={favorites}
                onDocumentSelect={onDocumentSelect}
                selectedDocumentId={selectedDocumentId}
              />
            </Box>
          )}

          <Divider sx={{ my: 1 }} />
        </>
      )}

      {/* Private Section */}
      <Box sx={{ px: 1, mb: 1 }}>
        <Typography variant="caption" color="text.secondary" fontWeight={600}>
          Private
        </Typography>
      </Box>

      {/* Document Tree */}
      <Box sx={{ flexGrow: 1, overflow: "auto" }}>
        {documentLoading ? (
          <Box sx={{ px: 2, py: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Loading documents...
            </Typography>
          </Box>
        ) : (
          <DocumentTree
            documents={documentTree}
            onDocumentSelect={onDocumentSelect}
            selectedDocumentId={selectedDocumentId}
          />
        )}
      </Box>

      {/* Add New */}
      <Box sx={{ px: 1, mt: 2 }}>
        <Button
          startIcon={<AddIcon />}
          onClick={handleCreateNewPage}
          disabled={!currentWorkspace || documentLoading}
          sx={{
            justifyContent: "flex-start",
            color: theme.palette.text.secondary,
            textTransform: "none",
            fontSize: "14px",
            fontWeight: 400,
            width: "100%",
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          Add new page
        </Button>
      </Box>

      <Divider sx={{ my: 1 }} />

      {/* Teamspaces */}
      <Box sx={{ px: 1, mb: 1 }}>
        <Typography variant="caption" color="text.secondary" fontWeight={600}>
          Teamspaces
        </Typography>
      </Box>

      <List sx={{ px: 0 }}>
        {workspaceLoading ? (
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Loading workspaces...
            </Typography>
          </Box>
        ) : workspaces.length > 0 ? (
          workspaces.map((workspace) => (
            <ListItem
              key={workspace._id}
              onClick={() => handleWorkspaceSelect(workspace)}
              sx={{
                py: 0.5,
                px: 1,
                borderRadius: 1,
                cursor: "pointer",
                backgroundColor:
                  currentWorkspace?._id === workspace._id
                    ? theme.palette.action.selected
                    : "transparent",
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <Box sx={{ mr: 1, fontSize: "14px" }}>
                {workspace.emoji || "🏠"}
              </Box>
              <ListItemText
                primary={workspace.name}
                sx={{
                  "& .MuiListItemText-primary": {
                    fontSize: "14px",
                    fontWeight:
                      currentWorkspace?._id === workspace._id ? 500 : 400,
                    color: theme.palette.text.primary,
                  },
                }}
              />
            </ListItem>
          ))
        ) : (
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="body2" color="text.secondary">
              No workspaces yet
            </Typography>
          </Box>
        )}
      </List>

      {/* Add New Teamspace */}
      <Box sx={{ px: 1, mb: 2 }}>
        <Button
          startIcon={<AddIcon />}
          onClick={() => setCreateWorkspaceOpen(true)}
          sx={{
            justifyContent: "flex-start",
            color: theme.palette.text.secondary,
            textTransform: "none",
            fontSize: "14px",
            fontWeight: 400,
            width: "100%",
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          Add new workspace
        </Button>
      </Box>

      {/* Bottom Icons */}
      <Box sx={{ px: 1, pb: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            sx={{
              minWidth: "auto",
              p: 0.5,
              color: theme.palette.text.secondary,
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <PeopleIcon fontSize="small" />
          </Button>
          <Button
            sx={{
              minWidth: "auto",
              p: 0.5,
              color: theme.palette.text.secondary,
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <HelpIcon fontSize="small" />
          </Button>
        </Box>

        {/* Logout Button */}
        <Divider sx={{ mt: 2, mb: 1 }} />
        <Button
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
          fullWidth
          sx={{
            justifyContent: "flex-start",
            px: 2,
            py: 1,
            color: theme.palette.text.secondary,
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
              color: theme.palette.error.main,
            },
            transition: "all 0.2s ease",
            textTransform: "none",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          Logout
        </Button>
      </Box>

      {/* Create Workspace Modal */}
      <CreateWorkspaceModal
        open={createWorkspaceOpen}
        onClose={() => setCreateWorkspaceOpen(false)}
      />
    </Box>
  );
};

export default Sidebar;
