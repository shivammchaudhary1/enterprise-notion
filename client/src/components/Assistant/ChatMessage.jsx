import React from "react";
import PropTypes from "prop-types";
import { Box, Paper, Typography, Link, Avatar } from "@mui/material";
import { styled } from "@mui/material/styles";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";

const MessageContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  marginBottom: theme.spacing(1.5),
  gap: theme.spacing(1.5),
  padding: theme.spacing(0.5, 1),
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
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
}));

const ChatMessage = ({ message, isUser }) => {
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
            bgcolor: "#F0F1F2",
            width: 28,
            height: 28,
            mt: 0.5,
          }}
        >
          <SmartToyIcon sx={{ color: "#37352F", width: 18, height: 18 }} />
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
                      color: "primary.main",
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
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
            bgcolor: "#37352F",
            width: 28,
            height: 28,
            mt: 0.5,
          }}
        >
          <PersonIcon sx={{ width: 18, height: 18 }} />
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
