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
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const Headers = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <AppBar position="sticky" color="inherit" elevation={0}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
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
                  backgroundColor: "primary.main",
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
                gap: 3,
                flex: 1,
                justifyContent: "center",
              }}
            >
              <Button
                endIcon={<ArrowDownIcon sx={{ fontSize: "12px" }} />}
                sx={{
                  color: "text.primary",
                  fontSize: "14px",
                  fontWeight: 500,
                  textTransform: "none",
                  px: 1.5,
                  py: 1,
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: "secondary.main",
                  },
                }}
              >
                Notion
              </Button>

              <Button
                sx={{
                  color: "text.primary",
                  fontSize: "14px",
                  fontWeight: 500,
                  textTransform: "none",
                  px: 1.5,
                  py: 1,
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: "secondary.main",
                  },
                }}
              >
                Mail
              </Button>

              <Button
                sx={{
                  color: "text.primary",
                  fontSize: "14px",
                  fontWeight: 500,
                  textTransform: "none",
                  px: 1.5,
                  py: 1,
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: "secondary.main",
                  },
                }}
              >
                Calendar
              </Button>

              <Chip
                label="New"
                size="small"
                sx={{
                  backgroundColor: "warning.light",
                  color: "warning.main",
                  fontWeight: 600,
                  fontSize: "14px",
                  height: 32,
                }}
              />

              <Button
                sx={{
                  color: "text.primary",
                  fontSize: "14px",
                  fontWeight: 500,
                  textTransform: "none",
                  px: 1.5,
                  py: 1,
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: "secondary.main",
                  },
                }}
              >
                AI
              </Button>

              <Button
                sx={{
                  color: "text.primary",
                  fontSize: "14px",
                  fontWeight: 500,
                  textTransform: "none",
                  px: 1.5,
                  py: 1,
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: "secondary.main",
                  },
                }}
              >
                Enterprise
              </Button>

              <Button
                sx={{
                  color: "text.primary",
                  fontSize: "14px",
                  fontWeight: 500,
                  textTransform: "none",
                  px: 1.5,
                  py: 1,
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: "secondary.main",
                  },
                }}
              >
                Pricing
              </Button>

              <Button
                endIcon={<ArrowDownIcon sx={{ fontSize: "12px" }} />}
                sx={{
                  color: "text.primary",
                  fontSize: "14px",
                  fontWeight: 500,
                  textTransform: "none",
                  px: 1.5,
                  py: 1,
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: "secondary.main",
                  },
                }}
              >
                Explore
              </Button>

              <Button
                sx={{
                  color: "text.primary",
                  fontSize: "14px",
                  fontWeight: 500,
                  textTransform: "none",
                  px: 1.5,
                  py: 1,
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: "secondary.main",
                  },
                }}
              >
                Request a demo
              </Button>
            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
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
                  color: "text.primary",
                  fontSize: "14px",
                  fontWeight: 500,
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: "secondary.main",
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
                  backgroundColor: "primary.main",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: 500,
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: "primary.dark",
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
