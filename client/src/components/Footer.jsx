import { Box, Container, Typography, Grid2, Link as MuiLink } from "@mui/material";
import { Link } from "react-router-dom";

/**
 * Simple footer component for the application
 */
function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#1DBF73",
        color: "white",
        py: 4,
        mt: 8,
      }}
    >
      <Container maxWidth="lg">
        <Grid2 container spacing={4}>
          {/* Brand Section */}
          <Grid2 item xs={12} md={4}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                mb: 2,
                color: "white",
              }}
            >
              Yuthukama
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
              Connect. Support. Thrive.
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              A platform where community members can seek support, share knowledge, 
              and build meaningful connections.
            </Typography>
          </Grid2>

          {/* Quick Links */}
          <Grid2 item xs={12} md={4}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                mb: 2,
                color: "white",
              }}
            >
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <MuiLink
                component={Link}
                to="/"
                sx={{
                  color: "white",
                  textDecoration: "none",
                  opacity: 0.8,
                  "&:hover": { opacity: 1 },
                }}
              >
                Home
              </MuiLink>
              <MuiLink
                component={Link}
                to="/explore"
                sx={{
                  color: "white",
                  textDecoration: "none",
                  opacity: 0.8,
                  "&:hover": { opacity: 1 },
                }}
              >
                Explore
              </MuiLink>
              <MuiLink
                component={Link}
                to="/login"
                sx={{
                  color: "white",
                  textDecoration: "none",
                  opacity: 0.8,
                  "&:hover": { opacity: 1 },
                }}
              >
                Login
              </MuiLink>
              <MuiLink
                component={Link}
                to="/register"
                sx={{
                  color: "white",
                  textDecoration: "none",
                  opacity: 0.8,
                  "&:hover": { opacity: 1 },
                }}
              >
                Register
              </MuiLink>
            </Box>
          </Grid2>

          {/* Contact Info */}
          <Grid2 item xs={12} md={4}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                mb: 2,
                color: "white",
              }}
            >
              Contact
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Email: support@yuthukama.com
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Phone: +94 11 234 5678
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Sri Lanka
              </Typography>
            </Box>
          </Grid2>
        </Grid2>

        {/* Bottom Section */}
        <Box
          sx={{
            borderTop: "1px solid rgba(255, 255, 255, 0.2)",
            mt: 4,
            pt: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © {currentYear} Yuthukama. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
