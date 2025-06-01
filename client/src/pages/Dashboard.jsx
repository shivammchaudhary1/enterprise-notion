import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearMessage } from "../redux/slices/authSlice";
import { useAuthLogout } from "../hooks/useAuthLogout";
import { Box, Alert, Container } from "@mui/material";
import Sidebar from "../components/dashboard/Sidebar";
import MainContent from "../components/dashboard/MainContent";
import RightSidebar from "../components/dashboard/RightSidebar";

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
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Show welcome message if exists */}
      {message && (
        <Box
          sx={{
            position: "fixed",
            top: 16,
            right: 16,
            zIndex: 1000,
            maxWidth: 400,
          }}
        >
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
        </Box>
      )}

      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <MainContent />

      {/* Right Sidebar */}
      <RightSidebar />
    </Box>
  );
};

export default Dashboard;
