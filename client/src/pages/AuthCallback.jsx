import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores";
import { CircularProgress, Box, Typography } from "@mui/material";

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleAuthCallback } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get token from URL parameters
        const params = new URLSearchParams(location.search);
        const token = params.get("token");
        const error = params.get("error");

        if (error === "auth_failed") {
          throw new Error("Authentication failed");
        }

        // Google OAuth callback might return the token in a different way
        if (!token) {
          // If no token, might be in the URL hash
          const hashParams = new URLSearchParams(window.location.hash.slice(1));
          const accessToken = hashParams.get("access_token");
          if (accessToken) {
            // Use this access token
            return await handleAuthCallback(accessToken);
          }
          throw new Error("No authentication token received");
        }

        // Handle the authentication callback
        await handleAuthCallback(token);

        // Redirect to home page on success
        navigate("/", { replace: true });
      } catch (error) {
        console.error("Auth callback error:", error);
        navigate("/login", { replace: true });
      }
    };

    handleCallback();
  }, [location, handleAuthCallback, navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <CircularProgress />
      <Typography variant="body1" sx={{ mt: 2 }}>
        Completing authentication...
      </Typography>
    </Box>
  );
};

export default AuthCallback;
