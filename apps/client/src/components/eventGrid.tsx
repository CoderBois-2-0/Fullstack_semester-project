import React from "react";
import { Box } from "@mui/material";

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
        ? [...Array(6)].map((_, index) => (
            <Box
              key={index}
              sx={{
                width: "100%",
                height: "300px",
                bgcolor: "#f0f0f0",
                borderRadius: 2,
              }}
            />
          ))
        : data.map((item) => (
            <Box key={item.id}>{renderItem(item, onItemClick)}</Box>
          ))}
    </Box>
  );
};

export default EventGrid;
