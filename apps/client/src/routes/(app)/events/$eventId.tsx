import { createFileRoute, Link } from "@tanstack/react-router";
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Paper, 
  Grid,
  Avatar,
  Chip
} from "@mui/material";
import {
  Event as EventIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  ConfirmationNumber as TicketIcon,
  Chat as ChatIcon
} from "@mui/icons-material";

import { useEvent } from "@/hooks/eventHook";
import type { IEvent } from "@/apiClients/eventClient/dto";
import CardSkeleton from "@/components/cardSkeleton";
import QueryRenderer from "@/components/queryRenderer";

const EventDetail = (props: { event: IEvent }) => {
  const event = props.event;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <>
      {/* Enhanced Hero */}
      <Box
        sx={{
          height: { xs: '300px', md: '400px' },
          position: 'relative',
          background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url(default-event-image.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Chip
            icon={<EventIcon />}
            label="Gaming Event"
            color="primary"
            sx={{ mb: 2, bgcolor: 'rgba(25, 118, 210, 0.2)', color: 'white' }}
          />
          <Typography
            variant="h2"
            component="h1"
            sx={{ 
              color: 'white', 
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '3rem' },
              textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
              maxWidth: 800
            }}
          >
            {event.name}
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Event Details */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 4, mb: 4 }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Event Details
              </Typography>
              
              {/* Info Grid */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <TimeIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Date & Time</Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {formatDate(event.startDate)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                      <LocationIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Location</Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {event.location}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                About this event
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                Join us for an exciting gaming experience! Connect with fellow gamers, compete in tournaments, 
                and enjoy an unforgettable event filled with gaming, networking, and prizes.
              </Typography>

              <Box sx={{ mt: 3 }}>
                <Link to="/events/$eventId/forum" params={{ eventId: event.id }} style={{ textDecoration: 'none' }}>
                  <Button
                    startIcon={<ChatIcon />}
                    variant="outlined"
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                  >
                    Join Discussion
                  </Button>
                </Link>
              </Box>
            </Paper>
          </Grid>

          {/* Ticket Card */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper 
              sx={{ 
                p: 4, 
                textAlign: 'center',
                position: 'sticky',
                top: 20,
                transition: 'transform 0.2s ease',
                '&:hover': { transform: 'translateY(-2px)' }
              }}
            >
              <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mx: 'auto', mb: 2 }}>
                <TicketIcon />
              </Avatar>
              
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Event Ticket
              </Typography>
              
              <Typography variant="h3" fontWeight="bold" color="primary.main" sx={{ mb: 3 }}>
                {event.price ? `${event.price} DKK` : 'Free'}
              </Typography>

              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<TicketIcon />}
                sx={{ 
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none'
                }}
              >
                {event.price ? 'Get Ticket' : 'Reserve Spot'}
              </Button>
              
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                Secure booking • Instant confirmation
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

const EventPage = () => {
  const { eventId } = Route.useParams();
  const eventQuery = useEvent(eventId);

  return (
    <Box sx={{ minHeight: "100vh" }}>

      {eventQuery.isLoading ? (
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <CardSkeleton />
        </Container>
      ) : (
        <QueryRenderer
          query={eventQuery}
          renderFn={(event) => <EventDetail event={event} />}
        />
      )}
    </Box>
  );
};

export default EventPage;

export const Route = createFileRoute("/(app)/events/$eventId")({
  component: EventPage,
});