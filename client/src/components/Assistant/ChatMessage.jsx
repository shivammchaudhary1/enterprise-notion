import React from "react";
import PropTypes from "prop-types";
import { Box, Paper, Typography, Link, Avatar } from "@mui/material";
import { styled } from "@mui/material/styles";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";
import { useTheme } from "../../contexts/ThemeContext";

const MessageContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  marginBottom: theme.spacing(1.5),
  gap: theme.spacing(1.5),
  padding: theme.spacing(0.5, 1),
  transition: "background-color 200ms ease-in-out",
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? theme.palette.action.hover
        : theme.palette.grey[50],
    borderRadius: theme.shape.borderRadius,
  },
}));

const MessageBubble = styled(Box)(({ theme }) => ({
  flex: 1,
  borderRadius: theme.shape.borderRadius,
}));

const MessageContent = styled(Typography)(({ theme }) => ({
  fontSize: "0.95rem",
  lineHeight: 1.5,
  color: theme.palette.text.primary,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  padding: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor:
    theme.palette.mode === "dark"
      ? theme.palette.background.default
      : theme.palette.background.paper,
}));

const ChatMessage = ({ message, isUser }) => {
  const { theme } = useTheme();
  const { content, timestamp, sources } = message;

  return (
    <MessageContainer
      sx={{
        justifyContent: isUser ? "flex-end" : "flex-start",
      }}
    >
      {!isUser && (
        <Avatar
          sx={{
            bgcolor:
              theme.palette.mode === "dark"
                ? theme.palette.grey[800]
                : "#F0F1F2",
            width: 28,
            height: 28,
            mt: 0.5,
          }}
        >
          <SmartToyIcon
            sx={{
              color:
                theme.palette.mode === "dark"
                  ? theme.palette.common.white
                  : "#37352F",
              width: 18,
              height: 18,
            }}
          />
        </Avatar>
      )}

      <MessageBubble>
        <MessageContent>{content}</MessageContent>

        {sources && sources.length > 0 && (
          <Box mt={1} sx={{ opacity: 0.8 }}>
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, color: "text.secondary" }}
            >
              Sources:
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2, mt: 0.5 }}>
              {sources.map((source, index) => (
                <Typography
                  component="li"
                  variant="caption"
                  key={index}
                  sx={{ mb: 0.25 }}
                >
                  <Link
                    href={source.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: theme.palette.primary.main,
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                        color: theme.palette.primary.dark,
                      },
                    }}
                  >
                    {source.title}
                  </Link>
                </Typography>
              ))}
            </Box>
          </Box>
        )}

        <Typography
          variant="caption"
          display="block"
          sx={{
            mt: 0.5,
            color: "text.secondary",
            fontSize: "0.75rem",
          }}
        >
          {new Date(timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Typography>
      </MessageBubble>

      {isUser && (
        <Avatar
          sx={{
            bgcolor:
              theme.palette.mode === "dark"
                ? theme.palette.primary.dark
                : theme.palette.primary.main,
            width: 28,
            height: 28,
            mt: 0.5,
          }}
        >
          <PersonIcon
            sx={{ width: 18, height: 18, color: theme.palette.common.white }}
          />
        </Avatar>
      )}
    </MessageContainer>
  );
};

ChatMessage.propTypes = {
  message: PropTypes.shape({
    content: PropTypes.string.isRequired,
    timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    sources: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        link: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
  isUser: PropTypes.bool.isRequired,
};

export default ChatMessage;
