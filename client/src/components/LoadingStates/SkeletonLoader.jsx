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
      maxWidth: 420,
      borderRadius: BORDER_RADIUS.large,
      boxShadow: 1,
    }}
  >
    <Skeleton variant="rectangular" height={240} animation="wave" />
    <CardContent sx={{ p: SPACING.lg }}>
      <Skeleton variant="text" height={32} width="80%" animation="wave" />
      <Skeleton
        variant="text"
        height={20}
        width="100%"
        animation="wave"
        sx={{ mt: 1 }}
      />
      <Skeleton variant="text" height={20} width="90%" animation="wave" />
      <Skeleton variant="text" height={20} width="70%" animation="wave" />
      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <Skeleton variant="circular" width={40} height={40} animation="wave" />
        <Skeleton variant="circular" width={40} height={40} animation="wave" />
        <Box sx={{ flex: 1 }} />
        <Skeleton
          variant="rectangular"
          width={80}
          height={36}
          animation="wave"
          sx={{ borderRadius: 1 }}
        />
      </Box>
    </CardContent>
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
