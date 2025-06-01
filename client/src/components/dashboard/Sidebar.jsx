import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Divider,
  Button,
  useTheme,
  IconButton,
} from "@mui/material";
import {
  Search as SearchIcon,
  Home as HomeIcon,
  Inbox as InboxIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  People as PeopleIcon,
  Help as HelpIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import ThemeToggle from "../ui/ThemeToggle";
import { useAuthLogout } from "../../hooks/useAuthLogout";

const Sidebar = () => {
  const theme = useTheme();
  const handleLogout = useAuthLogout();

  const menuItems = [
    { icon: <SearchIcon />, text: "Search", shortcut: "⌘K" },
    { icon: <HomeIcon />, text: "Home" },
    { icon: <InboxIcon />, text: "Inbox" },
    { icon: <SettingsIcon />, text: "Settings" },
  ];

  const teamspaces = [
    { name: "Shivam Chaudhary's Workspace", emoji: "🏠", active: true },
    { name: "Engineering Docs", emoji: "📋" },
  ];

  return (
    <Box
      sx={{
        width: 240,
        height: "100vh",
        backgroundColor: theme.palette.background.sidebar,
        borderRight: `1px solid ${theme.palette.divider}`,
        display: "flex",
        flexDirection: "column",
        p: 1,
      }}
    >
      {/* User Header */}
      <Box sx={{ p: 1, mb: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar
              sx={{
                width: 24,
                height: 24,
                fontSize: "12px",
                bgcolor: "#8b5cf6",
              }}
            >
              SC
            </Avatar>
            <Typography variant="body2" fontWeight={500} color="text.primary">
              Shivam Chaudhary
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <ThemeToggle size="small" variant="dropdown" />
            <IconButton
              onClick={handleLogout}
              size="small"
              sx={{
                color: theme.palette.text.secondary,
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                  color: theme.palette.error.main,
                },
                transition: "all 0.2s ease",
              }}
              title="Logout"
            >
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Search and Main Menu */}
      <List sx={{ px: 0 }}>
        {menuItems.map((item, index) => (
          <ListItem
            key={index}
            sx={{
              py: 0.5,
              px: 1,
              borderRadius: 1,
              cursor: "pointer",
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <ListItemIcon
              sx={{ minWidth: 32, color: theme.palette.text.secondary }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{
                "& .MuiListItemText-primary": {
                  fontSize: "14px",
                  fontWeight: 400,
                  color: theme.palette.text.primary,
                },
              }}
            />
            {item.shortcut && (
              <Typography variant="caption" color="text.secondary">
                {item.shortcut}
              </Typography>
            )}
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 1 }} />

      {/* Private Section */}
      <Box sx={{ px: 1, mb: 1 }}>
        <Typography variant="caption" color="text.secondary" fontWeight={600}>
          Private
        </Typography>
      </Box>

      <List sx={{ px: 0 }}>
        <ListItem
          sx={{
            py: 0.5,
            px: 1,
            borderRadius: 1,
            cursor: "pointer",
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <ListItemIcon
            sx={{ minWidth: 32, color: theme.palette.text.secondary }}
          >
            <HomeIcon />
          </ListItemIcon>
          <ListItemText
            primary="Getting Started"
            sx={{
              "& .MuiListItemText-primary": {
                fontSize: "14px",
                fontWeight: 400,
                color: theme.palette.text.primary,
              },
            }}
          />
        </ListItem>
      </List>

      {/* Add New */}
      <Box sx={{ px: 1, mt: 2 }}>
        <Button
          startIcon={<AddIcon />}
          sx={{
            justifyContent: "flex-start",
            color: theme.palette.text.secondary,
            textTransform: "none",
            fontSize: "14px",
            fontWeight: 400,
            width: "100%",
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          Add new
        </Button>
      </Box>

      <Divider sx={{ my: 1 }} />

      {/* Teamspaces */}
      <Box sx={{ px: 1, mb: 1 }}>
        <Typography variant="caption" color="text.secondary" fontWeight={600}>
          Teamspaces
        </Typography>
      </Box>

      <List sx={{ px: 0, flexGrow: 1 }}>
        {teamspaces.map((space, index) => (
          <ListItem
            key={index}
            sx={{
              py: 0.5,
              px: 1,
              borderRadius: 1,
              cursor: "pointer",
              backgroundColor: space.active
                ? theme.palette.action.selected
                : "transparent",
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <Box sx={{ mr: 1, fontSize: "14px" }}>{space.emoji}</Box>
            <ListItemText
              primary={space.name}
              sx={{
                "& .MuiListItemText-primary": {
                  fontSize: "14px",
                  fontWeight: space.active ? 500 : 400,
                  color: theme.palette.text.primary,
                },
              }}
            />
          </ListItem>
        ))}
      </List>

      {/* Add New Teamspace */}
      <Box sx={{ px: 1, mb: 2 }}>
        <Button
          startIcon={<AddIcon />}
          sx={{
            justifyContent: "flex-start",
            color: theme.palette.text.secondary,
            textTransform: "none",
            fontSize: "14px",
            fontWeight: 400,
            width: "100%",
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          Add new
        </Button>
      </Box>

      {/* Bottom Icons */}
      <Box sx={{ px: 1, pb: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            sx={{
              minWidth: "auto",
              p: 0.5,
              color: theme.palette.text.secondary,
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <PeopleIcon fontSize="small" />
          </Button>
          <Button
            sx={{
              minWidth: "auto",
              p: 0.5,
              color: theme.palette.text.secondary,
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <HelpIcon fontSize="small" />
          </Button>
        </Box>

        {/* Logout Button */}
        <Divider sx={{ mt: 2, mb: 1 }} />
        <Button
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
          fullWidth
          sx={{
            justifyContent: "flex-start",
            px: 2,
            py: 1,
            color: theme.palette.text.secondary,
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
              color: theme.palette.error.main,
            },
            transition: "all 0.2s ease",
            textTransform: "none",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default Sidebar;
