import { Skeleton, Card, CardContent, Box, Stack } from "@mui/material";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { BORDER_RADIUS, SHADOWS } from "../../utils/styleConstants";

/**
 * Enhanced skeleton loader component with smooth animations
 * Provides animated loading skeletons for various content types
 * @component
 * @param {Object} props
 * @param {string} props.variant - Type of skeleton to display ('post', 'profile', 'chat', 'comment', 'list')
 * @param {number} props.count - Number of skeleton items to render (default: 1)
 * @returns {JSX.Element}
 */
const EnhancedSkeleton = ({ variant = "post", count = 1 }) => {
  // Animation for skeleton entrance with stagger effect
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  /**
   * Post card skeleton with image and content
   */
  const PostSkeleton = () => (
    <motion.div variants={itemVariants}>
      <Card
        sx={{
          maxWidth: "100%",
          borderRadius: { xs: 2, sm: 3 },
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          position: "relative",
          bgcolor: "#ffffff",
          border: "1px solid #f3f4f6",
        }}
      >
        {/* Header skeleton */}
        <Box sx={{ p: { xs: 2, sm: 3 }, pb: { xs: 1.5, sm: 2 } }}>
          <Box sx={{ display: "flex", gap: { xs: 1.5, sm: 2 }, alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", gap: { xs: 1.5, sm: 2 }, alignItems: "center", flex: 1, minWidth: 0 }}>
              <Skeleton 
                variant="circular" 
                width={{ xs: 40, sm: 48 }} 
                height={{ xs: 40, sm: 48 }} 
                animation="wave" 
                sx={{ bgcolor: "grey.100" }}
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Skeleton 
                  variant="text" 
                  height={{ xs: 18, sm: 20 }} 
                  width="60%" 
                  animation="wave" 
                  sx={{ bgcolor: "grey.100" }}
                />
                <Skeleton 
                  variant="text" 
                  height={{ xs: 12, sm: 14 }} 
                  width="40%" 
                  animation="wave" 
                  sx={{ mt: 0.5, bgcolor: "grey.100" }}
                />
              </Box>
            </Box>
            <Skeleton variant="circular" width={32} height={32} animation="wave" sx={{ bgcolor: "grey.100" }} />
          </Box>
        </Box>

        {/* Content skeleton */}
        <CardContent sx={{ p: { xs: 2, sm: 3 }, pt: 0, pb: { xs: 1.5, sm: 2 } }}>
          <Skeleton 
            variant="text" 
            height={{ xs: 16, sm: 18 }} 
            width="100%" 
            animation="wave" 
            sx={{ mb: { xs: 1.5, sm: 2 }, bgcolor: "grey.100" }}
          />
          <Skeleton 
            variant="text" 
            height={{ xs: 16, sm: 18 }} 
            width="95%" 
            animation="wave" 
            sx={{ bgcolor: "grey.100" }}
          />
          <Skeleton 
            variant="text" 
            height={{ xs: 16, sm: 18 }} 
            width="80%" 
            animation="wave" 
            sx={{ bgcolor: "grey.100" }}
          />
        </CardContent>

        {/* Image skeleton */}
        <Skeleton
          variant="rectangular"
          height={{ xs: 250, sm: 350, md: 400 }}
          animation="wave"
          sx={{ bgcolor: "grey.100" }}
        />

        {/* Actions skeleton */}
        <Box sx={{ 
          p: { xs: 2, sm: 3 }, 
          pt: { xs: 1.5, sm: 2 },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid #f3f4f6",
          backgroundColor: "#fafafa",
          flexWrap: "wrap",
          gap: { xs: 1, sm: 0 },
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 2, sm: 4 }, flexWrap: "wrap" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Skeleton 
                variant="circular" 
                width={{ xs: 18, sm: 22 }} 
                height={{ xs: 18, sm: 22 }} 
                animation="wave" 
                sx={{ bgcolor: "grey.100" }}
              />
              <Skeleton 
                variant="text" 
                width={20} 
                height={{ xs: 12, sm: 14 }} 
                animation="wave" 
                sx={{ bgcolor: "grey.100" }}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Skeleton 
                variant="circular" 
                width={{ xs: 18, sm: 22 }} 
                height={{ xs: 18, sm: 22 }} 
                animation="wave" 
                sx={{ bgcolor: "grey.100" }}
              />
              <Skeleton 
                variant="text" 
                width={20} 
                height={{ xs: 12, sm: 14 }} 
                animation="wave" 
                sx={{ bgcolor: "grey.100" }}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Skeleton 
                variant="circular" 
                width={{ xs: 18, sm: 22 }} 
                height={{ xs: 18, sm: 22 }} 
                animation="wave" 
                sx={{ bgcolor: "grey.100" }}
              />
              <Skeleton 
                variant="text" 
                width={30} 
                height={{ xs: 12, sm: 14 }} 
                animation="wave" 
                sx={{ bgcolor: "grey.100" }}
              />
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
            <Skeleton 
              variant="circular" 
              width={{ xs: 16, sm: 20 }} 
              height={{ xs: 16, sm: 20 }} 
              animation="wave" 
              sx={{ bgcolor: "grey.100" }}
            />
            <Skeleton 
              variant="circular" 
              width={{ xs: 16, sm: 20 }} 
              height={{ xs: 16, sm: 20 }} 
              animation="wave" 
              sx={{ bgcolor: "grey.100" }}
            />
          </Box>
        </Box>
      </Card>
    </motion.div>
  );

  /**
   * Profile card skeleton with avatar and info
   */
  const ProfileSkeleton = () => (
    <motion.div variants={itemVariants}>
      <Card
        sx={{
          borderRadius: BORDER_RADIUS.large,
          boxShadow: SHADOWS.card,
          p: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Skeleton
            variant="circular"
            width={80}
            height={80}
            animation="wave"
          />
          <Box sx={{ flex: 1 }}>
            <Skeleton
              variant="text"
              sx={{ fontSize: "1.5rem" }}
              width="60%"
              animation="wave"
            />
            <Skeleton variant="text" width="40%" animation="wave" />
          </Box>
        </Box>
        <Stack spacing={1.5}>
          <Skeleton variant="text" width="100%" animation="wave" />
          <Skeleton variant="text" width="90%" animation="wave" />
          <Skeleton variant="text" width="95%" animation="wave" />
        </Stack>
        <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
          <Skeleton
            variant="rounded"
            width={100}
            height={36}
            animation="wave"
          />
          <Skeleton
            variant="rounded"
            width={100}
            height={36}
            animation="wave"
          />
        </Box>
      </Card>
    </motion.div>
  );

  /**
   * Chat message skeleton with alternating alignment
   */
  const ChatSkeleton = () => (
    <motion.div variants={itemVariants}>
      <Stack spacing={2} sx={{ p: 2 }}>
        {[...Array(3)].map((_, idx) => (
          <Box
            key={idx}
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "flex-start",
              flexDirection: idx % 2 === 0 ? "row" : "row-reverse",
            }}
          >
            <Skeleton
              variant="circular"
              width={40}
              height={40}
              animation="wave"
            />
            <Box sx={{ flex: 1, maxWidth: "70%" }}>
              <Skeleton
                variant="rounded"
                height={60}
                animation="wave"
                sx={{ borderRadius: BORDER_RADIUS.medium }}
              />
            </Box>
          </Box>
        ))}
      </Stack>
    </motion.div>
  );

  /**
   * Comment skeleton with avatar and text
   */
  const CommentSkeleton = () => (
    <motion.div variants={itemVariants}>
      <Box sx={{ display: "flex", gap: 2, p: 2 }}>
        <Skeleton variant="circular" width={40} height={40} animation="wave" />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="30%" animation="wave" />
          <Skeleton variant="text" width="100%" animation="wave" />
          <Skeleton variant="text" width="90%" animation="wave" />
        </Box>
      </Box>
    </motion.div>
  );

  /**
   * List item skeleton for user lists
   */
  const ListSkeleton = () => (
    <motion.div variants={itemVariants}>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", p: 2 }}>
        <Skeleton variant="circular" width={48} height={48} animation="wave" />
        <Box sx={{ flex: 1 }}>
          <Skeleton
            variant="text"
            sx={{ fontSize: "1rem" }}
            width="40%"
            animation="wave"
          />
          <Skeleton variant="text" width="60%" animation="wave" />
        </Box>
        <Skeleton variant="rounded" width={60} height={30} animation="wave" />
      </Box>
    </motion.div>
  );

  /**
   * Article card skeleton for articles section
   */
  const ArticleSkeleton = () => (
    <motion.div variants={itemVariants}>
      <Card
        sx={{
          borderRadius: BORDER_RADIUS.large,
          boxShadow: SHADOWS.card,
          overflow: "hidden",
        }}
      >
        <Skeleton
          variant="rectangular"
          height={180}
          animation="wave"
          sx={{ bgcolor: "grey.100" }}
        />
        <CardContent sx={{ p: 2 }}>
          <Skeleton
            variant="text"
            sx={{ fontSize: "1.25rem" }}
            width="85%"
            animation="wave"
          />
          <Skeleton variant="text" width="100%" animation="wave" />
          <Skeleton
            variant="text"
            width="70%"
            animation="wave"
            sx={{ mb: 1 }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Skeleton variant="text" width="30%" animation="wave" />
            <Skeleton variant="text" width="20%" animation="wave" />
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  // Select skeleton component based on variant
  const getSkeletonComponent = () => {
    switch (variant) {
      case "post":
        return <PostSkeleton />;
      case "profile":
        return <ProfileSkeleton />;
      case "chat":
        return <ChatSkeleton />;
      case "comment":
        return <CommentSkeleton />;
      case "list":
        return <ListSkeleton />;
      case "article":
        return <ArticleSkeleton />;
      default:
        return <PostSkeleton />;
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {[...Array(count)].map((_, index) => (
        <Box key={index} sx={{ mb: count > 1 ? 2 : 0 }}>
          {getSkeletonComponent()}
        </Box>
      ))}
    </motion.div>
  );
};

export default EnhancedSkeleton;
