import React from "react";
import PropTypes from "prop-types";
import { Box, Paper, Typography, Link, Avatar } from "@mui/material";
import { styled } from "@mui/material/styles";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";

const MessageContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  marginBottom: theme.spacing(2),
  gap: theme.spacing(1),
}));

const MessageBubble = styled(Paper)(({ theme, isUser }) => ({
  padding: theme.spacing(1.5),
  maxWidth: "70%",
  borderRadius: theme.spacing(2),
  backgroundColor: isUser
    ? theme.palette.primary.main
    : theme.palette.grey[100],
  color: isUser
    ? theme.palette.primary.contrastText
    : theme.palette.text.primary,
}));

const ChatMessage = ({ message, isUser }) => {
  const { content, timestamp, sources } = message;

  return (
    <MessageContainer
      sx={{
        flexDirection: isUser ? "row-reverse" : "row",
      }}
    >
      <Avatar
        sx={{
          bgcolor: isUser ? "primary.main" : "#E8F5E9",
          width: 32,
          height: 32,
        }}
      >
        {isUser ? (
          <PersonIcon sx={{ color: "#fff" }} />
        ) : (
          <SmartToyIcon sx={{ color: "#2E7D32" }} />
        )}
      </Avatar>

      <Box sx={{ maxWidth: "70%" }}>
        <MessageBubble isUser={isUser} elevation={1}>
          <Typography variant="body1">{content}</Typography>

          {sources && sources.length > 0 && (
            <Box mt={1}>
              <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                Sources:
              </Typography>
              <Box component="ul" sx={{ m: 0, pl: 2 }}>
                {sources.map((source, index) => (
                  <Typography
                    component="li"
                    variant="caption"
                    key={index}
                    sx={{ mt: 0.5 }}
                  >
                    <Link
                      href={source.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ color: isUser ? "inherit" : "primary.main" }}
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
              opacity: 0.8,
              textAlign: isUser ? "right" : "left",
            }}
          >
            {new Date(timestamp).toLocaleTimeString()}
          </Typography>
        </MessageBubble>
      </Box>
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
