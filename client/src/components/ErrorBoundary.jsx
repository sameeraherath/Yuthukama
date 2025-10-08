import { Component } from "react";
import { Box, Typography, Button, Container, Paper } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import RefreshIcon from "@mui/icons-material/Refresh";
import { COLORS, BORDER_RADIUS, COMMON_STYLES } from "../utils/styleConstants";

/**
 * Error Boundary component to catch React errors
 * @component
 * @example
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error("Error Boundary caught an error:", error, errorInfo);
    }

    this.setState({
      error,
      errorInfo,
    });

    // You can also log to an external error reporting service here
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: BORDER_RADIUS.large,
              textAlign: "center",
            }}
          >
            <Box sx={COMMON_STYLES.centerFlex} flexDirection="column" gap={3}>
              <ErrorOutlineIcon
                sx={{
                  fontSize: 80,
                  color: COLORS.error,
                }}
              />
              <Typography variant="h4" component="h1" fontWeight={600}>
                Oops! Something went wrong
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                maxWidth="600px"
              >
                We're sorry for the inconvenience. An unexpected error has
                occurred. Please try refreshing the page or contact support if
                the problem persists.
              </Typography>

              {import.meta.env.DEV && this.state.error && (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    bgcolor: "#f5f5f5",
                    borderRadius: BORDER_RADIUS.medium,
                    textAlign: "left",
                    maxWidth: "100%",
                    overflow: "auto",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    color="error"
                  >
                    Error Details (Development Only):
                  </Typography>
                  <Typography
                    variant="body2"
                    component="pre"
                    sx={{
                      mt: 1,
                      fontFamily: "monospace",
                      fontSize: "0.875rem",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </Typography>
                </Box>
              )}

              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  onClick={this.handleReload}
                  sx={{
                    ...COMMON_STYLES.roundedButton,
                    ...COMMON_STYLES.primaryButton,
                  }}
                >
                  Reload Page
                </Button>
                <Button
                  variant="outlined"
                  onClick={this.handleReset}
                  sx={{
                    ...COMMON_STYLES.roundedButton,
                    borderColor: COLORS.primary,
                    color: COLORS.primary,
                  }}
                >
                  Try Again
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
