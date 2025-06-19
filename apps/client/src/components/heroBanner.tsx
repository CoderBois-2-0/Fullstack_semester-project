import React from 'react';
import { Link } from '@tanstack/react-router';
import { Box, Typography, Button, useTheme, useMediaQuery, Container } from '@mui/material';
import { PlayArrow as PlayIcon, Event as EventIcon } from '@mui/icons-material';

interface HeroBannerProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ 
  title = "Discover Gaming Events", 
  subtitle = "Connect with fellow gamers at LAN parties, tournaments, and gaming meetups",
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
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.3) 100%)',
          zIndex: 2
        }
      }}
    >
      {/* Background Image */}
      <Box
        component="img"
        src={imageUrl}
        alt="Gaming Event"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: 'scale(1.05)',
          transition: 'transform 15s ease-in-out',
        }}
      />

      {/* Content Container */}
      <Container 
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: { xs: 'center', md: 'flex-start' },
          textAlign: { xs: 'center', md: 'left' },
          py: 4
        }}
      >
        {/* Main Title */}
        <Typography 
          variant="h2"
          component="h1" 
          sx={{
            color: 'white',
            fontWeight: 700,
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
            lineHeight: 1.2,
            mb: 2,
            textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
            maxWidth: 600
          }}
        >
          {title}
        </Typography>

        {/* Subtitle */}
        <Typography 
          variant="h6"
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: 400,
            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
            lineHeight: 1.4,
            mb: 4,
            maxWidth: 500,
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
          }}
        >
          {subtitle}
        </Typography>

        {/* Action Buttons */}
        <Box 
          sx={{ 
            display: 'flex', 
            gap: 2, 
            flexDirection: { xs: 'column', sm: 'row' },
            width: { xs: '100%', sm: 'auto' }
          }}
        >
          <Link to="/events" style={{ textDecoration: 'none' }}>
            <Button 
              variant="contained"
              size="large"
              startIcon={<EventIcon />}
              sx={{ 
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                boxShadow: '0 4px 16px rgba(25, 118, 210, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                  background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)'
                }
              }}
            >
              Explore Events
            </Button>
          </Link>

          <Button 
            variant="outlined"
            size="large"
            startIcon={<PlayIcon />}
            sx={{ 
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2,
              color: 'white',
              borderColor: 'rgba(255, 255, 255, 0.7)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 16px rgba(255, 255, 255, 0.2)'
              }
            }}
          >
            Learn More
          </Button>
        </Box>

        {/* Statistics Bar */}
        <Box 
          sx={{ 
            display: 'flex',
            gap: 4,
            mt: 6,
            flexWrap: 'wrap',
            justifyContent: { xs: 'center', md: 'flex-start' }
          }}
        >
          {[
            { value: '150+', label: 'Events' },
            { value: '2.5K+', label: 'Gamers' },
            { value: '25+', label: 'Cities' }
          ].map((stat, index) => (
            <Box 
              key={index}
              sx={{ 
                textAlign: 'center',
                padding: 1.5,
                borderRadius: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                minWidth: 80
              }}
            >
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', lineHeight: 1 }}>
                {stat.value}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1 }}>
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

export default HeroBanner;