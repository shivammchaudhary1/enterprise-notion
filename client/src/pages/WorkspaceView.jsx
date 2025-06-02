import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Grid,
  Paper,
  Avatar,
  Chip,
} from "@mui/material";
import { workspaceAPI } from "../redux/api/workspaceAPI";
import { formatDistanceToNow } from "date-fns";
import Headers from "../components/Headers";
import Footers from "../components/Footers";
import { useAuthStore } from "../stores";

const WorkspaceView = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await workspaceAPI.getPublicWorkspaceById(workspaceId);
        setWorkspace(response.data.workspace);
      } catch (error) {
        console.error("Failed to fetch workspace:", error);
        if (error.response?.status === 403) {
          // If access denied and user is not authenticated, redirect to login
          if (!isAuthenticated) {
            navigate("/login", {
              state: { from: `/workspace/${workspaceId}` },
            });
            return;
          }
        }
        setError(error.message || "Failed to load workspace");
      } finally {
        setLoading(false);
      }
    };

    if (workspaceId) {
      fetchWorkspace();
    }
  }, [workspaceId, isAuthenticated, navigate]);

  const handleBack = () => {
    navigate("/spaces");
  };

  const handleLogin = () => {
    navigate("/login", { state: { from: `/workspace/${workspaceId}` } });
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Headers />
        <Container maxWidth="xl" sx={{ flex: 1, py: 4 }}>
          <Button onClick={handleBack} sx={{ mb: 2 }}>
            Back to Spaces
          </Button>
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            action={
              !isAuthenticated && (
                <Button color="inherit" size="small" onClick={handleLogin}>
                  Log in
                </Button>
              )
            }
          >
            {error}
          </Alert>
        </Container>
        <Footers />
      </Box>
    );
  }

  if (!workspace) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Headers />
        <Container maxWidth="xl" sx={{ flex: 1, py: 4 }}>
          <Button onClick={handleBack} sx={{ mb: 2 }}>
            Back to Spaces
          </Button>
          <Alert severity="error" sx={{ mb: 2 }}>
            Workspace not found
          </Alert>
        </Container>
        <Footers />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Headers />

      <Container maxWidth="xl" sx={{ flex: 1, py: 4 }}>
        <Button onClick={handleBack} sx={{ mb: 2 }}>
          Back to Spaces
        </Button>

        <Paper sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: "primary.main",
                fontSize: "2rem",
              }}
            >
              {workspace.emoji || workspace.name[0].toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h4" gutterBottom>
                {workspace.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Created{" "}
                {formatDistanceToNow(new Date(workspace.createdAt), {
                  addSuffix: true,
                })}
              </Typography>
            </Box>
          </Box>

          <Typography variant="body1" sx={{ mb: 3 }}>
            {workspace.description || "No description provided"}
          </Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Chip
              label={`${workspace.members?.length || 1} member${
                workspace.members?.length !== 1 ? "s" : ""
              }`}
            />
            <Chip
              label={`${workspace.documents?.length || 0} document${
                workspace.documents?.length !== 1 ? "s" : ""
              }`}
            />
          </Box>
        </Paper>

        {/* Add more workspace content here */}
      </Container>

      <Footers />
    </Box>
  );
};

export default WorkspaceView;
