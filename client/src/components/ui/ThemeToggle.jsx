import React, { useState } from "react";
import {
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useTheme as useMuiTheme,
} from "@mui/material";
import {
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Brightness6 as AutoModeIcon,
  Check as CheckIcon,
} from "@mui/icons-material";
import { useTheme } from "../../contexts/ThemeContext";

const ThemeToggle = ({
  showLabel = false,
  size = "medium",
  variant = "simple",
}) => {
  const { isDarkMode, toggleTheme, setThemeMode, themeMode, isAuthenticated } =
    useTheme();
  const muiTheme = useMuiTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Don't render theme toggle for non-authenticated users
  if (!isAuthenticated) {
    return null;
  }

  const handleClick = (event) => {
    if (variant === "dropdown") {
      setAnchorEl(event.currentTarget);
    } else {
      toggleTheme();
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeSelect = (mode) => {
    setThemeMode(mode);
    handleClose();
  };

  const getCurrentIcon = () => {
    if (themeMode === "system") return <AutoModeIcon />;
    return isDarkMode ? <LightModeIcon /> : <DarkModeIcon />;
  };

  const getTooltipText = () => {
    if (variant === "dropdown") return "Change theme";
    return isDarkMode ? "Switch to light mode" : "Switch to dark mode";
  };

  const themeOptions = [
    {
      mode: "light",
      label: "Light",
      icon: <LightModeIcon />,
    },
    {
      mode: "dark",
      label: "Dark",
      icon: <DarkModeIcon />,
    },
    {
      mode: "system",
      label: "System",
      icon: <AutoModeIcon />,
    },
  ];

  return (
    <>
      <Tooltip title={getTooltipText()}>
        <IconButton
          onClick={handleClick}
          size={size}
          sx={{
            color: muiTheme.palette.text.primary,
            "&:hover": {
              backgroundColor: muiTheme.palette.action.hover,
            },
            transition: "all 0.3s ease",
          }}
        >
          {getCurrentIcon()}
        </IconButton>
      </Tooltip>

      {variant === "dropdown" && (
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 140,
              borderRadius: 2,
              border: `1px solid ${muiTheme.palette.divider}`,
              boxShadow:
                muiTheme.palette.mode === "dark"
                  ? "0 8px 32px rgba(0, 0, 0, 0.4)"
                  : "0 8px 32px rgba(0, 0, 0, 0.12)",
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          {themeOptions.map((option) => (
            <MenuItem
              key={option.mode}
              onClick={() => handleThemeSelect(option.mode)}
              sx={{
                py: 1,
                px: 2,
                borderRadius: 1,
                mx: 0.5,
                my: 0.25,
                "&:hover": {
                  backgroundColor: muiTheme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>{option.icon}</ListItemIcon>
              <ListItemText primary={option.label} />
              {themeMode === option.mode && (
                <CheckIcon sx={{ ml: 1, fontSize: 18 }} />
              )}
            </MenuItem>
          ))}
        </Menu>
      )}
    </>
  );
};

export default ThemeToggle;
