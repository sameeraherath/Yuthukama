import { Box, Typography, Button } from "@mui/material";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import PostAddIcon from "@mui/icons-material/PostAdd";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

/**
 * EmptyState component - Displays friendly empty state messages with icons and CTAs
 * @component
 * @param {Object} props - Component props
 * @param {string} props.variant - Type of empty state ('no-posts', 'no-search-results', 'no-messages', 'no-notifications', 'no-users', 'no-trending')
 * @param {string} props.title - Custom title (optional, falls back to variant default)
 * @param {string} props.description - Custom description (optional, falls back to variant default)
 * @param {string} props.actionLabel - Label for action button (optional)
 * @param {Function} props.onAction - Callback when action button is clicked (optional)
 * @param {string} props.searchTerm - Search term for no-search-results variant (optional)
 * @returns {JSX.Element} Empty state component
 */
const EmptyState = ({
  variant = "no-posts",
  title,
  description,
  actionLabel,
  onAction,
  searchTerm = "",
}) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
        delay: 0.2,
      },
    },
  };

  // Get variant-specific content
  const getContent = () => {
    switch (variant) {
      case "no-posts":
        return {
          icon: PostAddIcon,
          defaultTitle: "No posts yet",
          defaultDescription: "Be the first to share something amazing!",
          defaultActionLabel: "Create Post",
          color: "#1DBF73",
        };
      case "no-search-results":
        return {
          icon: SearchOffIcon,
          defaultTitle: searchTerm
            ? `No results for "${searchTerm}"`
            : "No results found",
          defaultDescription: searchTerm
            ? "Try adjusting your search terms or filters"
            : "Try a different search query",
          defaultActionLabel: "Clear Search",
          color: "#95979D",
        };
      case "no-messages":
        return {
          icon: ChatBubbleOutlineIcon,
          defaultTitle: "No messages yet",
          defaultDescription: "Start a conversation and connect with others!",
          defaultActionLabel: "Find Users",
          color: "#29B6F6",
        };
      case "no-notifications":
        return {
          icon: NotificationsNoneIcon,
          defaultTitle: "No notifications",
          defaultDescription: "You're all caught up! Check back later.",
          defaultActionLabel: null,
          color: "#FFA726",
        };
      case "no-users":
        return {
          icon: PeopleOutlineIcon,
          defaultTitle: "No users found",
          defaultDescription: "Try adjusting your search or filters",
          defaultActionLabel: "Clear Filters",
          color: "#1DBF73",
        };
      case "no-trending":
        return {
          icon: TrendingUpIcon,
          defaultTitle: "No trending posts",
          defaultDescription: "Be the first to create engaging content!",
          defaultActionLabel: "Create Post",
          color: "#1DBF73",
        };
      default:
        return {
          icon: SearchOffIcon,
          defaultTitle: "Nothing here",
          defaultDescription: "There's nothing to show right now",
          defaultActionLabel: null,
          color: "#95979D",
        };
    }
  };

  const content = getContent();
  const Icon = content.icon;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 8,
          px: 3,
          textAlign: "center",
          minHeight: "400px",
        }}
        role="status"
        aria-label={title || content.defaultTitle}
      >
        {/* Icon */}
        <motion.div variants={iconVariants}>
          <Box
            sx={{
              width: 140,
              height: 140,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${content.color}10 0%, ${content.color}25 100%)`,
              display: "flex",
              boxShadow: `0 8px 24px ${content.color}20`,
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <Icon
              sx={{
                fontSize: 64,
                color: content.color,
              }}
            />
          </Box>
        </motion.div>

        {/* Title */}
        <Typography
          variant="h5"
          fontWeight={600}
          sx={{
            color: "text.primary",
            mb: 1,
          }}
        >
          {title || content.defaultTitle}
        </Typography>

        {/* Description */}
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            mb: 4,
            maxWidth: 400,
          }}
        >
          {description || content.defaultDescription}
        </Typography>

        {/* Action Button */}
        {(actionLabel || content.defaultActionLabel) && onAction && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="contained"
              size="large"
              onClick={onAction}
              sx={{
                backgroundColor: content.color,
                "&:hover": {
                  backgroundColor: content.color,
                  filter: "brightness(0.9)",
                },
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: "none",
                boxShadow: `0 4px 12px ${content.color}40`,
              }}
            >
              {actionLabel || content.defaultActionLabel}
            </Button>
          </motion.div>
        )}
      </Box>
    </motion.div>
  );
};

export default EmptyState;
