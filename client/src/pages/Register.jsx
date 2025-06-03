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
          minHeight: "85vh",
          bgcolor: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Container maxWidth="xs">
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography
              variant="h4"
              sx={{
                fontSize: "1.3rem",
                fontWeight: 600,
                color: "#000",

                textAlign: "left",
                marginLeft: "1rem",
              }}
            >
              Think it. Make it.
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontSize: "1.3rem",
                color: "#abaaa7",
                mb: 3,
                textAlign: "left",
                marginLeft: "1rem",
                fontWeight: 600,
              }}
            >
              Create your Notion account
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: 0,
              maxWidth: 360,
              mx: "auto",
            }}
          >
            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>
                {error}
              </Alert>
            )}

            <Stack spacing={1.5}>
              <Button
                variant="outlined"
                onClick={handleGoogleSignup}
                sx={{
                  py: 1.5,
                  border: "1px solid #e0e0e0",
                  borderRadius: "0.3rem",
                  color: "#000",
                  textTransform: "none",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  backgroundColor: "#fff",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                    borderColor: "#e0e0e0",
                  },
                  "& .google-icon": {
                    width: 18,
                    height: 18,
                    marginRight: 1,
                  },
                }}
                fullWidth
              >
                <img
                  src="https://static.vecteezy.com/system/resources/previews/022/484/509/non_2x/google-lens-icon-logo-symbol-free-png.png"
                  alt="Google"
                  className="google-icon"
                />
                Continue with Google
              </Button>

              <Divider sx={{ my: 1 }}>
                <Typography color="text.secondary" variant="body2">
                  or
                </Typography>
              </Divider>

              <form onSubmit={handleSubmit}>
                <Stack spacing={1.5}>
                  <TextField
                    fullWidth
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full name"
                    error={!!formErrors.name}
                    helperText={formErrors.name}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "0.3rem",
                        backgroundColor: "#f7f7f7",
                        "&:hover": {
                          backgroundColor: "#f0f0f0",
                        },
                        "& fieldset": {
                          borderColor: "transparent",
                        },
                        "&:hover fieldset": {
                          borderColor: "transparent",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#000",
                        },
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email address"
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "0.3rem",
                        backgroundColor: "#f7f7f7",
                        "&:hover": {
                          backgroundColor: "#f0f0f0",
                        },
                        "& fieldset": {
                          borderColor: "transparent",
                        },
                        "&:hover fieldset": {
                          borderColor: "transparent",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#000",
                        },
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    error={!!formErrors.password}
                    helperText={formErrors.password}
                    size="small"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            size="small"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "0.3rem",
                        backgroundColor: "#f7f7f7",
                        "&:hover": {
                          backgroundColor: "#f0f0f0",
                        },
                        "& fieldset": {
                          borderColor: "transparent",
                        },
                        "&:hover fieldset": {
                          borderColor: "transparent",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#000",
                        },
                      },
                    }}
                  />

                  {formData.password && (
                    <Box sx={{ px: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={passwordStrength}
                        sx={{
                          height: 2,
                          borderRadius: 1,
                          bgcolor: "grey.100",
                          "& .MuiLinearProgress-bar": {
                            bgcolor:
                              passwordStrength <= 25
                                ? "#ff4d4f"
                                : passwordStrength <= 50
                                ? "#faad14"
                                : passwordStrength <= 75
                                ? "#1890ff"
                                : "#52c41a",
                          },
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          mt: 0.5,
                          display: "block",
                          color: "text.secondary",
                          fontSize: "0.75rem",
                        }}
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

                  <TextField
                    fullWidth
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    error={!!formErrors.confirmPassword}
                    helperText={formErrors.confirmPassword}
                    size="small"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            edge="end"
                            size="small"
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
                        borderRadius: "0.3rem",
                        backgroundColor: "#f7f7f7",
                        "&:hover": {
                          backgroundColor: "#f0f0f0",
                        },
                        "& fieldset": {
                          borderColor: "transparent",
                        },
                        "&:hover fieldset": {
                          borderColor: "transparent",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#000",
                        },
                      },
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isLoading}
                    sx={{
                      py: 1.5,
                      mt: 1,
                      backgroundColor: "#000",
                      color: "#fff",
                      textTransform: "none",
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      borderRadius: "0.3rem",
                      "&:hover": {
                        backgroundColor: "#333",
                      },
                    }}
                    fullWidth
                  >
                    {isLoading ? "Creating account..." : "Continue with email"}
                  </Button>

                  <Typography
                    variant="caption"
                    align="center"
                    sx={{
                      color: "text.secondary",
                      display: "block",
                      fontSize: "0.75rem",
                      mt: 1,
                    }}
                  >
                    By continuing, you agree to our{" "}
                    <Link
                      href="#"
                      style={{
                        color: "#2383E2",
                        textDecoration: "none",
                      }}
                    >
                      Terms of Service
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
                </Stack>
              </form>

              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    style={{
                      color: "#2383E2",
                      textDecoration: "none",
                      fontWeight: 500,
                    }}
                  >
                    Log in
                  </Link>
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Container>
      </Box>
      <Footers />
    </>
  );
};

export default Register;
