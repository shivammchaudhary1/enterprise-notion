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
  LinearProgress,
} from "@mui/material";
import {
  Google as GoogleIcon,
  Apple as AppleIcon,
  Microsoft as MicrosoftIcon,
  Person as PersonIcon,
  CorporateFare as CorporateIcon,
  Visibility,
  VisibilityOff,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";

const Register = () => {
  const navigate = useNavigate();
  const {
    isLoading,
    error,
    message,
    isAuthenticated,
    registerUser,
    clearError,
    clearMessage,
  } = useAuthStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    // Name validation
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    } else {
      // Additional password strength validation
      if (!/\d/.test(formData.password)) {
        errors.password = "Password should contain at least one number";
      } else if (!/[a-zA-Z]/.test(formData.password)) {
        errors.password = "Password should contain at least one letter";
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const { confirmPassword, ...registrationData } = formData;
    registerUser(registrationData);
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleGoogleSignup = (e) => {
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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
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
              Create your Notion account
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

            {/* Social Registration Buttons */}
            <Stack spacing={2} sx={{ mb: 3 }}>
              <Button
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={handleGoogleSignup}
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
                Sign up with Google
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
            </Stack>

            <Divider sx={{ my: 3 }} />

            {/* Registration Form */}
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
                    Full Name
                  </Typography>
                  <TextField
                    fullWidth
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    error={!!formErrors.name}
                    helperText={formErrors.name}
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
                    placeholder="Create a password"
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
                  {formData.password && (
                    <Box sx={{ mt: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={passwordStrength}
                        sx={{
                          height: 4,
                          borderRadius: 2,
                          bgcolor: "grey.200",
                          "& .MuiLinearProgress-bar": {
                            bgcolor:
                              passwordStrength <= 25
                                ? "error.main"
                                : passwordStrength <= 50
                                ? "warning.main"
                                : passwordStrength <= 75
                                ? "info.main"
                                : "success.main",
                          },
                        }}
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 0.5, display: "block" }}
                      >
                        Password strength:{" "}
                        {passwordStrength <= 25
                          ? "Weak"
                          : passwordStrength <= 50
                          ? "Fair"
                          : passwordStrength <= 75
                          ? "Good"
                          : "Strong"}
                      </Typography>
                    </Box>
                  )}
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
                    Confirm Password
                  </Typography>
                  <TextField
                    fullWidth
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    error={!!formErrors.confirmPassword}
                    helperText={formErrors.confirmPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            edge="end"
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
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
                  {isLoading ? "Creating Account..." : "Create Account"}
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
                Already have an account?{" "}
                <Link
                  component={Link}
                  to="/login"
                  sx={{
                    color: "#2383E2",
                    textDecoration: "none",
                    fontWeight: 500,
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Sign in
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

export default Register;
