import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  Button,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import {
  Instagram,
  Twitter,
  LinkedIn,
  Facebook,
  YouTube,
  Language,
  KeyboardArrowDown,
  ArrowForward,
} from "@mui/icons-material";

const Footers = () => {
  const footerSections = {
    Company: [
      { label: "About us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Security", href: "#" },
      { label: "Status", href: "#" },
      { label: "Terms & privacy", href: "#" },
    ],
    Download: [
      { label: "iOS & Android", href: "#" },
      { label: "Mac & Windows", href: "#" },
      { label: "Calendar", href: "#" },
      { label: "Web Clipper", href: "#" },
    ],
    Resources: [
      { label: "Help center", href: "#" },
      { label: "Pricing", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Community", href: "#" },
      { label: "Integrations", href: "#" },
      { label: "Templates", href: "#" },
      { label: "Affiliates", href: "#" },
    ],
    "Notion for": [
      { label: "Enterprise", href: "#" },
      { label: "Small business", href: "#" },
      { label: "Personal", href: "#" },
    ],
  };

  const socialIcons = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: LinkedIn, href: "#", label: "LinkedIn" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: YouTube, href: "#", label: "YouTube" },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "background.paper",
        borderTop: "1px solid",
        borderColor: "divider",
        py: 6,
        px: 2,
      }}
    >
      <Container maxWidth="lg">
        {/* Main Footer Content */}
        <Grid container spacing={4}>
          {/* Logo and Social Icons */}
          <Grid item xs={12} md={3}>
            <Box sx={{ mb: 3 }}>
              {/* Notion Logo */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: "black",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 1,
                    mr: 2,
                    fontWeight: "bold",
                    fontSize: "18px",
                  }}
                >
                  N
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: "text.primary",
                  }}
                >
                  Notion
                </Typography>
              </Box>

              {/* Social Icons */}
              <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                {socialIcons.map(({ icon: Icon, href, label }) => (
                  <IconButton
                    key={label}
                    href={href}
                    sx={{
                      color: "text.secondary",
                      "&:hover": {
                        color: "text.primary",
                      },
                    }}
                    aria-label={label}
                  >
                    <Icon />
                  </IconButton>
                ))}
              </Box>

              {/* Language Selector */}
              <FormControl size="small">
                <Select
                  value="English"
                  displayEmpty
                  sx={{
                    "& .MuiSelect-select": {
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    },
                  }}
                  startAdornment={<Language sx={{ color: "text.secondary" }} />}
                >
                  <MenuItem value="English">English</MenuItem>
                  <MenuItem value="Spanish">Spanish</MenuItem>
                  <MenuItem value="French">French</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>

          {/* Footer Links */}
          {Object.entries(footerSections).map(([title, links]) => (
            <Grid item xs={12} sm={6} md={2.25} key={title}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: "600",
                  mb: 2,
                  color: "text.primary",
                }}
              >
                {title}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    sx={{
                      color: "text.secondary",
                      textDecoration: "none",
                      fontSize: "14px",
                      "&:hover": {
                        color: "text.primary",
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Box>
            </Grid>
          ))}

          {/* Explore More Section */}
          <Grid item xs={12} md={2.25}>
            <Button
              endIcon={<ArrowForward />}
              sx={{
                color: "text.primary",
                fontWeight: "600",
                textTransform: "none",
                p: 0,
                justifyContent: "flex-start",
                "&:hover": {
                  backgroundColor: "transparent",
                  "& .MuiSvgIcon-root": {
                    transform: "translateX(4px)",
                  },
                },
                "& .MuiSvgIcon-root": {
                  transition: "transform 0.2s ease",
                },
              }}
            >
              Explore more
            </Button>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Bottom Footer */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontSize: "14px",
            }}
          >
            © 2025 Notion Labs, Inc.
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 1, sm: 3 },
            }}
          >
            <Link
              href="#"
              sx={{
                color: "text.secondary",
                textDecoration: "none",
                fontSize: "14px",
                "&:hover": {
                  color: "text.primary",
                  textDecoration: "underline",
                },
              }}
            >
              Do Not Sell or Share My Info
            </Link>
            <Link
              href="#"
              sx={{
                color: "text.secondary",
                textDecoration: "none",
                fontSize: "14px",
                "&:hover": {
                  color: "text.primary",
                  textDecoration: "underline",
                },
              }}
            >
              Cookie settings
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footers;
