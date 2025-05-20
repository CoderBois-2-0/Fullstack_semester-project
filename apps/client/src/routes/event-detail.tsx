import React, { useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import type { Event } from '../components/eventcard';

// Service function to fetch event data by ID
const getEventById = async (id: string): Promise<Event | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Demo data - would be replaced with actual API call
  if (id === '1') {
    return {
      id: '1',
      title: 'Cosmic Byte LAN Party 2025',
      imageUrl: 'https://esports-news.co.uk/wp-content/uploads/2025/05/Enclave.png',
      date: '2025-06-15',
      time: '10:00 AM',
      venue: 'TechHub Arena',
      location: 'Copenhagen, Denmark',
      category: 'Gaming',
      price: 'DKK 299',
      description: 'Join the biggest LAN party in Copenhagen! Bring your gaming rig and compete in various tournaments with prizes worth over 50,000 DKK.'
    };
  } else if (id === '2') {
    return {
      id: '2',
      title: 'Valorant Copenhagen Masters',
      imageUrl: 'https://esports-news.co.uk/wp-content/uploads/2025/05/Enclave.png',
      date: '2025-07-22',
      venue: 'Royal Arena',
      location: 'Copenhagen, Denmark',
      category: 'Esports',
      price: 'DKK 499',
      description: 'Experience the thrill of professional Valorant as top teams compete for the championship.'
    };
  }
  
  return null;
};

// Main component that displays event details
const EventDetail = () => {
  // Extract event ID from URL
  const eventId = window.location.pathname.split('/').pop();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        if (eventId) {
          const eventData = await getEventById(eventId);
          setEvent(eventData);
        } else {
          setEvent(null);
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvent();
  }, [eventId]);

  // Navigation back to events page
  const handleBackClick = () => {
    window.location.href = '/events';
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <Container sx={{ flexGrow: 1, my: 4 }}>
          <Typography>Loading event details...</Typography>
        </Container>
        <Footer />
      </Box>
    );
  }

  // Event not found state
  if (!event) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <Container sx={{ flexGrow: 1, my: 4 }}>
          <Typography variant="h5">Event not found</Typography>
          <Button startIcon={<ArrowBackIcon />} variant="outlined" onClick={handleBackClick} sx={{ mt: 2 }}>
            Back to Events
          </Button>
        </Container>
        <Footer />
      </Box>
    );
  }

  // Simplified event detail view
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      
      {/* Hero Banner */}
      <Box sx={{ 
        height: '300px',
        position: 'relative',
        background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${event.imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Typography variant="h3" component="h1" sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
          {event.title}
        </Typography>
      </Box>
      
      {/* Main Content */}
      <Container maxWidth="md" sx={{ my: 5 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          variant="outlined" 
          onClick={handleBackClick}
          sx={{ mb: 4 }}
        >
          Back to Events
        </Button>

        {/* Description */}
        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3 }}>About this event</Typography>
          <Typography variant="body1" paragraph>
            {event.description || 'No description available.'}
          </Typography>
        </Paper>
          
        {/* Price and Buy Ticket */}
        <Paper sx={{ p: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' } }}>
          <Box sx={{ mb: { xs: 2, sm: 0 } }}>
            <Typography variant="subtitle1" color="text.secondary">Price</Typography>
            <Typography variant="h5" fontWeight="bold">
              {event.price || 'Free'}
            </Typography>
          </Box>
          
          <Button 
            variant="contained" 
            color="primary"
            size="large"
            sx={{ px: 4 }}
          >
            Buy Ticket
          </Button>
        </Paper>
      </Container>
      
      <Footer />
    </Box>
  );
};

export default EventDetail;

// Route definition for TanStack Router
export const Route = createFileRoute('/events/:eventId')({
  component: EventDetail
});