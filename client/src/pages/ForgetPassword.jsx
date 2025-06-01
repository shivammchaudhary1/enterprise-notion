import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { forgotPassword } from "../redux/slices/authSlice";
import {
  Box,
  Container,
  Paper,
  Typography,
  Alert,
  Button,
  CircularProgress,
  CssBaseline,
  useTheme,
} from "@mui/material";
import {
  Email as EmailIcon,
  LockReset as LockResetIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { CustomTextField, CustomButton } from "../components/ui/mui";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const theme = useTheme();

  const dispatch = useDispatch();
  const { isLoading, error, validationErrors, message } = useSelector(
    (state) => state.auth
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(forgotPassword(email));

    if (forgotPassword.fulfilled.match(result)) {
      setIsSubmitted(true);
    }
  };

  const getFieldError = (fieldName) => {
    return validationErrors?.[fieldName]?.[0] || "";
  };

  if (isSubmitted) {
    return (
      <>
        <CssBaseline />
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "background.default",
            py: 3,
            px: 2,
          }}
        >
          <Container maxWidth="sm">
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 3,
                textAlign: "center",
                bgcolor: "background.paper",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 64,
                  height: 64,
                  mx: "auto",
                  mb: 3,
                  borderRadius: "50%",
                  bgcolor: "success.light",
                  color: "success.main",
                }}
              >
                <EmailIcon sx={{ fontSize: 32 }} />
              </Box>

              <Typography variant="h4" component="h2" gutterBottom>
                Check Your Email
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                We've sent a password reset link to{" "}
                <Box
                  component="span"
                  sx={{ fontWeight: 600, color: "text.primary" }}
                >
                  {email}
                </Box>
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <CustomButton
                  variant="outlined"
                  onClick={() => setIsSubmitted(false)}
                  fullWidth
                  size="large"
                >
                  Back to Forgot Password
                </CustomButton>

                <Button
                  component={Link}
                  to="/login"
                  variant="text"
                  sx={{
                    textTransform: "none",
                    fontWeight: 500,
                    color: "primary.main",
                  }}
                >
                  Back to Login
                </Button>
              </Box>
            </Paper>
          </Container>
        </Box>
      </>
    );
  }

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
          py: 3,
          px: 2,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 3,
              bgcolor: "background.paper",
            }}
          >
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 64,
                  height: 64,
                  mx: "auto",
                  mb: 3,
                  borderRadius: "50%",
                  bgcolor: "primary.light",
                  color: "primary.contrastText",
                }}
              >
                <LockResetIcon sx={{ fontSize: 32 }} />
              </Box>

              <Typography variant="h4" component="h1" gutterBottom>
                Forgot Password?
              </Typography>

              <Typography variant="body1" color="text.secondary">
                Don't worry! Enter your email address and we'll send you a link
                to reset your password.
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <CustomTextField
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                error={!!getFieldError("email")}
                helperText={getFieldError("email")}
                required
                fullWidth
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
                      <EmailIcon
                        sx={{ color: "text.secondary", fontSize: 20 }}
                      />
                    </Box>
                  ),
                }}
              />

              <CustomButton
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={!email.trim() || isLoading}
                sx={{
                  mb: 3,
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: 600,
                }}
                startIcon={
                  isLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
              >
                {isLoading ? "Sending Reset Link..." : "Send Reset Link"}
              </CustomButton>
            </Box>

            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Button
                component={Link}
                to="/login"
                variant="text"
                startIcon={<ArrowBackIcon />}
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  mb: 2,
                  color: "primary.main",
                }}
              >
                Back to Login
              </Button>

              <Typography variant="body2" color="text.secondary">
                Don't have an account?{" "}
                <Button
                  component={Link}
                  to="/register"
                  variant="text"
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    p: 0,
                    minWidth: "auto",
                    color: "primary.main",
                    "&:hover": {
                      bgcolor: "transparent",
                      textDecoration: "underline",
                    },
                  }}
                >
                  Sign up here
                </Button>
              </Typography>
            </Box>
          </Paper>

          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Having trouble? Contact our{" "}
              <Button
                component="a"
                href="mailto:support@enterprisenotion.com"
                variant="text"
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  p: 0,
                  minWidth: "auto",
                  color: "primary.main",
                  "&:hover": {
                    bgcolor: "transparent",
                    textDecoration: "underline",
                  },
                }}
              >
                support team
              </Button>
            </Typography>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default ForgetPassword;
