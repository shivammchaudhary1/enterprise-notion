import React, { createContext, useContext, useState, useEffect } from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { lightTheme, darkTheme } from "../theme/theme";
import {
  updatePreferences,
  fetchUserPreferences,
} from "../redux/slices/userSlice";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { preferences, loading } = useSelector((state) => state.user);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    // For unauthenticated users, always use light mode
    if (!user) {
      return false;
    }
    // Check localStorage first for authenticated users
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) {
      return JSON.parse(saved);
    }
    // Default to light mode
    return false;
  });

  // Sync with backend preferences when user is logged in
  useEffect(() => {
    if (user && !loading && isAuthenticated) {
      dispatch(fetchUserPreferences()).then((result) => {
        if (result.payload && result.payload.theme) {
          const theme = result.payload.theme;
          if (theme === "system") {
            const systemPrefersDark = window.matchMedia(
              "(prefers-color-scheme: dark)"
            ).matches;
            setIsDarkMode(systemPrefersDark);
          } else {
            setIsDarkMode(theme === "dark");
          }
        }
      });
    } else if (!isAuthenticated) {
      // Reset to light mode when user logs out
      setIsDarkMode(false);
      localStorage.removeItem("darkMode");
    }
  }, [user, dispatch, loading, isAuthenticated]);

  // Update theme when preferences change
  useEffect(() => {
    if (isAuthenticated && preferences.theme) {
      if (preferences.theme === "system") {
        const systemPrefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        setIsDarkMode(systemPrefersDark);
      } else {
        setIsDarkMode(preferences.theme === "dark");
      }
    }
  }, [preferences.theme, isAuthenticated]);

  useEffect(() => {
    // Save to localStorage only for authenticated users
    if (isAuthenticated) {
      localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
    }
  }, [isDarkMode, isAuthenticated]);

  useEffect(() => {
    // Listen for system theme changes - only for authenticated users
    if (isAuthenticated) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e) => {
        // Only update if user prefers system theme
        if (preferences.theme === "system") {
          setIsDarkMode(e.matches);
        }
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [preferences.theme, isAuthenticated]);

  const toggleTheme = async () => {
    // Only allow theme changes for authenticated users
    if (!isAuthenticated) {
      console.warn("Theme toggling is only available for authenticated users");
      return;
    }

    const newMode = !isDarkMode;
    setIsDarkMode(newMode);

    // Update backend if user is logged in
    if (user) {
      try {
        await dispatch(
          updatePreferences({
            theme: newMode ? "dark" : "light",
          })
        );
      } catch (error) {
        console.error("Failed to save theme preference:", error);
      }
    }
  };

  const setThemeMode = async (mode) => {
    // Only allow theme changes for authenticated users
    if (!isAuthenticated) {
      console.warn("Theme changes are only available for authenticated users");
      return;
    }

    if (["light", "dark", "system"].includes(mode)) {
      if (mode === "system") {
        const systemPrefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        setIsDarkMode(systemPrefersDark);
      } else {
        setIsDarkMode(mode === "dark");
      }

      // Update backend if user is logged in
      if (user) {
        try {
          await dispatch(updatePreferences({ theme: mode }));
        } catch (error) {
          console.error("Failed to save theme preference:", error);
        }
      }
    }
  };

  const resetToSystemTheme = async () => {
    // Only allow theme changes for authenticated users
    if (!isAuthenticated) {
      console.warn("Theme changes are only available for authenticated users");
      return;
    }

    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDarkMode(systemPrefersDark);

    // Update backend if user is logged in
    if (user) {
      try {
        await dispatch(updatePreferences({ theme: "system" }));
      } catch (error) {
        console.error("Failed to save theme preference:", error);
      }
    }
  };

  // Always use light theme for non-authenticated users
  const theme = !isAuthenticated || !isDarkMode ? lightTheme : darkTheme;

  const value = {
    isDarkMode: isAuthenticated ? isDarkMode : false,
    toggleTheme,
    setThemeMode,
    resetToSystemTheme,
    theme,
    themeMode: isAuthenticated ? preferences.theme || "light" : "light",
    isAuthenticated,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
