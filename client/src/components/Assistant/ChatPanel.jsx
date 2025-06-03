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
  backgroundColor: theme.palette.primary.main,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const ChatContainer = styled(Paper)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(16),
  right: theme.spacing(4),
  width: "400px",
  height: "600px",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[8],
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

const MessageList = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflow: "auto",
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
}));

const InputContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

const ChatPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Get state and actions from assistant store
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
        color="primary"
        onClick={() => {
          setIsOpen((prev) => !prev);
          if (!isOpen) {
            clearMessages();
          }
        }}
        aria-label="Chat Assistant"
        size="large"
      >
        <SmartToyIcon sx={{ fontSize: 28, color: "#fff" }} />
      </StyledFab>

      <Zoom in={isOpen}>
        <ChatContainer elevation={8}>
          <ChatHeader>
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar sx={{ bgcolor: "primary.light" }}>
                <SmartToyIcon sx={{ color: "#d3d3d3" }} />
              </Avatar>
              <Typography variant="h6">Workspace Assistant</Typography>
            </Box>
            <IconButton
              onClick={() => setIsOpen(false)}
              size="small"
              sx={{ color: "inherit" }}
            >
              <CloseIcon />
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
                <CircularProgress size={24} />
              </Box>
            )}
            <div ref={messagesEndRef} />
          </MessageList>

          <InputContainer>
            <form onSubmit={handleSubmit}>
              <Box display="flex" gap={1}>
                <TextField
                  ref={inputRef}
                  fullWidth
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask a question..."
                  variant="outlined"
                  size="small"
                  disabled={isLoading}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                />
                <IconButton
                  type="submit"
                  color="primary"
                  disabled={isLoading || !inputValue.trim()}
                  sx={{
                    bgcolor: "primary.main",
                    color: "white",
                    "&:hover": { bgcolor: "primary.dark" },
                    "&.Mui-disabled": { bgcolor: "action.disabledBackground" },
                  }}
                >
                  <SendIcon />
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
