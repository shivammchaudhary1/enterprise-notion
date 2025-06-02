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

const Dashboard = () => {
  const navigate = useNavigate();
  const handleLogout = useAuthLogout();
  const { user, isAuthenticated, message, clearMessage } = useAuthStore();
  const [selectedDocument, setSelectedDocument] = useState(null);

  // Get workspace and document loading states from hooks
  const {
    loading: workspaceLoading,
    error: workspaceError,
    workspaces,
  } = useWorkspace();
  const { loading: documentLoading, error: documentError } = useDocument();

  // Check for authentication
  useEffect(() => {
    // Redirect to home if not authenticated
    if (!isAuthenticated) {
      navigate("/");
      return;
    }
  }, [isAuthenticated, navigate]);

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
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
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
      <Sidebar
        onDocumentSelect={handleDocumentSelect}
        selectedDocumentId={selectedDocument?._id}
      />

      {/* Main Content */}
      <MainContent
        selectedDocument={selectedDocument}
        onDocumentSelect={handleDocumentSelect}
      />

      {/* Right Sidebar */}
      <RightSidebar />
    </Box>
  );
};

export default Dashboard;
