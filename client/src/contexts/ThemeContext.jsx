import React, { createContext, useContext, useState, useEffect } from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { useAuthStore, useUserStore } from "../stores";
import { lightTheme, darkTheme } from "../theme/theme";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const { preferences, loading, fetchUserPreferences, updatePreferences } =
    useUserStore();
  const { user, isAuthenticated } = useAuthStore();

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
    let mounted = true;

    if (user && !loading && isAuthenticated) {
      fetchUserPreferences()
        .then((result) => {
          if (mounted && result && result.theme) {
            const theme = result.theme;
            if (theme === "system") {
              const systemPrefersDark = window.matchMedia(
                "(prefers-color-scheme: dark)"
              ).matches;
              setIsDarkMode(systemPrefersDark);
            } else {
              setIsDarkMode(theme === "dark");
            }
          }
        })
        .catch((error) => {
          // Handle error silently - user preferences are not critical
          console.log("Failed to fetch user preferences:", error);
        });
    } else if (!isAuthenticated) {
      // Reset to light mode when user logs out
      setIsDarkMode(false);
      localStorage.removeItem("darkMode");
    }

    return () => {
      mounted = false;
    };
  }, [user?.id, isAuthenticated]); // Remove fetchUserPreferences and loading from dependencies

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
        await updatePreferences({
          theme: newMode ? "dark" : "light",
        });
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
          await updatePreferences({ theme: mode });
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
        await updatePreferences({ theme: "system" });
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
