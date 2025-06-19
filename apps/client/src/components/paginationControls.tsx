import React from 'react';
import {
  Box,
  Pagination,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  isLoading?: boolean;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  totalCount,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  isLoading = false,
}) => {
  const startItem = ((currentPage - 1) * itemsPerPage) + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2,
        py: 3,
      }}
    >
      {/* Results Info */}
      <Typography variant="body2" color="text.secondary">
        Showing {startItem}-{endItem} of {totalCount} events
      </Typography>

      {/* Pagination Controls */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Items per page selector */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Per page</InputLabel>
          <Select
            value={itemsPerPage}
            label="Per page"
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            disabled={isLoading}
          >
            <MenuItem value={6}>6 per page</MenuItem>
            <MenuItem value={12}>12 per page</MenuItem>
            <MenuItem value={24}>24 per page</MenuItem>
            <MenuItem value={48}>48 per page</MenuItem>
          </Select>
        </FormControl>

        {/* Pagination */}
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(_, page) => onPageChange(page)}
          disabled={isLoading}
          color="primary"
          showFirstButton
          showLastButton
          sx={{
            '& .MuiPaginationItem-root': {
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default PaginationControls;