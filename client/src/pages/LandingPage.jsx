import { Link } from "react-router-dom";
import {
  Button,
  Box,
  Typography,
  Container,
  useMediaQuery,
  useTheme,
  Grid2,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import ArticlesSection from "../components/articles/ArticlesSection";
import HeroImage from "../assets/hero.png";
import PeopleIcon from "@mui/icons-material/People";
import ChatIcon from "@mui/icons-material/Chat";
import PostAddIcon from "@mui/icons-material/PostAdd";
import SecurityIcon from "@mui/icons-material/Security";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import ForumIcon from "@mui/icons-material/Forum";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import EventIcon from "@mui/icons-material/Event";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SchoolIcon from "@mui/icons-material/School";

/**
 * Landing page component showcasing platform features, mentorship, vision, and stats
 */
function LandingPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const features = [
    {
      icon: <PeopleIcon sx={{ fontSize: 40, color: "#1DBF73" }} />,
      title: "Community Building",
      description:
        "Connect with like-minded individuals and build meaningful relationships within your community.",
    },
    {
      icon: <ChatIcon sx={{ fontSize: 40, color: "#1DBF73" }} />,
      title: "Real-time Chat",
      description:
        "Engage in instant conversations with community members through our secure chat system.",
    },
    {
      icon: <SchoolIcon sx={{ fontSize: 40, color: "#1DBF73" }} />,
      title: "Mentorship Program",
      description:
        "Connect with experienced mentors for guidance, support, and personal growth.",
    },
    {
      icon: <PostAddIcon sx={{ fontSize: 40, color: "#1DBF73" }} />,
      title: "Share Knowledge",
      description:
        "Create and share posts to exchange knowledge, experiences, and resources with others.",
    },
    {
      icon: <SmartToyIcon sx={{ fontSize: 40, color: "#1DBF73" }} />,
      title: "AI-Powered Assistance",
      description:
        "Get instant support and answers to your questions with our integrated AI assistant.",
    },
    {
      icon: <EventIcon sx={{ fontSize: 40, color: "#1DBF73" }} />,
      title: "Event Announcements",
      description:
        "Stay updated with the latest community events, workshops, and meetups through timely announcements.",
    },
  ];

  const howToUse = [
    {
      icon: <HowToRegIcon sx={{ fontSize: 40, color: "#1DBF73" }} />,
      title: "Create Account",
      description: "Sign up with your email and create your profile to get started.",
    },
    {
      icon: <ForumIcon sx={{ fontSize: 40, color: "#1DBF73" }} />,
      title: "Join Discussions",
      description: "Participate in community discussions and share your thoughts.",
    },
    {
      icon: <EmojiEventsIcon sx={{ fontSize: 40, color: "#1DBF73" }} />,
      title: "Build Connections",
      description: "Connect with others, share experiences, and grow together.",
    },
  ];

  const stats = [
    { label: "Mentors Joined", value: "120+" },
    { label: "Children Supported", value: "500+" },
    { label: "Community Events", value: "25+" },
    { label: "Knowledge Posts", value: "300+" },
  ];

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
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
              A platform where community members can seek support, share knowledge, 
              and build meaningful connections while creating a positive impact.
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
                  "&:hover": { borderColor: "#1A8851", color: "#1A8851" },
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

        {/* Features Section */}
        <Box
          sx={{
            minHeight: "80vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 8,
          }}
        >
          <Typography
            variant="h3"
            align="center"
            sx={{
              color: "#404145",
              fontWeight: "bold",
              mb: 6,
              fontSize: isMobile ? "2rem" : "2.5rem",
            }}
          >
            Why Choose Yuthukama?
          </Typography>
          <Grid2
            container
            spacing={4}
            justifyContent="center"
            alignItems="center"
            sx={{ maxWidth: 1100, margin: "0 auto" }}
          >
            {features.map((feature, index) => (
              <Grid2
                item
                xs={12}
                sm={8}
                md={6}
                lg={3}
                key={index}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Card
                  sx={{
                    width: 260,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    p: 3,
                    borderRadius: "20px",
                    boxShadow: theme.shadows[2],
                    transition: "transform 0.2s",
                    "&:hover": { transform: "translateY(-5px)", boxShadow: theme.shadows[4] },
                  }}
                >
                  <CardContent>
                    <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", mb: 1, color: "#404145" }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid2>
            ))}
          </Grid2>
        </Box>

        {/* Mentorship Highlight Section */}
        <Box
          sx={{
            py: 8,
            backgroundColor: "#e8f5e9",
            borderRadius: "30px",
            mb: 8,
          }}
        >
          <Container maxWidth="md">
            <Typography
              variant="h3"
              align="center"
              sx={{
                color: "#1DBF73",
                fontWeight: "bold",
                mb: 4,
                fontSize: isMobile ? "2rem" : "2.5rem",
              }}
            >
              Mentorship Program
            </Typography>
            <Typography
              variant="body1"
              align="center"
              sx={{ color: "#404145", mb: 6, fontSize: isMobile ? "1rem" : "1.2rem" }}
            >
              Our mentorship program connects experienced mentors with children and young adults who need guidance and support. Mentors help them grow, learn, and achieve their full potential.
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                size="large"
                sx={{
                  minWidth: "200px",
                  fontWeight: "bold",
                  textTransform: "none",
                  borderRadius: "20px",
                  backgroundColor: "#1DBF73",
                  color: "#FFFFFF",
                  "&:hover": { backgroundColor: "#1A8851" },
                }}
              >
                Become a Mentor
              </Button>
            </Box>
          </Container>
        </Box>

        {/* Vision / Impact Section */}
        <Box
          sx={{
            py: 8,
            borderRadius: "30px",
            mb: 8,
            backgroundColor: "#f0f9ff",
          }}
        >
          <Container maxWidth="md">
            <Typography
              variant="h3"
              align="center"
              sx={{
                color: "#1A73E8",
                fontWeight: "bold",
                mb: 4,
                fontSize: isMobile ? "2rem" : "2.5rem",
              }}
            >
              Our Vision
            </Typography>
            <Typography
              variant="body1"
              align="center"
              sx={{ color: "#404145", mb: 6, fontSize: isMobile ? "1rem" : "1.2rem" }}
            >
              To create a holistic support platform that empowers underprivileged children
              by connecting them with mentors, essential resources, and opportunities, 
              fostering their personal, educational, and social growth.
            </Typography>
          </Container>
        </Box>

        {/* Stats Section */}
        <Box
          sx={{
            py: 8,
            backgroundColor: "#fff3e0",
            borderRadius: "30px",
            mb: 8,
          }}
        >
          <Container maxWidth="md">
            <Grid2 container spacing={4} justifyContent="center">
              {stats.map((stat, index) => (
                <Grid2
                  item
                  xs={6}
                  sm={3}
                  key={index}
                  sx={{ textAlign: "center" }}
                >
                  <Typography
                    variant="h4"
                    sx={{ color: "#fb8c00", fontWeight: "bold", mb: 1 }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#404145" }}>
                    {stat.label}
                  </Typography>
                </Grid2>
              ))}
            </Grid2>
          </Container>
        </Box>

        {/* How to Use Section */}
        <Box
          sx={{
            py: 8,
            backgroundColor: "#f8f9fa",
            borderRadius: "30px",
            mb: 8,
          }}
        >
          <Container maxWidth="md">
            <Typography
              variant="h3"
              align="center"
              sx={{
                color: "#404145",
                fontWeight: "bold",
                mb: 6,
                fontSize: isMobile ? "2rem" : "2.5rem",
              }}
            >
              How to Get Started
            </Typography>
            <Stack spacing={4}>
              {howToUse.map((step, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    p: 3,
                    backgroundColor: "white",
                    borderRadius: "20px",
                    boxShadow: theme.shadows[1],
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: "#f0f9f4",
                      p: 2,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {step.icon}
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", color: "#404145" }}
                    >
                      {step.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {step.description}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
            <Box sx={{ textAlign: "center", mt: 6 }}>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                size="large"
                sx={{
                  minWidth: "200px",
                  fontWeight: "bold",
                  textTransform: "none",
                  borderRadius: "20px",
                  backgroundColor: "#1DBF73",
                  color: "#FFFFFF",
                  "&:hover": { backgroundColor: "#1A8851" },
                }}
              >
                Join Now
              </Button>
            </Box>
          </Container>
        </Box>
        
        {/* Articles Section */}
        <ArticlesSection />
      </Container>
    </Box>
  );
}

export default LandingPage;
