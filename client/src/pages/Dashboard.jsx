import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores";
import { useAuthLogout } from "../hooks/useAuthLogout";
import { Box, Alert, CircularProgress, Typography } from "@mui/material";
import Sidebar from "../components/dashboard/Sidebar";
import MainContent from "../components/dashboard/MainContent";
import RightSidebar from "../components/dashboard/RightSidebar";
import { useWorkspace } from "../hooks/useWorkspace";
import { useDocument } from "../hooks/useDocument";
import WorkspaceSettings from "../components/workspace/WorkspaceSettings";

const Dashboard = () => {
  const navigate = useNavigate();
  const handleLogout = useAuthLogout();
  const { user, isAuthenticated, message, clearMessage } = useAuthStore();
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Get workspace and document loading states from hooks
  const {
    loading: workspaceLoading,
    error: workspaceError,
    workspaces,
    currentWorkspace,
  } = useWorkspace();
  const {
    loading: documentLoading,
    error: documentError,
    documents,
    loadWorkspaceDocuments,
  } = useDocument();

  // Check for authentication
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }
  }, [isAuthenticated, navigate]);

  // Load documents when workspace changes and set default document
  useEffect(() => {
    const loadDocuments = async () => {
      if (currentWorkspace?._id) {
        await loadWorkspaceDocuments(currentWorkspace._id);
      }
    };

    loadDocuments();
  }, [currentWorkspace?._id, loadWorkspaceDocuments]);

  // Set default document when documents are loaded
  useEffect(() => {
    if (documents.length > 0 && !selectedDocument) {
      // Find the "Getting Started" document or use the first document
      const defaultDoc =
        documents.find((doc) => doc.title === "Getting Started") ||
        documents[0];
      setSelectedDocument(defaultDoc);
    }
  }, [documents, selectedDocument]);

  // Clear welcome message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        clearMessage();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, clearMessage]);

  const handleDocumentSelect = (document) => {
    setSelectedDocument(document);
  };

  const handleSettingsOpen = () => {
    setSettingsOpen(true);
  };

  const handleSettingsClose = () => {
    setSettingsOpen(false);
  };

  // Show loader when loading workspaces or documents
  if (workspaceLoading && !workspaces.length) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading your workspaces...
        </Typography>
      </Box>
    );
  }

  // Show error if there's an issue fetching workspaces
  if (workspaceError && !workspaces.length) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          p: 3,
        }}
      >
        <Typography variant="h6" color="error" gutterBottom>
          Error loading workspaces
        </Typography>
        <Typography color="text.secondary">{workspaceError}</Typography>
        <Box sx={{ mt: 2 }}>
          <button onClick={handleLogout}>Logout and retry</button>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Show welcome message if exists */}
      {message && (
        <Box
          sx={{
            position: "fixed",
            top: 16,
            right: 16,
            zIndex: 1000,
            maxWidth: 400,
          }}
        >
          <Alert
            severity="success"
            sx={{
              borderRadius: 2,
              "& .MuiAlert-message": {
                fontSize: "1rem",
              },
            }}
          >
            {message}
          </Alert>
        </Box>
      )}

      {/* Show document error if any */}
      {documentError && (
        <Box
          sx={{
            position: "fixed",
            top: message ? 80 : 16,
            right: 16,
            zIndex: 1000,
            maxWidth: 400,
          }}
        >
          <Alert
            severity="error"
            sx={{
              borderRadius: 2,
              "& .MuiAlert-message": {
                fontSize: "1rem",
              },
            }}
          >
            {documentError}
          </Alert>
        </Box>
      )}

      {/* Left Sidebar */}
      <Box
        sx={{
          width: 300,
          flexShrink: 0,
          borderRight: "1px solid",
          borderColor: "divider",
          backgroundColor: "background.sidebar",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Sidebar
          onDocumentSelect={handleDocumentSelect}
          selectedDocumentId={selectedDocument?._id}
          onSettingsClick={handleSettingsOpen}
        />
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {selectedDocument ? (
          <MainContent
            selectedDocument={selectedDocument}
            onDocumentSelect={handleDocumentSelect}
            isLoading={documentLoading}
          />
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              p: 3,
              textAlign: "center",
            }}
          >
            <Typography variant="h5" gutterBottom>
              Welcome to {currentWorkspace?.name || "your workspace"}
            </Typography>
            <Typography color="text.secondary">
              Select a document from the sidebar or create a new one to get
              started
            </Typography>
          </Box>
        )}
      </Box>

      {/* Right Sidebar */}
      <Box
        sx={{
          width: 300,
          flexShrink: 0,
          borderLeft: "1px solid",
          borderColor: "divider",
          backgroundColor: "background.sidebar",
          p: 3,
          overflowY: "auto",
        }}
      >
        <RightSidebar />
      </Box>

      {/* Workspace Settings Modal */}
      <WorkspaceSettings
        open={settingsOpen}
        onClose={handleSettingsClose}
        workspace={currentWorkspace}
      />
    </Box>
  );
};

export default Dashboard;
