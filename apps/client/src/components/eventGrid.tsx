import React from "react";
import { Box } from "@mui/material";
import CardSkeleton from "./cardSkeleton";

interface EventGridProps<T> {
  data: T[];
  isLoading?: boolean;
  onItemClick?: (item: T) => void;
  renderItem: (item: T, onClick?: (item: T) => void) => React.ReactNode;
}

const EventGrid = <T extends { id: string }>({
  data,
  isLoading = false,
  onItemClick,
  renderItem,
}: EventGridProps<T>) => {
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
