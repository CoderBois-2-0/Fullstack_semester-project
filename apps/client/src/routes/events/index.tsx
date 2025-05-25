import React from "react";

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Box, Container, Typography, Button } from "@mui/material";
import EventGrid from "@/components/eventGrid";
import EventCard from "@/components/eventCard";
import { type IEvent } from "@/apiClients/eventClient/dto";
import { useEvents } from "@/hooks/eventHook";

const events: React.FC = () => {
  const navigate = useNavigate();
  const events = useEvents();

  // Handle event card click
  const handleEventClick = (event: IEvent) => {
    console.log("Event clicked:", event.id);
    navigate({ to: `/events/${event.id}` });
  };

  // Custom render function for event cards
  const renderEventCard = (
    event: IEvent,
    onClick?: (event: IEvent) => void
  ) => {
    return <EventCard event={event} onClick={onClick} />;
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Page Title */}
        <Container
          maxWidth="lg"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 4,
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1" fontWeight="bold">
            Upcoming Events
          </Typography>

          <Box alignSelf="center">
            <Link to="/events/create">
              <Button variant="outlined">Create new Event</Button>
            </Link>
          </Box>
        </Container>

        {/* EventGrid Component */}
        <Container maxWidth="lg" sx={{ mb: 6 }}>
          <EventGrid
            data={events.data || []}
            isLoading={events.isLoading}
            renderItem={renderEventCard}
            onItemClick={handleEventClick}
          />

          {/* Show error message if there's an error */}
          {events.isError && (
            <Box sx={{ textAlign: "center", mt: 3 }}>
              <p>Error: {events.error.message}</p>
            </Box>
          )}

          {/* Show "no events" message only when not loading and no data */}
          {!events.isLoading && events.data && events.data.length === 0 && (
            <Box sx={{ textAlign: "center", mt: 3 }}>
              <p>No events available</p>
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default events;

export const Route = createFileRoute("/events/")({
  component: events,
});
