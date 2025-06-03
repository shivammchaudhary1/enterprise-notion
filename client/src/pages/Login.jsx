import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores";
import Headers from "../components/Headers";
import Footers from "../components/Footers";
import config from "../lib/default.js";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Stack,
  IconButton,
  Alert,
  CssBaseline,
  InputAdornment,
  alpha,
} from "@mui/material";
import {
  Google as GoogleIcon,
  Apple as AppleIcon,
  Microsoft as MicrosoftIcon,
  Person as PersonIcon,
  CorporateFare as CorporateIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

const Login = () => {
  const navigate = useNavigate();
  const {
    isLoading,
    error,
    message,
    isAuthenticated,
    loginUser,
    clearError,
    clearMessage,
  } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Clear any existing errors when component mounts
    clearError();
    clearMessage();
  }, [clearError, clearMessage]);

  useEffect(() => {
    // Redirect to home if user is authenticated
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field-specific error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    // Email validation
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    loginUser(formData);
  };

  const handleGoogleLogin = (e) => {
    e.preventDefault();
    window.location.href = `${config.BACKEND_URL}/api/auth/google`;
  };

  return (
    <>
      <CssBaseline />
      <Headers />
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          py: 8,
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 1,
                color: "text.primary",
              }}
            >
              Think it. Make it.
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "text.secondary",
                fontWeight: 400,
              }}
            >
              Log in to your Notion account
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: 4,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              maxWidth: 400,
              mx: "auto",
            }}
          >
            {/* Error Display */}
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
                {error}
              </Alert>
            )}

            {/* Social Login Buttons */}
            <Stack spacing={2} sx={{ mb: 3 }}>
              <Button
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={handleGoogleLogin}
                sx={{
                  py: 1.5,
                  borderColor: "divider",
                  color: "text.primary",
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: alpha("#667eea", 0.04),
                  },
                }}
                fullWidth
              >
                Continue with Google
              </Button>
              <Button
                variant="outlined"
                startIcon={<AppleIcon />}
                sx={{
                  py: 1.5,
                  borderColor: "divider",
                  color: "text.primary",
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: alpha("#667eea", 0.04),
                  },
                }}
                fullWidth
              >
                Continue with Apple
              </Button>
              <Button
                variant="outlined"
                startIcon={<MicrosoftIcon />}
                sx={{
                  py: 1.5,
                  borderColor: "divider",
                  color: "text.primary",
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: alpha("#667eea", 0.04),
                  },
                }}
                fullWidth
              >
                Continue with Microsoft
              </Button>
              <Button
                variant="outlined"
                startIcon={<PersonIcon />}
                sx={{
                  py: 1.5,
                  borderColor: "divider",
                  color: "text.primary",
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: alpha("#667eea", 0.04),
                  },
                }}
                fullWidth
              >
                Log in with passkey
              </Button>
              <Button
                variant="outlined"
                startIcon={<CorporateIcon />}
                sx={{
                  py: 1.5,
                  borderColor: "divider",
                  color: "text.primary",
                  "&:hover": {
                    borderColor: "primary.main",
                    bgcolor: alpha("#667eea", 0.04),
                  },
                }}
                fullWidth
              >
                Single sign-on (SSO)
              </Button>
            </Stack>

            <Divider sx={{ my: 3 }} />

            {/* Email Login Form */}
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      fontWeight: 500,
                      color: "text.primary",
                    }}
                  >
                    Email
                  </Typography>
                  <TextField
                    fullWidth
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address..."
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1,
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "primary.main",
                        },
                      },
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      mt: 1,
                      display: "block",
                    }}
                  >
                    Use an organization email to easily collaborate with
                    teammates.
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1,
                      fontWeight: 500,
                      color: "text.primary",
                    }}
                  >
                    Password
                  </Typography>
                  <TextField
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    error={!!formErrors.password}
                    helperText={formErrors.password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1,
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "primary.main",
                        },
                      },
                    }}
                  />
                </Box>
                <Link to="/forgot-password" style={{ textDecoration: "none" }}>
                  <Box sx={{ textAlign: "right" }}>
                    <Button
                      variant="text"
                      size="small"
                      sx={{
                        color: "#2383E2",
                        textTransform: "none",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        p: 0,
                        minWidth: "auto",
                        "&:hover": {
                          bgcolor: "transparent",
                          textDecoration: "underline",
                        },
                      }}
                    >
                      Forgot password?
                    </Button>
                  </Box>
                </Link>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  sx={{
                    py: 1.5,
                    borderRadius: 1,
                    background: "#2383E2",
                    "&:hover": {
                      background: "#1976D2",
                    },
                    fontWeight: 600,
                  }}
                  fullWidth
                >
                  {isLoading ? "Signing In..." : "Continue"}
                </Button>
              </Stack>
            </form>

            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography variant="caption" color="text.secondary">
                By continuing, you acknowledge that you understand and agree to
                the{" "}
                <Link
                  href="#"
                  style={{
                    color: "#2383E2",
                    textDecoration: "none",
                  }}
                >
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link
                  href="#"
                  style={{
                    color: "#2383E2",
                    textDecoration: "none",
                  }}
                >
                  Privacy Policy
                </Link>
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{" "}
                <Link
                  component={Link}
                  to="/register"
                  sx={{
                    color: "#2383E2",
                    textDecoration: "none",
                    fontWeight: 500,
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Sign up
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
      <Footers />
    </>
  );
};

export default Login;
