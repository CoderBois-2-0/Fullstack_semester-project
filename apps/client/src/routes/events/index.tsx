import React from "react";

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Box, Container, Typography } from "@mui/material";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import EventGrid from "@/components/eventgrid";
import EventCard from "@/components/eventcard";
import { type IEvent } from "@/apiClients/eventClient";
import useEvents from "@/hooks/eventHook";

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
    onClick?: (event: IEvent) => void,
  ) => {
    return <EventCard event={event} onClick={onClick} />;
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Navbar Component */}
      <Navbar />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {/* Page Title */}
        <Container maxWidth="lg" sx={{ mt: 4, mb: 3 }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Upcoming Events
          </Typography>
        </Container>

        {/* EventGrid Component */}
        <Container maxWidth="lg" sx={{ mb: 6 }}>
          {events.data ? (
            <EventGrid
              data={events.data}
              renderItem={renderEventCard}
              onItemClick={handleEventClick}
            />
          ) : (
            <p>No events</p>
          )}
        </Container>
      </Box>

      {/* Footer Component */}
      <Footer />
    </Box>
  );
};

export default events;

export const Route = createFileRoute("/events/")({
  component: events,
});
