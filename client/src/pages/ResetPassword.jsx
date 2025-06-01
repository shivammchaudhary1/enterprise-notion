import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../redux/slices/authSlice";
import Headers from "../components/Headers";
import Footers from "../components/Footers";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  IconButton,
  Alert,
  CssBaseline,
  InputAdornment,
  LinearProgress,
  Chip,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  LockReset,
  CheckCircle,
  Cancel,
  Key,
  Error,
} from "@mui/icons-material";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, validationErrors, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  // Redirect if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    // Client-side validation
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters long");
      return;
    }

    const result = await dispatch(resetPassword({ token, password }));

    if (resetPassword.fulfilled.match(result)) {
      // Redirect will happen automatically due to authentication state change
    }
  };

  const getFieldError = (fieldName) => {
    return validationErrors?.[fieldName]?.[0] || "";
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);

  const getPasswordRequirements = (password) => {
    return [
      { label: "8+ characters", met: password.length >= 8 },
      { label: "Uppercase letter", met: /[A-Z]/.test(password) },
      { label: "Lowercase letter", met: /[a-z]/.test(password) },
      { label: "Number", met: /[0-9]/.test(password) },
    ];
  };

  if (!token) {
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
            <Paper
              elevation={0}
              sx={{
                p: 4,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                maxWidth: 400,
                mx: "auto",
                textAlign: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 64,
                  height: 64,
                  bgcolor: "error.light",
                  borderRadius: "50%",
                  mx: "auto",
                  mb: 3,
                }}
              >
                <Error sx={{ fontSize: 32, color: "error.main" }} />
              </Box>

              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                Invalid Reset Link
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                This password reset link is invalid or has expired.
              </Typography>

              <Stack spacing={2}>
                <Button
                  component={Link}
                  to="/forgot-password"
                  variant="contained"
                  sx={{
                    py: 1.5,
                    background: "#2383E2",
                    "&:hover": { background: "#1976D2" },
                  }}
                  fullWidth
                >
                  Request New Reset Link
                </Button>

                <Button
                  component={Link}
                  to="/login"
                  variant="text"
                  sx={{ color: "#2383E2" }}
                >
                  Back to Login
                </Button>
              </Stack>
            </Paper>
          </Container>
        </Box>
        <Footers />
      </>
    );
  }

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
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 64,
                height: 64,
                bgcolor: "success.light",
                borderRadius: "50%",
                mx: "auto",
                mb: 3,
              }}
            >
              <LockReset sx={{ fontSize: 32, color: "success.main" }} />
            </Box>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 1,
                color: "text.primary",
              }}
            >
              Reset Your Password
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "text.secondary",
                fontWeight: 400,
              }}
            >
              Enter your new password below
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
            {(error || localError) && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
                {error || localError}
              </Alert>
            )}

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
                    New Password
                  </Typography>
                  <TextField
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your new password"
                    error={!!getFieldError("password")}
                    helperText={getFieldError("password")}
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

                  {password && (
                    <Box sx={{ mt: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Password strength:
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 600,
                            color:
                              passwordStrength <= 25
                                ? "error.main"
                                : passwordStrength <= 50
                                ? "warning.main"
                                : passwordStrength <= 75
                                ? "info.main"
                                : "success.main",
                          }}
                        >
                          {passwordStrength <= 25
                            ? "Weak"
                            : passwordStrength <= 50
                            ? "Fair"
                            : passwordStrength <= 75
                            ? "Good"
                            : "Strong"}
                        </Typography>
                      </Box>

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

                      <Box
                        sx={{
                          mt: 2,
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                        }}
                      >
                        {getPasswordRequirements(password).map((req, index) => (
                          <Chip
                            key={index}
                            label={req.label}
                            size="small"
                            icon={req.met ? <CheckCircle /> : <Cancel />}
                            color={req.met ? "success" : "default"}
                            variant={req.met ? "filled" : "outlined"}
                            sx={{ fontSize: "0.75rem" }}
                          />
                        ))}
                      </Box>
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
                    Confirm New Password
                  </Typography>
                  <TextField
                    fullWidth
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
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

                  {confirmPassword && password !== confirmPassword && (
                    <Typography
                      variant="caption"
                      color="error.main"
                      sx={{ mt: 1, display: "block" }}
                    >
                      Passwords do not match
                    </Typography>
                  )}

                  {confirmPassword &&
                    password === confirmPassword &&
                    confirmPassword.length > 0 && (
                      <Typography
                        variant="caption"
                        color="success.main"
                        sx={{ mt: 1, display: "block" }}
                      >
                        ✓ Passwords match
                      </Typography>
                    )}
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={
                    !password.trim() ||
                    !confirmPassword.trim() ||
                    password !== confirmPassword ||
                    password.length < 6 ||
                    isLoading
                  }
                  sx={{
                    py: 1.5,
                    borderRadius: 1,
                    background: "success.main",
                    "&:hover": {
                      background: "success.dark",
                    },
                    "&:disabled": {
                      bgcolor: "grey.300",
                    },
                    fontWeight: 600,
                  }}
                  fullWidth
                >
                  {isLoading ? "Resetting Password..." : "Reset Password"}
                </Button>
              </Stack>
            </form>

            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Button
                component={Link}
                to="/login"
                variant="text"
                sx={{ color: "#2383E2", fontWeight: 500 }}
              >
                ← Back to Login
              </Button>
            </Box>
          </Paper>

          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Typography variant="caption" color="text.secondary">
              Having trouble?{" "}
              <Link
                href="mailto:support@enterprisenotion.com"
                style={{
                  color: "#2383E2",
                  textDecoration: "none",
                }}
              >
                Contact support
              </Link>
            </Typography>
          </Box>
        </Container>
      </Box>
      <Footers />
    </>
  );
};

export default ResetPassword;
