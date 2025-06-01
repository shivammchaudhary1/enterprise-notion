import React from "react";
import { Box, Typography, Paper, Button, Divider } from "@mui/material";
import {
  Description as DescriptionIcon,
  Add as AddIcon,
  CalendarToday as CalendarIcon,
  Group as GroupIcon,
  StickyNote2 as StickyNoteIcon,
} from "@mui/icons-material";

const RecentlyVisited = () => {
  const recentItems = [
    {
      icon: <DescriptionIcon sx={{ fontSize: 20, color: "#6b7280" }} />,
      title: "Getting Started",
      type: "page",
    },
    {
      icon: <AddIcon sx={{ fontSize: 20, color: "#6b7280" }} />,
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
              border: "1px solid #e9e9e7",
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "#f7f6f3",
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
              border: "1px solid #e9e9e7",
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "#f7f6f3",
              },
            }}
          >
            <CalendarIcon sx={{ fontSize: 20, color: "#6b7280", mr: 2 }} />

            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" fontWeight={500}>
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
                  borderColor: "#e9e9e7",
                  color: "#6b7280",
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.04)",
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
  return (
    <Box sx={{ mb: 4 }}>
      <Paper
        sx={{
          p: 3,
          border: "1px solid #e9e9e7",
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Box sx={{ mb: 2 }}>
          <CalendarIcon sx={{ fontSize: 40, color: "#6b7280" }} />
        </Box>

        <Typography variant="h6" fontWeight={500} sx={{ mb: 1 }}>
          Connect AI Meeting Notes with your Calendar events
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Join calls, transcribe audio, and summarize meetings all in Notion.
        </Typography>

        <Button
          variant="contained"
          sx={{
            backgroundColor: "#2196f3",
            textTransform: "none",
            borderRadius: 2,
            "&:hover": {
              backgroundColor: "#1976d2",
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
  return (
    <Box
      sx={{
        width: 300,
        height: "100vh",
        backgroundColor: "#ffffff",
        borderLeft: "1px solid #e9e9e7",
        p: 3,
        overflowY: "auto",
      }}
    >
      <RecentlyVisited />
      <UpcomingEvents />
      <ConnectAIMeeting />
    </Box>
  );
};

export default RightSidebar;
