import React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid,
  Chip
} from "@mui/material";
import {
  ArrowForward as ArrowForwardIcon,
  Event as EventIcon
} from "@mui/icons-material";
import HeroBanner from "@/components/heroBanner";
import EventCard from "@/components/eventCard";
import { useEvents } from "@/hooks/eventHook";
import { type IEvent } from "@/apiClients/eventClient/dto";
import "../App.css";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const events = useEvents();

  // Handle event card click
  const handleEventClick = (event: IEvent) => {
    navigate({ to: `/events/${event.id}` });
  };

  // Get the 3 most upcoming events
  const upcomingEvents = events.data?.data
    ? events.data.data
        .filter(event => new Date(event.startDate || '') >= new Date())
        .sort((a, b) => new Date(a.startDate || '').getTime() - new Date(b.startDate || '').getTime())
        .slice(0, 3)
    : [];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {/* Hero Banner Component */}
        <HeroBanner />

        {/* Upcoming Events Section */}
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Chip 
              icon={<EventIcon />}
              label="Upcoming Events" 
              color="primary" 
              sx={{ mb: 2, fontSize: '0.875rem', fontWeight: 600 }}
            />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Don't Miss These Events
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Join our community at these exciting upcoming events
            </Typography>
          </Box>

          {events.isLoading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography>Loading events...</Typography>
            </Box>
          ) : upcomingEvents.length > 0 ? (
            <>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {upcomingEvents.map((event) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={event.id}>
                    <EventCard event={event} onClick={handleEventClick} />
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ textAlign: 'center' }}>
                <Link to="/events" style={{ textDecoration: 'none' }}>
                  <Button 
                    variant="contained" 
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      textTransform: 'none',
                      fontWeight: 600,
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        transform: 'scale(1.05)',
                        boxShadow: (theme) => theme.shadows[8]
                      }
                    }}
                  >
                    View All Events
                  </Button>
                </Link>
              </Box>
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No upcoming events at the moment
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Check back soon for exciting new events!
              </Typography>
            </Box>
          )}
        </Container>

        {/* Call to Action Section */}
        <Box sx={{ 
          background: 'linear-gradient(135deg, rgba(0,0,0,0.02) 0%, transparent 100%)',
          py: 6
        }}>
          <Container maxWidth="md">
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Ready to Get Started?
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                Discover amazing events and connect with like-minded people
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/events" style={{ textDecoration: 'none' }}>
                  <Button 
                    variant="contained" 
                    size="large"
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      textTransform: 'none',
                      fontWeight: 600,
                      transition: 'all 0.2s ease',
                      '&:hover': { transform: 'scale(1.05)' }
                    }}
                  >
                    Explore Events
                  </Button>
                </Link>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;

export const Route = createFileRoute("/")({
  component: HomePage,
});