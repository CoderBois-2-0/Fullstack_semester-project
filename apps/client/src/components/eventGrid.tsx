import React from 'react';
import { 
  Box,
  Skeleton
} from '@mui/material';

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
  renderItem
}: EventGridProps<T>) => {

  // Render loading skeletons when data is being fetched
  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { 
          xs: '1fr',             // 1 column on mobile
          sm: 'repeat(2, 1fr)',  // 2 columns on tablet
          md: 'repeat(3, 1fr)'   // 3 columns on desktop
        },
        gap: 3
      }}>
        {[...Array(6)].map((_, index) => (
          <Box key={index}>
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
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: { 
        xs: '1fr',             // 1 column on mobile
        sm: 'repeat(2, 1fr)',  // 2 columns on tablet
        md: 'repeat(3, 1fr)'   // 3 columns on desktop
      },
      gap: 3
    }}>
      {data.map(item => (
        <Box key={item.id}>
          {renderItem(item, onItemClick)}
        </Box>
      ))}
    </Box>
  );
};

export default EventGrid;