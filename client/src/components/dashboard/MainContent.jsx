import React, { useState } from "react";
import {
  Box,
  Typography,
  InputAdornment,
  TextField,
  Button,
  useTheme,
  Paper,
  Breadcrumbs,
  Link,
  IconButton,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Share as ShareIcon,
  MoreHoriz as MoreHorizIcon,
  Upload as ImportIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import { useAuthStore } from "../../stores";
import { useDocument } from "../../hooks/useDocument";
import { useWorkspace } from "../../hooks/useWorkspace";
import DocumentEditor from "../editor/DocumentEditor";
import InviteMemberModal from "../workspace/InviteMemberModal";

const MainContent = ({ selectedDocument, onDocumentSelect, isLoading }) => {
  const theme = useTheme();
  const { user } = useAuthStore();
  const { currentWorkspace } = useWorkspace();
  const {
    documents,
    toggleFavorite,
    isFavorite,
    getDocumentPath,
    searchDocuments,
    searchResults,
    searchLoading,
    clearSearch,
  } = useDocument();

  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setShowSearchResults(false);
      clearSearch();
      return;
    }

    if (currentWorkspace) {
      await searchDocuments(currentWorkspace._id, query);
      setShowSearchResults(true);
    }
  };

  const handleToggleFavorite = async () => {
    if (selectedDocument) {
      await toggleFavorite(selectedDocument._id);
    }
  };

  const handleSearchResultClick = (document) => {
    if (onDocumentSelect) {
      onDocumentSelect(document);
    }
    setShowSearchResults(false);
    setSearchQuery("");
    clearSearch();
  };

  const formatTime = () => {
    const now = new Date();
    const hour = now.getHours();

    if (hour < 12) return "morning";
    if (hour < 17) return "afternoon";
    return "evening";
  };

  // Show loading state
  if (isLoading) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // If no document is selected, show the home page
  if (!selectedDocument) {
    return (
      <Box
        sx={{
          flex: 1,
          p: 4,
          backgroundColor: theme.palette.background.default,
          overflowY: "auto",
        }}
      >
        <Box sx={{ maxWidth: 800, mx: "auto" }}>
          {/* Greeting */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 4,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.1)"
                    : "#f3f2f1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 2,
                fontSize: "18px",
              }}
            >
              🌟
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 400,
                color: theme.palette.text.primary,
                fontSize: "28px",
              }}
            >
              Good {formatTime()}, {user?.name || "there"}
            </Typography>
          </Box>

          {/* Search Bar */}
          <TextField
            fullWidth
            placeholder="Ask or find anything from your workspace..."
            variant="outlined"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: theme.palette.text.secondary }} />
                </InputAdornment>
              ),
              sx: {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.05)"
                    : "#f7f6f3",
                borderRadius: 2,
                border: "none",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: "1px solid #2196f3",
                },
              },
            }}
            sx={{ mb: 4 }}
          />

          {/* Search Results */}
          {showSearchResults && (
            <Paper
              sx={{
                p: 2,
                mb: 4,
                backgroundColor: theme.palette.background.paper,
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Search Results
              </Typography>
              {searchLoading ? (
                <Typography color="text.secondary">Searching...</Typography>
              ) : searchResults.length > 0 ? (
                searchResults.map((doc) => (
                  <Box
                    key={doc._id}
                    onClick={() => handleSearchResultClick(doc)}
                    sx={{
                      p: 2,
                      mb: 1,
                      borderRadius: 1,
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <Typography variant="body1" fontWeight={500}>
                      {doc.emoji} {doc.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {doc.workspace?.name || currentWorkspace?.name}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography color="text.secondary">
                  No results found for "{searchQuery}"
                </Typography>
              )}
            </Paper>
          )}

          {/* Quick Actions */}
          {!showSearchResults && (
            <Box sx={{ mt: 6 }}>
              <Typography
                variant="h6"
                sx={{ mb: 3, color: theme.palette.text.primary }}
              >
                Quick Actions
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                    px: 3,
                    borderColor: theme.palette.divider,
                    color: theme.palette.text.primary,
                    "&:hover": {
                      borderColor: theme.palette.primary.main,
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  Create a page
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ImportIcon />}
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                    px: 3,
                    borderColor: theme.palette.divider,
                    color: theme.palette.text.primary,
                    "&:hover": {
                      borderColor: theme.palette.primary.main,
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  Import data
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<PersonAddIcon />}
                  onClick={() => setInviteModalOpen(true)}
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                    px: 3,
                    borderColor: theme.palette.divider,
                    color: theme.palette.text.primary,
                    "&:hover": {
                      borderColor: theme.palette.primary.main,
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  Invite team
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    );
  }

  // If a document is selected, show the document editor
  return (
    <Box
      sx={{
        flex: 1,
        height: "100vh",
        backgroundColor: theme.palette.background.default,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Document Header */}
      <Box
        sx={{
          p: 3,
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        {/* Document Path */}
        {selectedDocument.parent && (
          <Breadcrumbs sx={{ mb: 2 }}>
            <Link
              component="button"
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              {currentWorkspace?.emoji} {currentWorkspace?.name}
            </Link>
            {getDocumentPath(selectedDocument._id, documents)
              .slice(0, -1)
              .map((doc) => (
                <Link
                  key={doc._id}
                  component="button"
                  variant="body2"
                  onClick={() => onDocumentSelect(doc)}
                  sx={{
                    color: theme.palette.text.secondary,
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  {doc.emoji} {doc.title}
                </Link>
              ))}
          </Breadcrumbs>
        )}

        {/* Document Title and Actions */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
                mr: 2,
              }}
            >
              {selectedDocument.emoji} {selectedDocument.title}
            </Typography>

            {/* Document Status */}
            <Box sx={{ display: "flex", gap: 1, ml: 2 }}>
              {isFavorite(selectedDocument._id) && (
                <Chip
                  icon={<StarIcon />}
                  label="Favorite"
                  size="small"
                  sx={{
                    backgroundColor: theme.palette.warning.light,
                    color: theme.palette.warning.dark,
                  }}
                />
              )}
            </Box>
          </Box>

          {/* Document Actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              onClick={handleToggleFavorite}
              sx={{
                color: isFavorite(selectedDocument._id)
                  ? theme.palette.warning.main
                  : theme.palette.text.secondary,
              }}
            >
              {isFavorite(selectedDocument._id) ? (
                <StarIcon />
              ) : (
                <StarBorderIcon />
              )}
            </IconButton>
            <IconButton sx={{ color: theme.palette.text.secondary }}>
              <ShareIcon />
            </IconButton>
            <IconButton sx={{ color: theme.palette.text.secondary }}>
              <MoreHorizIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Document Metadata */}
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Created by {selectedDocument.author?.name || "Unknown"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            •
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {new Date(selectedDocument.createdAt).toLocaleDateString()}
          </Typography>
          {selectedDocument.updatedAt &&
            selectedDocument.updatedAt !== selectedDocument.createdAt && (
              <>
                <Typography variant="body2" color="text.secondary">
                  •
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Updated{" "}
                  {new Date(selectedDocument.updatedAt).toLocaleDateString()}
                </Typography>
              </>
            )}
        </Box>
      </Box>

      {/* Document Editor */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          p: { xs: 2, sm: 4 },
          maxWidth: "900px",
          mx: "auto",
          width: "100%",
        }}
      >
        <DocumentEditor document={selectedDocument} />
      </Box>

      {/* Modals */}
      <InviteMemberModal
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        workspaceId={currentWorkspace?._id}
      />
    </Box>
  );
};

export default MainContent;
