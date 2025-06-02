import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Chip,
  Avatar,
  Divider,
  useTheme,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import { useAuth } from "../../hooks/useAuth";
import { invitationAPI } from "../../api/invitationAPI";

const InvitationAccept = () => {
  const theme = useTheme();
  const { token } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Invalid invitation link");
      setLoading(false);
      return;
    }

    fetchInvitation();
  }, [token]);

  const fetchInvitation = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await invitationAPI.getByToken(token);
      setInvitation(response.data);
    } catch (error) {
      console.error("Failed to fetch invitation:", error);
      setError(error.message || "Invalid or expired invitation");
    } finally {
      setLoading(false);
    }
  };
  const handleAccept = async () => {
    if (!invitation) return;

    try {
      setAccepting(true);
      setError("");

      const response = await invitationAPI.accept(token);
      const responseData = response.data;

      // Always redirect to login page after successful invitation acceptance
      setSuccess(
        responseData.message ||
          "Invitation accepted successfully! Please login to access the workspace."
      );

      // Redirect to login after a delay
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Failed to accept invitation:", error);
      setError(error.message || "Failed to accept invitation");
    } finally {
      setAccepting(false);
    }
  };

  const handleDecline = async () => {
    if (!invitation) return;

    try {
      setError("");

      await invitationAPI.cancel(invitation._id);
      setSuccess("Invitation declined.");

      // Redirect to home after a short delay
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Failed to decline invitation:", error);
      setError(error.message || "Failed to decline invitation");
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: "error",
      editor: "warning",
      viewer: "info",
    };
    return colors[role] || "default";
  };

  const getRoleLabel = (role) => {
    const labels = {
      admin: "Admin",
      editor: "Editor",
      viewer: "Viewer",
    };
    return labels[role] || role;
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.palette.grey[50],
        }}
      >
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (error && !invitation) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.palette.grey[50],
          p: 2,
        }}
      >
        <Paper sx={{ p: 4, maxWidth: 400, textAlign: "center" }}>
          <CancelIcon sx={{ fontSize: 64, color: "error.main", mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Invalid Invitation
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {error}
          </Typography>
          <Button variant="contained" onClick={() => navigate("/")}>
            Go to Home
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: theme.palette.grey[50],
        py: 4,
        px: 2,
      }}
    >
      <Box sx={{ maxWidth: 600, mx: "auto" }}>
        {success ? (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <CheckCircleIcon
              sx={{ fontSize: 64, color: "success.main", mb: 2 }}
            />
            <Typography variant="h5" gutterBottom>
              Success!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {success}
            </Typography>
          </Paper>
        ) : (
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    mx: "auto",
                    mb: 2,
                    bgcolor: "primary.main",
                    fontSize: "2rem",
                  }}
                >
                  {invitation?.workspace?.emoji || "🏠"}
                </Avatar>
                <Typography variant="h4" gutterBottom>
                  You're Invited!
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {invitation?.invitedBy?.name} has invited you to join their
                  workspace
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Workspace Details */}
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                >
                  <BusinessIcon color="primary" />
                  <Box>
                    <Typography variant="h6">
                      {invitation?.workspace?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Workspace
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                >
                  <PersonIcon color="primary" />
                  <Box>
                    <Typography variant="body1">
                      {invitation?.invitedBy?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Invited by
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                >
                  <EmailIcon color="primary" />
                  <Box>
                    <Typography variant="body1">{invitation?.email}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Invitation email
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Role:
                  </Typography>
                  <Chip
                    label={getRoleLabel(invitation?.role)}
                    color={getRoleColor(invitation?.role)}
                    size="small"
                  />
                </Box>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              {/* Action Buttons */}
              <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleAccept}
                  disabled={accepting}
                  startIcon={
                    accepting ? (
                      <CircularProgress size={20} />
                    ) : (
                      <CheckCircleIcon />
                    )
                  }
                  sx={{ minWidth: 140 }}
                >
                  {accepting ? "Accepting..." : "Accept"}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleDecline}
                  disabled={accepting}
                  sx={{ minWidth: 140 }}
                >
                  Decline
                </Button>
              </Box>

              {/* Login Notice */}
              {!user && (
                <Alert severity="info" sx={{ mt: 3 }}>
                  You'll need to sign in or create an account to accept this
                  invitation.
                </Alert>
              )}
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default InvitationAccept;
