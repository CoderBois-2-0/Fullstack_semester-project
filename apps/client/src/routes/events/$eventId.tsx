import React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Box, Container, Typography, Button, Paper } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useEvent } from "@/hooks/eventHook";
import type { IEvent } from "@/apiClients/eventClient";

const EventPage = (props: { event: IEvent }) => {
  const event = props.event;
  return (
    <>
      <Box
        sx={{
          height: "300px",
          position: "relative",
          background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(default-event-image.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}
        >
          {event.name}
        </Typography>
      </Box>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ my: 5 }}>
        {/* Description */}
        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            About this event
          </Typography>
        </Paper>

        {/* Price and Buy Ticket */}
        <Paper
          sx={{
            p: 4,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
          }}
        >
          <Box sx={{ mb: { xs: 2, sm: 0 } }}>
            <Typography variant="subtitle1" color="text.secondary">
              Price
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              {event.price || "Free"}
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
    </>
  );
};

// Main component that displays event details
const EventDetail = () => {
  // Extract event ID from URL
  const { eventId } = Route.useParams();
  const eventQuery = useEvent(eventId);

  const event = eventQuery.data;
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {eventQuery.isLoading && <p>Is loading</p>}

      {!eventQuery.isLoading && eventQuery.data ? (
        <EventPage event={eventQuery.data}></EventPage>
      ) : (
        <p>No event found</p>
      )}

      <Link to="/events">
        <Button startIcon={<ArrowBackIcon />} variant="outlined" sx={{ mb: 4 }}>
          Back to Events
        </Button>
      </Link>
    </Box>
  );
};

export default EventDetail;

// Route definition for TanStack Router
export const Route = createFileRoute("/events/$eventId")({
  component: EventDetail,
});
