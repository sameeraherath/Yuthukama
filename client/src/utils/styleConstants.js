/**
 * Centralized style constants to reduce code duplication
 * @module styleConstants
 */

/**
 * Brand colors
 */
export const COLORS = {
  primary: "#1DBF73",
  primaryHover: "#18a364",
  primaryDark: "#179e5c",
  secondary: "#404145",
  error: "#d32f2f",
  success: "#2e7d32",
  warning: "#ed6c02",
  info: "#0288d1",
  text: {
    primary: "#2c3e50",
    secondary: "#666",
    disabled: "#B0B0B0",
  },
  background: {
    default: "#fff",
    paper: "#f9f9f9",
  },
  border: "#e0e0e0",
};

/**
 * Common border radius values
 */
export const BORDER_RADIUS = {
  small: 2,
  medium: 3,
  large: 4,
  round: 25,
  circle: "50%",
};

/**
 * Common spacing values (multiplier for theme spacing)
 */
export const SPACING = {
  xs: 0.5,
  sm: 1,
  md: 2,
  lg: 3,
  xl: 4,
  xxl: 6,
};

/**
 * Common box shadows
 */
export const SHADOWS = {
  card: "0 4px 12px rgba(0,0,0,0.1)",
  cardHover: "0 8px 24px rgba(0,0,0,0.15)",
  button: "0 2px 8px rgba(0,0,0,0.1)",
  dialog: "0 8px 32px rgba(0,0,0,0.12)",
};

/**
 * Common transitions
 */
export const TRANSITIONS = {
  default: "all 0.2s ease-in-out",
  transform: "transform 0.2s ease-in-out",
  opacity: "opacity 0.2s ease-in-out",
  background: "background 0.2s ease-in-out",
  shadow: "box-shadow 0.2s ease-in-out",
};

/**
 * Reusable style objects for common patterns
 */
export const COMMON_STYLES = {
  /**
   * Card hover effect
   */
  cardHoverEffect: {
    transition: TRANSITIONS.default,
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: SHADOWS.cardHover,
    },
  },

  /**
   * Focused input border
   */
  focusedInput: {
    "& .MuiOutlinedInput-root.Mui-focused fieldset": {
      borderColor: COLORS.primary,
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: COLORS.primary,
    },
  },

  /**
   * Rounded button
   */
  roundedButton: {
    borderRadius: BORDER_RADIUS.round,
    textTransform: "none",
    fontWeight: 600,
    px: 3,
  },

  /**
   * Primary button
   */
  primaryButton: {
    backgroundColor: COLORS.primary,
    color: "white",
    "&:hover": {
      backgroundColor: COLORS.primaryHover,
    },
  },

  /**
   * Center flexbox
   */
  centerFlex: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  /**
   * Text ellipsis (3 lines)
   */
  textEllipsis: (lines = 3) => ({
    display: "-webkit-box",
    WebkitLineClamp: lines,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
  }),

  /**
   * Absolute center positioning
   */
  absoluteCenter: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },

  /**
   * Scrollable container
   */
  scrollable: {
    overflowY: "auto",
    "&::-webkit-scrollbar": {
      width: "8px",
    },
    "&::-webkit-scrollbar-track": {
      background: "#f1f1f1",
      borderRadius: "4px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#888",
      borderRadius: "4px",
      "&:hover": {
        background: "#555",
      },
    },
  },
};

/**
 * Responsive breakpoint helpers
 */
export const BREAKPOINTS = {
  xs: "0px",
  sm: "600px",
  md: "900px",
  lg: "1200px",
  xl: "1536px",
};

/**
 * Z-index layers
 */
export const Z_INDEX = {
  drawer: 1200,
  appBar: 1100,
  modal: 1300,
  snackbar: 1400,
  tooltip: 1500,
};
