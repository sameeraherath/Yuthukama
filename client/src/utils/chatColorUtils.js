/**
 * Chat Color Utilities
 * Centralized color management for chat components
 * @module chatColorUtils
 */

/**
 * Chat-specific color palette based on platform theme
 */
export const CHAT_COLORS = {
  // Primary colors
  primary: "#1DBF73",
  primaryHover: "#18a364",
  primaryDark: "#179e5c",
  
  // Message bubble colors
  sentMessage: "#1DBF73",
  receivedMessage: "#FFFFFF",
  
  // Background colors
  chatBackground: "#f0f2f5",
  conversationSelected: "#e8f5e9",
  conversationHover: "#f5f5f5",
  
  // Border colors
  border: "#e4e6eb",
  focusBorder: "#1DBF73",
  
  // Text colors
  textPrimary: "#050505",
  textSecondary: "#65676b",
  textDisabled: "#bcc0c4",
  
  // Status colors
  online: "#1DBF73",
  offline: "#90949c",
  typing: "#90949c",
};

/**
 * Get message bubble styles based on sender
 * @param {boolean} isSentByCurrentUser - Whether message is sent by current user
 * @returns {Object} Style object for message bubble
 */
export const getMessageBubbleStyles = (isSentByCurrentUser) => ({
  backgroundColor: isSentByCurrentUser ? CHAT_COLORS.sentMessage : CHAT_COLORS.receivedMessage,
  color: isSentByCurrentUser ? "white" : CHAT_COLORS.textPrimary,
  borderRadius: "18px",
  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
  border: isSentByCurrentUser ? "none" : `1px solid ${CHAT_COLORS.border}`,
});

/**
 * Get conversation item styles based on selection state
 * @param {boolean} isSelected - Whether conversation is selected
 * @returns {Object} Style object for conversation item
 */
export const getConversationStyles = (isSelected) => ({
  backgroundColor: isSelected ? CHAT_COLORS.conversationSelected : "transparent",
  borderLeft: isSelected ? `3px solid ${CHAT_COLORS.primary}` : "3px solid transparent",
  "&:hover": {
    backgroundColor: isSelected ? CHAT_COLORS.conversationSelected : CHAT_COLORS.conversationHover,
  },
});

/**
 * Get button styles for chat actions
 * @param {string} variant - Button variant (primary, secondary, etc.)
 * @returns {Object} Style object for button
 */
export const getButtonStyles = (variant = "primary") => {
  const baseStyles = {
    borderRadius: "8px",
    textTransform: "none",
    fontWeight: 600,
    transition: "all 0.2s ease-in-out",
  };

  switch (variant) {
    case "primary":
      return {
        ...baseStyles,
        backgroundColor: CHAT_COLORS.primary,
        color: "white",
        "&:hover": {
          backgroundColor: CHAT_COLORS.primaryHover,
        },
      };
    case "outlined":
      return {
        ...baseStyles,
        borderColor: CHAT_COLORS.primary,
        color: CHAT_COLORS.primary,
        "&:hover": {
          borderColor: CHAT_COLORS.primaryHover,
          backgroundColor: "rgba(29, 191, 115, 0.04)",
        },
      };
    default:
      return baseStyles;
  }
};

/**
 * Get input field styles for chat
 * @returns {Object} Style object for input field
 */
export const getInputStyles = () => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "20px",
    backgroundColor: CHAT_COLORS.chatBackground,
    "& fieldset": {
      borderColor: "transparent",
    },
    "&:hover fieldset": {
      borderColor: "transparent",
    },
    "&.Mui-focused fieldset": {
      borderColor: CHAT_COLORS.focusBorder,
      borderWidth: 1,
    },
  },
});

/**
 * Get attachment styles
 * @param {string} type - Attachment type
 * @returns {Object} Style object for attachment
 */
export const getAttachmentStyles = (type) => {
  const baseStyles = {
    borderRadius: "8px",
    overflow: "hidden",
  };

  switch (type) {
    case "image":
      return {
        ...baseStyles,
        maxWidth: "100%",
        maxHeight: 300,
        cursor: "pointer",
        "&:hover": {
          opacity: 0.9,
        },
      };
    case "file":
      return {
        ...baseStyles,
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        padding: 1.5,
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        maxWidth: 300,
      };
    default:
      return baseStyles;
  }
};

export default CHAT_COLORS;
