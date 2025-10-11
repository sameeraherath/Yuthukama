import { Skeleton, Card, CardContent, Box, Stack } from "@mui/material";
import { BORDER_RADIUS, SPACING } from "../../utils/styleConstants";

/**
 * Skeleton loader for post cards
 * @component
 * @example
 * <PostCardSkeleton />
 */
export const PostCardSkeleton = () => (
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
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Skeleton 
              variant="text" 
              height={{ xs: 18, sm: 20 }} 
              width="60%" 
              animation="wave" 
            />
            <Skeleton 
              variant="text" 
              height={{ xs: 12, sm: 14 }} 
              width="40%" 
              animation="wave" 
              sx={{ mt: 0.5 }}
            />
          </Box>
        </Box>
        <Skeleton variant="circular" width={32} height={32} animation="wave" />
      </Box>
    </Box>

    {/* Content skeleton */}
    <CardContent sx={{ p: { xs: 2, sm: 3 }, pt: 0, pb: { xs: 1.5, sm: 2 } }}>
      <Skeleton 
        variant="text" 
        height={{ xs: 16, sm: 18 }} 
        width="100%" 
        animation="wave" 
        sx={{ mb: { xs: 1.5, sm: 2 } }}
      />
      <Skeleton variant="text" height={{ xs: 16, sm: 18 }} width="95%" animation="wave" />
      <Skeleton variant="text" height={{ xs: 16, sm: 18 }} width="80%" animation="wave" />
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
          <Skeleton variant="circular" width={{ xs: 18, sm: 22 }} height={{ xs: 18, sm: 22 }} animation="wave" />
          <Skeleton variant="text" width={20} height={{ xs: 12, sm: 14 }} animation="wave" />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Skeleton variant="circular" width={{ xs: 18, sm: 22 }} height={{ xs: 18, sm: 22 }} animation="wave" />
          <Skeleton variant="text" width={20} height={{ xs: 12, sm: 14 }} animation="wave" />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Skeleton variant="circular" width={{ xs: 18, sm: 22 }} height={{ xs: 18, sm: 22 }} animation="wave" />
          <Skeleton variant="text" width={30} height={{ xs: 12, sm: 14 }} animation="wave" />
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
        <Skeleton variant="circular" width={{ xs: 16, sm: 20 }} height={{ xs: 16, sm: 20 }} animation="wave" />
        <Skeleton variant="circular" width={{ xs: 16, sm: 20 }} height={{ xs: 16, sm: 20 }} animation="wave" />
      </Box>
    </Box>
  </Card>
);

/**
 * Skeleton loader for profile page
 * @component
 * @example
 * <ProfileSkeleton />
 */
export const ProfileSkeleton = () => (
  <Box sx={{ py: 4 }}>
    <Card
      sx={{
        p: 4,
        mb: 4,
        borderRadius: BORDER_RADIUS.large,
        textAlign: "center",
      }}
    >
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Skeleton
          variant="circular"
          width={154}
          height={154}
          animation="wave"
          sx={{ mb: 2 }}
        />
        <Skeleton variant="text" width={200} height={40} animation="wave" />
        <Skeleton
          variant="text"
          width={250}
          height={24}
          animation="wave"
          sx={{ mt: 2 }}
        />
      </Box>
    </Card>
    <Card sx={{ p: 3, borderRadius: BORDER_RADIUS.large }}>
      <Skeleton
        variant="text"
        width={150}
        height={32}
        animation="wave"
        sx={{ mb: 3 }}
      />
      <Stack spacing={3}>
        <PostCardSkeleton />
        <PostCardSkeleton />
      </Stack>
    </Card>
  </Box>
);

/**
 * Skeleton loader for comments
 * @component
 * @param {number} count - Number of comment skeletons to show
 * @example
 * <CommentsSkeleton count={3} />
 */
export const CommentsSkeleton = ({ count = 3 }) => (
  <Stack spacing={2}>
    {Array.from({ length: count }).map((_, index) => (
      <Box key={index} sx={{ display: "flex", gap: 2 }}>
        <Skeleton variant="circular" width={40} height={40} animation="wave" />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="30%" height={20} animation="wave" />
          <Skeleton
            variant="text"
            width="100%"
            height={16}
            animation="wave"
            sx={{ mt: 0.5 }}
          />
          <Skeleton variant="text" width="80%" height={16} animation="wave" />
        </Box>
      </Box>
    ))}
  </Stack>
);

/**
 * Skeleton loader for list items
 * @component
 * @param {number} count - Number of list item skeletons to show
 * @example
 * <ListSkeleton count={5} />
 */
export const ListSkeleton = ({ count = 5 }) => (
  <Stack spacing={2}>
    {Array.from({ length: count }).map((_, index) => (
      <Box key={index} sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <Skeleton variant="circular" width={48} height={48} animation="wave" />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="60%" height={20} animation="wave" />
          <Skeleton variant="text" width="40%" height={16} animation="wave" />
        </Box>
      </Box>
    ))}
  </Stack>
);

/**
 * Generic content skeleton
 * @component
 * @param {number} lines - Number of text lines
 * @example
 * <ContentSkeleton lines={5} />
 */
export const ContentSkeleton = ({ lines = 5 }) => (
  <Stack spacing={1}>
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton
        key={index}
        variant="text"
        height={20}
        width={index === lines - 1 ? "70%" : "100%"}
        animation="wave"
      />
    ))}
  </Stack>
);
