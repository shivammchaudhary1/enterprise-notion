import React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Public as PublicIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const Headers = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            justifyContent: "space-between",
            minHeight: "64px !important",
          }}
        >
          {/* Logo Section */}
          <Link to="/" style={{ textDecoration: "none" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 32,
                  height: 32,
                  backgroundColor: "#000",
                  borderRadius: 1,
                  mr: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "18px",
                  }}
                >
                  N
                </Typography>
              </Box>
            </Box>
          </Link>

          {/* Navigation Menu - Hidden on mobile */}
          {!isMobile && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                flex: 1,
                justifyContent: "center",
              }}
            >
              <Button
                endIcon={<ArrowDownIcon sx={{ fontSize: "1.1rem" }} />}
                sx={{
                  color: "#000",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  textTransform: "none",
                  px: 1.5,
                  py: 1,
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.04)",
                  },
                }}
              >
                Notion
              </Button>

              <Link to="/spaces" style={{ textDecoration: "none" }}>
                <Button
                  startIcon={<PublicIcon />}
                  sx={{
                    color: "#000",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    textTransform: "none",
                    px: 1.5,
                    py: 1,
                    borderRadius: 1,
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.04)",
                    },
                  }}
                >
                  Spaces
                </Button>
              </Link>

              <Button
                sx={{
                  color: "#000",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  textTransform: "none",
                  px: 1.5,
                  py: 1,
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.04)",
                  },
                }}
              >
                Calendar
              </Button>

              <Chip
                label="New"
                size="small"
                sx={{
                  backgroundColor: "#f1f1f0",
                  color: "#666",
                  fontWeight: 500,
                  fontSize: "0.75rem",
                  height: "auto",
                  py: 0.25,
                  px: 0.5,
                }}
              />

              <Button
                sx={{
                  color: "#000",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  textTransform: "none",
                  px: 1.5,
                  py: 1,
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.04)",
                  },
                }}
              >
                AI
              </Button>

              <Button
                sx={{
                  color: "#000",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  textTransform: "none",
                  px: 1.5,
                  py: 1,
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.04)",
                  },
                }}
              >
                Enterprise
              </Button>

              <Button
                sx={{
                  color: "#000",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  textTransform: "none",
                  px: 1.5,
                  py: 1,
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.04)",
                  },
                }}
              >
                Pricing
              </Button>

              <Button
                endIcon={<ArrowDownIcon sx={{ fontSize: "1.1rem" }} />}
                sx={{
                  color: "#000",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  textTransform: "none",
                  px: 1.5,
                  py: 1,
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.04)",
                  },
                }}
              >
                Explore
              </Button>

              <Button
                sx={{
                  color: "#000",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  textTransform: "none",
                  px: 1.5,
                  py: 1,
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.04)",
                  },
                }}
              >
                Request a demo
              </Button>
            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {isMobile && (
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
              >
                <MenuIcon />
              </IconButton>
            )}

            <Link to="/login" style={{ textDecoration: "none" }}>
              <Button
                variant="text"
                sx={{
                  color: "#000",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  textTransform: "none",
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.04)",
                  },
                }}
              >
                Log in
              </Button>
            </Link>

            <Link to="/register" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#000",
                  color: "#fff",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  textTransform: "none",
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: "#333",
                  },
                }}
              >
                Get Notion free
              </Button>
            </Link>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Headers;
