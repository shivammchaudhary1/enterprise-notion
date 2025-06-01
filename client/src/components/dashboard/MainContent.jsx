import React from "react";
import {
  Box,
  Typography,
  InputAdornment,
  TextField,
  Button,
  useTheme,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

const MainContent = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        flex: 1,
        height: "100vh",
        backgroundColor: theme.palette.background.default,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
          pt: 8,
        }}
      >
        <Box sx={{ textAlign: "center", maxWidth: 600 }}>
          {/* Greeting */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 4,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.1)"
                    : "#f3f2f1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 2,
                fontSize: "18px",
              }}
            >
              🌟
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 400,
                color: theme.palette.text.primary,
                fontSize: "28px",
              }}
            >
              Good afternoon, Shivam Chaudhary
            </Typography>
          </Box>

          {/* Search Bar */}
          <TextField
            fullWidth
            placeholder="Ask or find anything from your workspace..."
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: theme.palette.text.secondary }} />
                </InputAdornment>
              ),
              sx: {
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.05)"
                    : "#f7f6f3",
                borderRadius: 2,
                border: "none",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: "1px solid #2196f3",
                },
                fontSize: "16px",
                py: 1,
                color: theme.palette.text.primary,
              },
            }}
            sx={{ mb: 4 }}
          />

          {/* Action Buttons */}
          <Box
            sx={{ display: "flex", gap: 2, justifyContent: "center", mb: 6 }}
          >
            <Button
              variant="text"
              sx={{
                color: theme.palette.text.secondary,
                textTransform: "none",
                fontSize: "14px",
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              Ask
            </Button>
            <Button
              variant="text"
              sx={{
                color: theme.palette.text.secondary,
                textTransform: "none",
                fontSize: "14px",
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              Research
            </Button>
            <Button
              variant="text"
              sx={{
                color: theme.palette.text.secondary,
                textTransform: "none",
                fontSize: "14px",
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              Build
            </Button>
          </Box>

          {/* All Sources Dropdown */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              mb: 2,
            }}
          >
            <Button
              variant="text"
              sx={{
                color: theme.palette.text.secondary,
                textTransform: "none",
                fontSize: "14px",
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              📚 All sources ▼
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MainContent;
