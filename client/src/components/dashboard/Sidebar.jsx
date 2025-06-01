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
} from "@mui/material";
import {
  Search as SearchIcon,
  Home as HomeIcon,
  Inbox as InboxIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  People as PeopleIcon,
  Help as HelpIcon,
} from "@mui/icons-material";

const Sidebar = () => {
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
        backgroundColor: "#f7f6f3",
        borderRight: "1px solid #e9e9e7",
        display: "flex",
        flexDirection: "column",
        p: 1,
      }}
    >
      {/* User Header */}
      <Box sx={{ p: 1, mb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar
            sx={{ width: 24, height: 24, fontSize: "12px", bgcolor: "#8b5cf6" }}
          >
            SC
          </Avatar>
          <Typography variant="body2" fontWeight={500}>
            Shivam Chaudhary
          </Typography>
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
                backgroundColor: "rgba(0,0,0,0.04)",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 32, color: "#6b7280" }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{
                "& .MuiListItemText-primary": {
                  fontSize: "14px",
                  fontWeight: 400,
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
              backgroundColor: "rgba(0,0,0,0.04)",
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 32, color: "#6b7280" }}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText
            primary="Getting Started"
            sx={{
              "& .MuiListItemText-primary": {
                fontSize: "14px",
                fontWeight: 400,
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
            color: "#6b7280",
            textTransform: "none",
            fontSize: "14px",
            fontWeight: 400,
            width: "100%",
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.04)",
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
                ? "rgba(0,0,0,0.04)"
                : "transparent",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.04)",
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
            color: "#6b7280",
            textTransform: "none",
            fontSize: "14px",
            fontWeight: 400,
            width: "100%",
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.04)",
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
              color: "#6b7280",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.04)",
              },
            }}
          >
            <PeopleIcon fontSize="small" />
          </Button>
          <Button
            sx={{
              minWidth: "auto",
              p: 0.5,
              color: "#6b7280",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.04)",
              },
            }}
          >
            <HelpIcon fontSize="small" />
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
