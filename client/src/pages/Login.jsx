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
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

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
          minHeight: "85vh",
          bgcolor: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Container maxWidth="xs">
          <Box sx={{ textAlign: "center" }}>
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
              Log in to your Notion account
            </Typography>
            {/* <Typography
              variant="h4"
              sx={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#000",
              }}
            >
              Log in
            </Typography> */}
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
                onClick={handleGoogleLogin}
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
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
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

                  <Box sx={{ textAlign: "right" }}>
                    <Link
                      to="/forgot-password"
                      style={{
                        textDecoration: "none",
                        color: "#2383E2",
                        fontSize: "0.875rem",
                      }}
                    >
                      Forgot password?
                    </Link>
                  </Box>

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
                    {isLoading ? "Signing in..." : "Continue with email"}
                  </Button>
                </Stack>
              </form>

              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  No account?{" "}
                  <Link
                    to="/register"
                    style={{
                      color: "#2383E2",
                      textDecoration: "none",
                      fontWeight: 500,
                    }}
                  >
                    Create one
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

export default Login;
