import React from 'react';
import { Link } from '@tanstack/react-router';
import { Box, Typography, Button, useTheme, useMediaQuery } from '@mui/material';

interface HeroBannerProps {
  title?: string;
  imageUrl?: string;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ 
  title = "Find Your Next Lan-Party!", 
  imageUrl = "https://esports-news.co.uk/wp-content/uploads/2025/05/Enclave.png" 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box 
      sx={{ 
        position: 'relative',
        width: '100%',
        height: { xs: '300px', sm: '400px', md: '500px' },
        mb: 4,
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.1)'
      }}
    >
      <Box
        component="img"
        src={imageUrl}
        alt="Featured Event"
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: { xs: 3, md: 5 },
          background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))',
          display: 'flex',
          flexDirection: 'column',
          alignItems: { xs: 'center', md: 'flex-start' }
        }}
      >
        <Typography 
          variant="h3" 
          component="h1" 
          color="white" 
          fontWeight="bold" 
          align={isMobile ? 'center' : 'left'}
          sx={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}
        >
          {title}
        </Typography>
        
        <Box sx={{ 
          mt: 3, 
          display: 'flex', 
          gap: 2, 
          flexWrap: 'wrap', 
          justifyContent: { xs: 'center', md: 'flex-start' } 
        }}>
          <Link to="/events">
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            sx={{ 
              px: 4, 
              py: 1.2,
              fontSize: '1.1rem',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
            }}
          >
            Find Events
          </Button>
          </Link>
          <Button 
            variant="outlined" 
            size="large"
            sx={{ 
              color: 'white', 
              borderColor: 'white',
              px: 4,
              py: 1.2,
              fontSize: '1.1rem',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              },
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
            }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default HeroBanner;