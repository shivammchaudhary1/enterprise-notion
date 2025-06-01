import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearMessage } from "../redux/slices/authSlice";
import Headers from "../components/Headers";
import Footers from "../components/Footers";
import {
  Box,
  Container,
  Typography,
  Stack,
  Button,
  CssBaseline,
  Fade,
} from "@mui/material";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, message } = useSelector((state) => state.auth);

  useEffect(() => {
    // Redirect authenticated users to dashboard
    if (isAuthenticated) {
      navigate("/dashboard");
      return;
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Clear welcome message after 5 seconds
    if (message) {
      const timer = setTimeout(() => {
        dispatch(clearMessage());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, dispatch]);

  return (
    <>
      <CssBaseline />
      <Headers />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.05,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <Container maxWidth="md">
          <Box sx={{ textAlign: "center", position: "relative", zIndex: 1 }}>
            <Fade in timeout={1000}>
              <Box>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: "2.5rem", md: "4rem" },
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 3,
                    lineHeight: 1.2,
                  }}
                >
                  The AI workspace that works for you.
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    color: "text.secondary",
                    mb: 6,
                    maxWidth: "600px",
                    mx: "auto",
                    lineHeight: 1.6,
                    fontWeight: 400,
                  }}
                >
                  One place where teams find every answer, automate the
                  busywork, and get projects done.
                </Typography>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  justifyContent="center"
                  sx={{ mb: 8 }}
                >
                  <Button
                    component={Link}
                    to="/login"
                    variant="contained"
                    size="large"
                    sx={{
                      py: 2,
                      px: 4,
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      borderRadius: 2,
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 10px 25px rgba(102, 126, 234, 0.3)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    Get Notion free
                  </Button>
                  <Button
                    component={Link}
                    to="/register"
                    variant="outlined"
                    size="large"
                    sx={{
                      py: 2,
                      px: 4,
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      borderRadius: 2,
                      borderColor: "primary.main",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    Request a demo
                  </Button>
                </Stack>

                {/* Trust Indicators */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Trusted by top teams
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={4}
                    justifyContent="center"
                    flexWrap="wrap"
                    sx={{ opacity: 0.6 }}
                  >
                    {[
                      "OpenAI",
                      "Figma",
                      "Volvo",
                      "Ramp",
                      "Cursor",
                      "Headspace",
                      "Perplexity",
                      "Vercel",
                    ].map((company) => (
                      <Typography
                        key={company}
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: "text.secondary",
                          display: {
                            xs: company.length > 6 ? "none" : "block",
                            sm: "block",
                          },
                        }}
                      >
                        {company}
                      </Typography>
                    ))}
                  </Stack>
                </Box>
              </Box>
            </Fade>
          </Box>
        </Container>
      </Box>
      <Footers />
    </>
  );
};

export default Home;
