import React from "react";
import {
  Box,
  Typography,
  InputAdornment,
  TextField,
  Button,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

const MainContent = () => {
  return (
    <Box
      sx={{
        flex: 1,
        height: "100vh",
        backgroundColor: "#ffffff",
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
                backgroundColor: "#f3f2f1",
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
                color: "#37352f",
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
                  <SearchIcon sx={{ color: "#6b7280" }} />
                </InputAdornment>
              ),
              sx: {
                backgroundColor: "#f7f6f3",
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
                color: "#6b7280",
                textTransform: "none",
                fontSize: "14px",
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.04)",
                },
              }}
            >
              Ask
            </Button>
            <Button
              variant="text"
              sx={{
                color: "#6b7280",
                textTransform: "none",
                fontSize: "14px",
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.04)",
                },
              }}
            >
              Research
            </Button>
            <Button
              variant="text"
              sx={{
                color: "#6b7280",
                textTransform: "none",
                fontSize: "14px",
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.04)",
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
                color: "#6b7280",
                textTransform: "none",
                fontSize: "14px",
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.04)",
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
