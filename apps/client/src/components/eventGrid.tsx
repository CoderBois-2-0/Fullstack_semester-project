import React from "react";
import { Box } from "@mui/material";
import CardSkeleton from "./cardSkeleton";

// The component only accepts what it needs to render the grid
interface EventGridProps<T> {
  data: T[];
  isLoading?: boolean;
  onItemClick?: (item: T) => void;
  renderItem: (item: T, onClick?: (item: T) => void) => React.ReactNode;
}

// Generic event grid component that can be used with any data type
const EventGrid = <T extends { id: string }>({
  data,
  isLoading = false,
  onItemClick,
  renderItem,
}: EventGridProps<T>) => {
  // Render loading skeletons when data is being fetched
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr", // 1 column on mobile
          sm: "repeat(2, 1fr)", // 2 columns on tables
          md: "repeat(3, 1fr)", // 3 columns on desktop
        },
        gap: 3,
      }}
    >
      {isLoading
        ? [...Array(6)].map((_, index) => <CardSkeleton key={index} />)
        : data.map((item) => (
            <Box key={item.id}>{renderItem(item, onItemClick)}</Box>
          ))}
    </Box>
  );
};

export default EventGrid;
