import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../stores";
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
  Alert,
  CssBaseline,
} from "@mui/material";

const ForgetPassword = () => {
  const { isLoading, error, forgotPassword } = useAuthStore();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail()) return;

    try {
      await forgotPassword(email);
      setSuccessMessage(
        "Password reset instructions have been sent to your email"
      );
      setEmail("");
    } catch (error) {
      // Error is handled by the store
    }
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
                fontSize: "2.5rem",
                fontWeight: 700,
                mb: 1,
                color: "#000",
              }}
            >
              Reset password
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

            {successMessage && (
              <Alert severity="success" sx={{ mb: 2, borderRadius: 1 }}>
                {successMessage}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Stack spacing={1.5}>
                <TextField
                  fullWidth
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                  }}
                  placeholder="Enter your email address"
                  error={!!emailError}
                  helperText={emailError}
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
                  {isLoading ? "Sending..." : "Send reset link"}
                </Button>

                <Box sx={{ textAlign: "center", mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Remember your password?{" "}
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
            </form>
          </Paper>
        </Container>
      </Box>
      <Footers />
    </>
  );
};

export default ForgetPassword;
