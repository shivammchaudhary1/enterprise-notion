import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearMessage } from "../redux/slices/authSlice";
import { useAuthLogout } from "../hooks/useAuthLogout";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Avatar,
  Chip,
  Stack,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Divider,
  Button,
  Alert,
  CssBaseline,
  alpha,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  ExitToApp as LogoutIcon,
  AccountCircle as AccountCircleIcon,
  ArrowForward,
  AutoAwesome,
  WorkspacePremium,
  Groups,
  Analytics,
  Security,
  Speed,
} from "@mui/icons-material";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = useAuthLogout();
  const { user, isAuthenticated, message } = useSelector((state) => state.auth);

  useEffect(() => {
    // Redirect to home if not authenticated
    if (!isAuthenticated) {
      navigate("/");
      return;
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Clear welcome message after 5 seconds
    if (message) {
      const timer = setTimeout(() => {
        dispatch(clearMessage());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, dispatch]);

  return (
    <>
      <CssBaseline />
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pt: 4 }}>
        {/* Welcome Message */}
        {message && (
          <Container maxWidth="lg" sx={{ pt: 2 }}>
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
          </Container>
        )}

        {/* Hero Section for Authenticated Users */}
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mb: 2,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Welcome back, {user?.name}!
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              Your workspace is ready for action
            </Typography>
          </Box>

          {/* Quick Actions */}
          <Grid container spacing={3} sx={{ mb: 6 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  p: 3,
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <AutoAwesome
                  sx={{ fontSize: 40, color: "primary.main", mb: 2 }}
                />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  AI Assistant
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Get instant answers and automate your work
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  p: 3,
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Groups sx={{ fontSize: 40, color: "success.main", mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Team Collaboration
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Work together in real-time
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  p: 3,
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Analytics
                  sx={{ fontSize: 40, color: "warning.main", mb: 2 }}
                />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Analytics
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Track your team's productivity
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  p: 3,
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Security sx={{ fontSize: 40, color: "error.main", mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Enterprise Security
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Bank-level security for your data
                </Typography>
              </Card>
            </Grid>
          </Grid>

          {/* User Dashboard */}
          <Grid container spacing={3}>
            {/* User Profile Card */}
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, height: "fit-content" }}>
                <CardHeader
                  avatar={
                    <Avatar
                      sx={{
                        bgcolor: "primary.main",
                        width: 56,
                        height: 56,
                        fontSize: "1.5rem",
                      }}
                    >
                      {user?.name?.charAt(0).toUpperCase()}
                    </Avatar>
                  }
                  title={
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {user?.name}
                    </Typography>
                  }
                  subheader={
                    <Typography variant="body2" color="text.secondary">
                      {user?.email}
                    </Typography>
                  }
                />
                <Divider sx={{ my: 2 }} />
                <Stack spacing={2}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <PersonIcon color="primary" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        User ID
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: "monospace" }}
                      >
                        {user?.id}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <WorkspacePremium color="success" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Plan
                      </Typography>
                      <Chip
                        label="Enterprise"
                        color="success"
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                  </Box>
                </Stack>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                  sx={{ mt: 3 }}
                >
                  Sign Out
                </Button>
              </Card>
            </Grid>

            {/* Workspace Overview */}
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3, height: "fit-content" }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                  Your Workspace
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Paper
                      sx={{
                        p: 3,
                        textAlign: "center",
                        bgcolor: alpha("#667eea", 0.1),
                        border: "1px solid",
                        borderColor: alpha("#667eea", 0.2),
                      }}
                    >
                      <Speed sx={{ fontSize: 32, color: "#667eea", mb: 1 }} />
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: 700, color: "#667eea" }}
                      >
                        12
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Active Projects
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Paper
                      sx={{
                        p: 3,
                        textAlign: "center",
                        bgcolor: alpha("#764ba2", 0.1),
                        border: "1px solid",
                        borderColor: alpha("#764ba2", 0.2),
                      }}
                    >
                      <Groups sx={{ fontSize: 32, color: "#764ba2", mb: 1 }} />
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: 700, color: "#764ba2" }}
                      >
                        5
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Team Members
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Recent Activity
                  </Typography>
                  <Stack spacing={2}>
                    {[
                      {
                        action: "Created new project",
                        time: "2 hours ago",
                        icon: <DashboardIcon />,
                      },
                      {
                        action: "Invited team member",
                        time: "1 day ago",
                        icon: <Groups />,
                      },
                      {
                        action: "Updated workspace settings",
                        time: "3 days ago",
                        icon: <SettingsIcon />,
                      },
                    ].map((activity, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          p: 2,
                          borderRadius: 1,
                          bgcolor: alpha("#f5f5f5", 0.5),
                        }}
                      >
                        <Box sx={{ color: "primary.main" }}>
                          {activity.icon}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2">
                            {activity.action}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {activity.time}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Dashboard;
