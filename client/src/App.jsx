import React from "react";
import { Toaster } from "react-hot-toast";
import AllRoutes from "./allRoutes/AllRoutes";
import AuthProvider from "./components/auth/AuthProvider";
import ThemeProvider from "./contexts/ThemeContext";
import { useTheme } from "./contexts/ThemeContext";
import ChatPanel from "./components/Assistant/ChatPanel";
import { useAuthStore } from "./stores";
import "./styles/editor.css";

const ToasterComponent = () => {
  const { theme } = useTheme();

  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          background: theme.palette.background.paper,
          color: theme.palette.text.primary,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "500",
          padding: "12px 16px",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 10px 25px rgba(0, 0, 0, 0.3)"
              : "0 10px 25px rgba(0, 0, 0, 0.1)",
        },
        success: {
          iconTheme: {
            primary: theme.palette.mode === "dark" ? "#4ade80" : "#10b981",
            secondary: theme.palette.background.paper,
          },
        },
        error: {
          iconTheme: {
            primary: theme.palette.mode === "dark" ? "#f87171" : "#ef4444",
            secondary: theme.palette.background.paper,
          },
        },
      }}
    />
  );
};

const App = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <ThemeProvider>
      <AuthProvider>
        <AllRoutes />
        <ToasterComponent />
        {isAuthenticated && <ChatPanel />}
        {/* <ChatPanel /> */}
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
