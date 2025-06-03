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

const StyledFab = styled(Fab)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(4),
  right: theme.spacing(4),
  backgroundColor: "#37352F",
  "&:hover": {
    backgroundColor: "#2B2B2B",
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
  boxShadow:
    "rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px",
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
  backgroundColor: "#fff",
  "&::-webkit-scrollbar": {
    width: "6px",
  },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    background: theme.palette.divider,
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
    backgroundColor: "#F7F7F7",
    borderRadius: "8px",
    fontSize: "0.95rem",
    transition: "background-color 200ms ease-in-out",
    "&:hover": {
      backgroundColor: "#EFEFEF",
    },
    "&.Mui-focused": {
      backgroundColor: "#fff",
    },
    "& fieldset": {
      borderColor: "transparent",
    },
    "&:hover fieldset": {
      borderColor: "transparent",
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
              <Avatar sx={{ bgcolor: "#F0F1F2", width: 32, height: 32 }}>
                <SmartToyIcon
                  sx={{ color: "#37352F", width: 20, height: 20 }}
                />
              </Avatar>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 500,
                  color: "#37352F",
                }}
              >
                Workspace Assistant
              </Typography>
            </Box>
            <IconButton
              onClick={() => setIsOpen(false)}
              size="small"
              sx={{
                color: "#37352F",
                opacity: 0.6,
                "&:hover": {
                  opacity: 1,
                  backgroundColor: "#F0F1F2",
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
                    bgcolor: "#37352F",
                    width: 36,
                    height: 36,
                    color: "white",
                    "&:hover": {
                      bgcolor: "#2B2B2B",
                    },
                    "&.Mui-disabled": {
                      bgcolor: "rgba(55, 53, 47, 0.2)",
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
