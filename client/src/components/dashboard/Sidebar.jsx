import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  Dialog,
  DialogContent,
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
  Group as GroupIcon,
} from "@mui/icons-material";
import ThemeToggle from "../ui/ThemeToggle";
import { useAuthLogout } from "../../hooks/useAuthLogout";
import { useWorkspace } from "../../hooks/useWorkspace";
import { useDocument } from "../../hooks/useDocument";
import { useAuthStore } from "../../stores";
import CreateWorkspaceModal from "../workspace/CreateWorkspaceModal";
import EnhancedDocumentTree from "../workspace/EnhancedDocumentTree";
import SearchInterface from "../workspace/SearchInterface";
import WorkspaceSwitcher from "../workspace/WorkspaceSwitcher";
import BreadcrumbNavigation from "../workspace/BreadcrumbNavigation";
import WorkspaceMembersModal from "../workspace/WorkspaceMembersModal";

const Sidebar = ({ onDocumentSelect, selectedDocumentId, onSettingsClick }) => {
  const theme = useTheme();
  const handleLogout = useAuthLogout();
  const { user } = useAuthStore();
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
  const [showFavorites, setShowFavorites] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [membersModalOpen, setMembersModalOpen] = useState(false);

  // Load documents when current workspace changes
  useEffect(() => {
    if (currentWorkspace?._id) {
      loadWorkspaceDocuments(currentWorkspace._id);
      loadFavoriteDocuments(currentWorkspace._id);
    }
  }, [currentWorkspace?._id, loadWorkspaceDocuments, loadFavoriteDocuments]);

  // Set first workspace as current if none selected
  useEffect(() => {
    if (!currentWorkspace && workspaces.length > 0) {
      setActiveWorkspace(workspaces[0]);
    }
  }, [workspaces, currentWorkspace, setActiveWorkspace]);

  const handleWorkspaceSelect = (workspace) => {
    setActiveWorkspace(workspace);
  };

  const handleCreateNewPage = async () => {
    if (!currentWorkspace) return;

    try {
      // Don't call unwrap() since we're using Zustand now, not Redux Toolkit
      const newDoc = await createDocument({
        title: "Untitled",
        workspaceId: currentWorkspace._id,
        parent: null,
        position: Array.isArray(documentTree) ? documentTree.length : 0,
      });

      // Refresh documents list after creating a new page
      await loadWorkspaceDocuments(currentWorkspace._id);

      if (onDocumentSelect && newDoc) {
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
      onClick: () => setSearchOpen(true),
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
      icon: <GroupIcon />,
      text: "Members",
      onClick: () => setMembersModalOpen(true),
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
      onClick: onSettingsClick,
    },
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
        overflow: "hidden", // Ensures no double scrollbar
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

      {/* Workspace Switcher */}
      <WorkspaceSwitcher
        workspaces={workspaces}
        currentWorkspace={currentWorkspace}
        onWorkspaceSelect={handleWorkspaceSelect}
        loading={workspaceLoading}
        onWorkspaceSettings={onSettingsClick}
      />

      <Divider sx={{ my: 1 }} />

      {/* Breadcrumb Navigation */}
      {currentWorkspace && (
        <BreadcrumbNavigation
          workspace={currentWorkspace}
          currentDocument={null}
          onDocumentSelect={onDocumentSelect}
        />
      )}

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
      {Array.isArray(favorites) && favorites.length > 0 && (
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
              <EnhancedDocumentTree
                documents={favorites}
                onDocumentSelect={onDocumentSelect}
                selectedDocumentId={selectedDocumentId}
                workspaceId={currentWorkspace?._id}
                isFavorites={true}
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
      <Box
        sx={{
          flexGrow: 1,
          overflow: "auto",
          maxHeight: "calc(100vh - 400px)", // Ensure area is scrollable with max height
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: theme.palette.divider,
            borderRadius: "6px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
        }}
      >
        {documentLoading ? (
          <Box sx={{ px: 2, py: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Loading documents...
            </Typography>
          </Box>
        ) : documentTree && documentTree.length > 0 ? (
          <EnhancedDocumentTree
            documents={documentTree}
            onDocumentSelect={onDocumentSelect}
            selectedDocumentId={selectedDocumentId}
            workspaceId={currentWorkspace?._id}
            showFavorites={showFavorites}
            favorites={favorites}
          />
        ) : (
          <Box sx={{ px: 2, py: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              No pages yet. Create your first page!
            </Typography>
          </Box>
        )}
      </Box>

      {/* Add New */}
      <Box sx={{ px: 1, mt: 2, mb: 2 }}>
        <Button
          startIcon={<AddIcon />}
          onClick={handleCreateNewPage}
          disabled={!currentWorkspace || documentLoading}
          variant="outlined"
          sx={{
            justifyContent: "flex-start",
            color: theme.palette.primary.main,
            textTransform: "none",
            fontSize: "14px",
            fontWeight: 500,
            width: "100%",
            borderColor: theme.palette.divider,
            p: 1,
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
              borderColor: theme.palette.primary.main,
            },
          }}
        >
          Add new page
        </Button>
      </Box>

      <Divider sx={{ my: 1 }} />

      {/* Add New Workspace */}
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

      {/* Search Dialog */}
      <Dialog
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxHeight: "70vh",
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <SearchInterface
            workspaceId={currentWorkspace?._id}
            onDocumentSelect={(doc) => {
              onDocumentSelect(doc);
              setSearchOpen(false);
            }}
            onClose={() => setSearchOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Workspace Members Modal */}
      <WorkspaceMembersModal
        open={membersModalOpen}
        onClose={() => setMembersModalOpen(false)}
        workspace={currentWorkspace}
      />
    </Box>
  );
};

export default Sidebar;
