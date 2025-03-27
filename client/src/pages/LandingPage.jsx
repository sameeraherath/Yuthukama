import React from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Box,
  Typography,
  Container,
  useMediaQuery,
  useTheme,
  Grid2,
} from "@mui/material";
import HeroImage from "../assets/hero.png";

function LandingPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Container maxWidth="lg">
        <Grid2
          container
          spacing={4}
          alignItems="center"
          justifyContent="space-between"
          sx={{
            minHeight: "calc(100vh - 100px)",
            paddingTop: theme.spacing(4),
            paddingBottom: theme.spacing(4),
          }}
        >
          <Grid2
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              order: isMobile ? 2 : 1,
            }}
          >
            <Typography
              variant="h2"
              sx={{
                color: "#1DBF73",
                fontWeight: "bold",
                marginBottom: theme.spacing(2),
                fontSize: isMobile ? "2.6rem" : "4.5rem",
              }}
            >
              Yuthukama.
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: "#404145",
                marginBottom: theme.spacing(2),
                fontWeight: 600,
                fontSize: isMobile ? "1.5rem" : "2rem",
              }}
            >
              Connect. Support. Thrive.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#444",
                marginBottom: theme.spacing(3),
                maxWidth: "500px",
              }}
            >
              A platform where community members can seek support, share
              knowledge, and build meaningful connections.
            </Typography>
            <Box sx={{ display: "flex", gap: theme.spacing(2) }}>
              <Button
                component={Link}
                to="/login"
                variant="contained"
                size="large"
                sx={{
                  minWidth: "120px",
                  fontWeight: "bold",
                  textTransform: "none",
                  borderRadius: "20px",
                  backgroundColor: "#1DBF73",
                  color: "#FFFFFF",
                  "&:hover": { backgroundColor: "#1A8851" },
                }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="outlined"
                size="large"
                sx={{
                  minWidth: "120px",
                  borderColor: "#1DBF73",
                  color: "#1DBF73",
                  borderRadius: "20px",
                  fontWeight: "bold",
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "#1A8851",
                    color: "#1A8851",
                  },
                }}
              >
                Join Community
              </Button>
            </Box>
          </Grid2>
          <Grid2
            item
            xs={12}
            md={5}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              order: isMobile ? 1 : 2,
            }}
          >
            <Box
              component="img"
              src={HeroImage}
              alt="Community"
              sx={{
                width: "100%",
                maxWidth: "500px",
                borderRadius: "35px",
                boxShadow: theme.shadows[3],
              }}
            />
          </Grid2>
        </Grid2>
      </Container>

      {/* Existing Features and CTA sections remain the same */}
      {/* ... (rest of the component remains unchanged) */}
    </Box>
  );
}

export default LandingPage;
