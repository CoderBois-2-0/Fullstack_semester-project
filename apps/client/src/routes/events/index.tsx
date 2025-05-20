import React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Box, Container, Typography } from "@mui/material";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import EventGrid from "@/components/eventgrid";
import EventCard from "@/components/eventcard";
import type { Event } from "@/components/eventcard";

// Sample event data - replace with data from your database
const events: Event[] = [
  {
    id: "1",
    title: "Cosmic Byte LAN Party 2025",
    imageUrl:
      "https://esports-news.co.uk/wp-content/uploads/2025/05/Enclave.png",
    date: "2025-06-15",
    time: "10:00 AM",
    venue: "TechHub Arena",
    location: "Copenhagen, Denmark",
    category: "Gaming",
    price: "DKK 299",
    isFeatured: true,
  },
  {
    id: "2",
    title: "Valorant Copenhagen Masters",
    imageUrl:
      "https://esports-news.co.uk/wp-content/uploads/2025/05/Enclave.png",
    date: "2025-07-22",
    time: "12:00 PM",
    venue: "Royal Arena",
    location: "Copenhagen, Denmark",
    category: "Esports",
    price: "DKK 499",
  },
  {
    id: "3",
    title: "CS2 Nordic Championship",
    imageUrl:
      "https://esports-news.co.uk/wp-content/uploads/2025/05/Enclave.png",
    date: "2025-08-05",
    venue: "Bella Center",
    location: "Copenhagen, Denmark",
    category: "Esports",
    price: "DKK 399",
  },
  {
    id: "4",
    title: "GameDev Connect Networking",
    imageUrl:
      "https://esports-news.co.uk/wp-content/uploads/2025/05/Enclave.png",
    date: "2025-06-30",
    venue: "ITU Copenhagen",
    location: "Copenhagen, Denmark",
    category: "Networking",
    price: "Free",
  },
  {
    id: "5",
    title: "Mobile Gaming Summit",
    imageUrl:
      "https://esports-news.co.uk/wp-content/uploads/2025/05/Enclave.png",
    date: "2025-06-30",
    venue: "DTU Copenhagen",
    location: "Copenhagen, Denmark",
    category: "Conference",
    price: "DKK 199",
  },
  {
    id: "6",
    title: "Indie Game Showcase",
    imageUrl:
      "https://esports-news.co.uk/wp-content/uploads/2025/05/Enclave.png",
    date: "2025-06-30",
    venue: "Øksnehallen",
    location: "Copenhagen, Denmark",
    category: "Exhibition",
    price: "DKK 99",
  },
];

const Events: React.FC = () => {
  const navigate = useNavigate();

  // Handle event card click
  const handleEventClick = (event: Event) => {
    console.log("Event clicked:", event.id);
    navigate({ to: `/events/${event.id}` });
  };

  // Custom render function for event cards
  const renderEventCard = (event: Event, onClick?: (event: Event) => void) => {
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
          <EventGrid
            data={events}
            renderItem={renderEventCard}
            onItemClick={handleEventClick}
          />
        </Container>
      </Box>

      {/* Footer Component */}
      <Footer />
    </Box>
  );
};

export default Events;

export const Route = createFileRoute("/events/")({
  component: Events,
});
