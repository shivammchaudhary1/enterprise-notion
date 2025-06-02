import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  Container,
  useTheme,
} from "@mui/material";
import { workspaceAPI } from "../api/workspaceAPI";
import { formatDistanceToNow } from "date-fns";
import Headers from "../components/Headers";
import Footers from "../components/Footers";

const Spaces = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [publicWorkspaces, setPublicWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublicWorkspaces = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await workspaceAPI.getPublicWorkspaces();
        setPublicWorkspaces(response.data);
      } catch (error) {
        console.error("Failed to fetch public workspaces:", error);
        setError(error.message || "Failed to load public workspaces");
      } finally {
        setLoading(false);
      }
    };

    fetchPublicWorkspaces();
  }, []);

  const handleWorkspaceClick = (workspaceId) => {
    navigate(`/workspace/${workspaceId}`);
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Headers />

      <Container maxWidth="xl" sx={{ flex: 1, py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Public Spaces
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Discover and explore public workspaces shared by the community
          </Typography>
        </Box>

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 200,
            }}
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : publicWorkspaces.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              px: 2,
              bgcolor: "background.paper",
              borderRadius: 2,
              border: "1px dashed",
              borderColor: "divider",
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No public workspaces yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Be the first to share your workspace with the community
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {publicWorkspaces.map((workspace) => (
              <Grid item xs={12} sm={6} md={4} key={workspace._id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    "&:hover": {
                      boxShadow: theme.shadows[4],
                    },
                  }}
                >
                  <CardActionArea
                    onClick={() => handleWorkspaceClick(workspace._id)}
                    sx={{ flex: 1 }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 48,
                            height: 48,
                            bgcolor: "primary.main",
                            fontSize: "1.5rem",
                          }}
                        >
                          {workspace.emoji || workspace.name[0].toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            {workspace.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            component="div"
                          >
                            Created{" "}
                            {formatDistanceToNow(
                              new Date(workspace.createdAt),
                              {
                                addSuffix: true,
                              }
                            )}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {workspace.description || "No description provided"}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        <Chip
                          size="small"
                          label={`${workspace.members?.length || 1} member${
                            workspace.members?.length !== 1 ? "s" : ""
                          }`}
                        />
                        <Chip
                          size="small"
                          label={`${workspace.documents?.length || 0} document${
                            workspace.documents?.length !== 1 ? "s" : ""
                          }`}
                        />
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <Footers />
    </Box>
  );
};

export default Spaces;
