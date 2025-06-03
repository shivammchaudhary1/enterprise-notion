import React from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  useTheme,
  Avatar,
  Chip,
} from "@mui/material";
import {
  Description as DescriptionIcon,
  Add as AddIcon,
  CalendarToday as CalendarIcon,
  Group as GroupIcon,
  StickyNote2 as StickyNoteIcon,
} from "@mui/icons-material";
import { useWorkspace } from "../../hooks/useWorkspace";
import { useAuthStore } from "../../stores";

const WorkspaceMembers = () => {
  const theme = useTheme();
  const { currentWorkspace } = useWorkspace();
  const { user } = useAuthStore();

  const getRoleColor = (role) => {
    switch (role) {
      case "owner":
        return "error";
      case "admin":
        return "warning";
      case "editor":
        return "info";
      default:
        return "default";
    }
  };

  if (!currentWorkspace?.members?.length) return null;

  return (
    <Box sx={{ mb: 4, maxWidth: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          👥 Workspace Members
        </Typography>
      </Box>

      <Box
        sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
      >
        {currentWorkspace.members.map((member) => (
          <Paper
            key={member._id || member.user._id}
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper,
              width: "100%",
              minWidth: 0, // This prevents flex items from overflowing
              flexShrink: 0,
            }}
          >
            <Avatar
              sx={{
                bgcolor: theme.palette.primary.main,
                width: 32,
                height: 32,
                flexShrink: 0,
              }}
            >
              {member.user?.name?.[0]?.toUpperCase() || "U"}
            </Avatar>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              {" "}
              {/* minWidth: 0 allows text to truncate */}
              <Typography
                variant="body2"
                fontWeight={500}
                color="text.primary"
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {member.user?.name || "Unknown User"}
                {(member.user._id === user?.id || member.user === user?.id) &&
                  " (You)"}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: "block",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {member.user?.email}
              </Typography>
            </Box>

            <Chip
              label={member.role}
              size="small"
              color={getRoleColor(member.role)}
              variant="outlined"
              sx={{ flexShrink: 0 }}
            />
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

const RecentlyVisited = () => {
  const theme = useTheme();

  const recentItems = [
    {
      icon: (
        <DescriptionIcon
          sx={{ fontSize: 20, color: theme.palette.text.secondary }}
        />
      ),
      title: "Getting Started",
      type: "page",
    },
    {
      icon: (
        <AddIcon sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
      ),
      title: "New page",
      type: "new",
    },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          📅 Recently visited
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 2 }}>
        {recentItems.map((item, index) => (
          <Paper
            key={index}
            sx={{
              width: 120,
              height: 80,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper,
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            {item.icon}
            <Typography variant="caption" sx={{ mt: 1, textAlign: "center" }}>
              {item.title}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

const UpcomingEvents = () => {
  const theme = useTheme();

  const events = [
    {
      title: "Team standup",
      time: "9 AM",
      location: "Office",
      date: "Today\nJun 1",
      action: "Join and take notes",
    },
    {
      title: "Project check-in",
      time: "10 AM",
      location: "Office",
      date: "Mon\nJun 2",
      action: "",
    },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          📅 Upcoming events
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {events.map((event, index) => (
          <Paper
            key={index}
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper,
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <CalendarIcon
              sx={{ fontSize: 20, color: theme.palette.text.secondary, mr: 2 }}
            />

            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" fontWeight={500} color="text.primary">
                {event.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {event.time} • {event.location}
              </Typography>
            </Box>

            <Box sx={{ textAlign: "center", mr: 2 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ whiteSpace: "pre-line" }}
              >
                {event.date}
              </Typography>
            </Box>

            {event.action && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<GroupIcon />}
                sx={{
                  textTransform: "none",
                  fontSize: "12px",
                  borderColor: theme.palette.divider,
                  color: theme.palette.text.secondary,
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                    borderColor: theme.palette.text.secondary,
                  },
                }}
              >
                {event.action}
              </Button>
            )}
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

const ConnectAIMeeting = () => {
  const theme = useTheme();

  return (
    <Box sx={{ mb: 4 }}>
      <Paper
        sx={{
          p: 3,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          textAlign: "center",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Box sx={{ mb: 2 }}>
          <CalendarIcon
            sx={{ fontSize: 40, color: theme.palette.text.secondary }}
          />
        </Box>

        <Typography
          variant="h6"
          fontWeight={500}
          sx={{ mb: 1 }}
          color="text.primary"
        >
          Connect AI Meeting Notes with your Calendar events
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Join calls, transcribe audio, and summarize meetings all in Notion.
        </Typography>

        <Button
          variant="contained"
          sx={{
            backgroundColor: theme.palette.primary.main,
            textTransform: "none",
            borderRadius: 2,
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          Connect Notion Calendar
        </Button>
      </Paper>
    </Box>
  );
};

const RightSidebar = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: "auto",
        height: "100vh",
        // backgroundColor: theme.palette.background.default,
        borderLeft: `1px solid ${theme.palette.divider}`,
        py: 3,
        px: 1,
        overflowY: "auto",
      }}
    >
      {/* <RecentlyVisited /> */}
      {/* <UpcomingEvents /> */}
      <WorkspaceMembers />
      <ConnectAIMeeting />
    </Box>
  );
};

export default RightSidebar;
