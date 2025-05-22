import { Box, Skeleton } from "@mui/material";

/**
 * WIll display skeleton cards for loading
 * @returns Six card skeletons
 */
const CardSkeleton = () => {
  return (
    <>
      <Box>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={300}
          sx={{ borderRadius: 2 }}
        />
        <Box sx={{ pt: 1 }}>
          <Skeleton width="80%" height={24} />
          <Skeleton width="60%" height={20} />
          <Skeleton width="40%" height={20} />
        </Box>
      </Box>
    </>
  );
};

export default CardSkeleton;
