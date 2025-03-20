import React from "react";
import { Link } from "react-router-dom";
import { Button, Box, Typography, Grid2, Paper } from "@mui/material";

import {
  PeopleAlt as PeopleAltIcon,
  Forum as ForumIcon,
  EmojiObjects as EmojiObjectsIcon,
} from "@mui/icons-material";

function LandingPage() {
  const features = [
    {
      icon: <PeopleAltIcon fontSize="large" />,
      title: "Connect",
      description: "Join a community of supportive individuals ready to help",
    },
    {
      icon: <ForumIcon fontSize="large" />,
      title: "Share",
      description: "Exchange ideas and find solutions to common challenges",
    },
    {
      icon: <EmojiObjectsIcon fontSize="large" />,
      title: "Grow",
      description: "Access resources and expertise to develop new skills",
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh" }}>
      {/* Hero Section */}
      <Box
        className="flex flex-col justify-center items-center"
        sx={{
          minHeight: "55vh",
          padding: 3,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h2"
          sx={{ color: "#1DBF73", fontWeight: "bold", paddingBottom: 2 }}
        >
          Yuthukama.
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: "#191919",
            maxWidth: "600px",
            paddingBottom: 2,
          }}
        >
          Connect. Support. Thrive.
        </Typography>
        <Typography variant="body1" sx={{ color: "#444", maxWidth: "600px" }}>
          A platform where community members can seek support, share knowledge,
          and build meaningful connections.
        </Typography>
        <Box className="flex gap-4" sx={{ marginTop: 3 }}>
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
      </Box>

      {/* Features Section */}
      <Box sx={{ padding: 5, backgroundColor: "#f7f7f7" }}>
        <Typography
          variant="h4"
          sx={{
            color: "#222325",
            textAlign: "center",
            marginBottom: 4,
            fontWeight: "bold",
          }}
        >
          How We Support Our Community
        </Typography>

        <Grid2 container spacing={4} justifyContent="center">
          {features.map((feature, index) => (
            <Grid2 item xs={12} sm={6} md={4} key={index}>
              <Paper
                elevation={1}
                sx={{
                  padding: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  backgroundColor: "#FFFFFF",
                  borderRadius: "30px",
                }}
              >
                <Box sx={{ color: "#1DBF73", marginBottom: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" sx={{ marginBottom: 1 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid2>
          ))}
        </Grid2>
      </Box>

      {/* Call to Action */}
      <Box
        sx={{
          padding: 5,
          backgroundColor: "#FFFFFF",
          color: "#191919",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: "bold" }}>
          Join over 10,000 community members today
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          Start your journey to personal and professional growth
        </Typography>

        <Button
          component={Link}
          to="/register"
          variant="contained"
          sx={{
            backgroundColor: "#1DBF73",
            width: "180px",
            height: "46px",

            fontWeight: "bold",
            textTransform: "none",
            borderRadius: "20px",
          }}
          size="large"
        >
          Get Started
        </Button>
      </Box>
    </Box>
  );
}

export default LandingPage;
