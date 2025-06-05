import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  IconButton,
  TextField,
  Typography,
  Fab,
  Zoom,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import ChatMessage from "./ChatMessage";
import useAssistantStore from "../../stores/assistantStore";
import { useTheme } from "../../contexts/ThemeContext";

const StyledFab = styled(Fab)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(4),
  right: theme.spacing(4),
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.primary.main : "#37352F",
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.primary.dark : "#2B2B2B",
  },
  width: 44,
  height: 44,
  minHeight: "auto",
}));

const ChatContainer = styled(Paper)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(16),
  right: theme.spacing(4),
  width: "450px",
  height: "650px",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  borderRadius: 12,
  backgroundColor: theme.palette.background.paper,
  boxShadow:
    theme.palette.mode === "dark"
      ? "0px 0px 0px 1px rgba(255, 255, 255, 0.1), 0px 3px 6px rgba(0, 0, 0, 0.2), 0px 9px 24px rgba(0, 0, 0, 0.3)"
      : "rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px",
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(1.5, 2),
  borderBottom: "1px solid rgba(55, 53, 47, 0.09)",
  backgroundColor: "#fff",
}));

const MessageList = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflow: "auto",
  padding: theme.spacing(1, 0),
  backgroundColor: theme.palette.background.paper,
  "&::-webkit-scrollbar": {
    width: "6px",
  },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    background:
      theme.palette.mode === "dark"
        ? theme.palette.grey[700]
        : theme.palette.grey[300],
    borderRadius: "3px",
  },
}));

const InputContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(55, 53, 47, 0.09)",
  backgroundColor: "#fff",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? theme.palette.background.default
        : "#F7F7F7",
    borderRadius: "8px",
    fontSize: "0.95rem",
    transition: "background-color 200ms ease-in-out",
    "&:hover": {
      backgroundColor:
        theme.palette.mode === "dark" ? theme.palette.action.hover : "#EFEFEF",
    },
    "&.Mui-focused": {
      backgroundColor: theme.palette.background.paper,
    },
    "& fieldset": {
      borderColor:
        theme.palette.mode === "dark" ? theme.palette.divider : "transparent",
    },
    "&:hover fieldset": {
      borderColor:
        theme.palette.mode === "dark"
          ? theme.palette.primary.main
          : "transparent",
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const ChatPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { theme } = useTheme();

  const { messages, isLoading, error, sendMessage, clearMessages } =
    useAssistantStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    setInputValue("");
    try {
      await sendMessage(inputValue.trim());
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <>
      <StyledFab
        onClick={() => {
          setIsOpen((prev) => !prev);
          if (!isOpen) {
            clearMessages();
          }
        }}
        aria-label="Chat Assistant"
      >
        <SmartToyIcon sx={{ fontSize: 20, color: "#fff" }} />
      </StyledFab>

      <Zoom in={isOpen}>
        <ChatContainer elevation={0}>
          <ChatHeader>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Avatar
                sx={{
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? theme.palette.grey[800]
                      : "#F0F1F2",
                  width: 32,
                  height: 32,
                }}
              >
                <SmartToyIcon
                  sx={{
                    color:
                      theme.palette.mode === "dark"
                        ? theme.palette.common.white
                        : "#37352F",
                    width: 20,
                    height: 20,
                  }}
                />
              </Avatar>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                }}
              >
                Workspace Assistant
              </Typography>
            </Box>
            <IconButton
              onClick={() => setIsOpen(false)}
              size="small"
              sx={{
                color: theme.palette.text.secondary,
                opacity: 0.7,
                "&:hover": {
                  opacity: 1,
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <CloseIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </ChatHeader>

          <MessageList>
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                message={message}
                isUser={message.role === "user"}
              />
            ))}
            {isLoading && (
              <Box display="flex" justifyContent="center" my={2}>
                <CircularProgress size={20} sx={{ color: "#37352F" }} />
              </Box>
            )}
            <div ref={messagesEndRef} />
          </MessageList>

          <InputContainer>
            <form onSubmit={handleSubmit}>
              <Box display="flex" gap={1}>
                <StyledTextField
                  ref={inputRef}
                  fullWidth
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask a question..."
                  variant="outlined"
                  size="small"
                  disabled={isLoading}
                  multiline
                  maxRows={4}
                />
                <IconButton
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    width: 36,
                    height: 36,
                    color: theme.palette.common.white,
                    "&:hover": {
                      bgcolor: theme.palette.primary.dark,
                    },
                    "&.Mui-disabled": {
                      bgcolor: theme.palette.action.disabledBackground,
                      color: theme.palette.action.disabled,
                    },
                  }}
                >
                  <SendIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>
            </form>
          </InputContainer>
        </ChatContainer>
      </Zoom>
    </>
  );
};

export default ChatPanel;
