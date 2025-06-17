import React, { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Box, Container, Typography } from "@mui/material";
import EventGrid from "@/components/eventGrid";
import EventCard from "@/components/eventCard";
import PaginationControls from "@/components/paginationControls";
import { type IEvent } from "@/apiClients/eventClient/dto";
import { useEvents } from "@/hooks/eventHook";

const EventsPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  
  // Fetch events with pagination
  const eventsQuery = useEvents(currentPage, itemsPerPage);

  // Handle event card click
  const handleEventClick = (event: IEvent) => {
    navigate({ to: `/events/${event.id}` });
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
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
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {/* Page Title */}
        <Container maxWidth="lg" sx={{ mt: 4, mb: 3 }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Upcoming Events
          </Typography>
          {eventsQuery.data && (
            <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
              Discover amazing events happening around you
            </Typography>
          )}
        </Container>

        {/* EventGrid Component */}
        <Container maxWidth="lg" sx={{ mb: 6 }}>
          <EventGrid
            data={eventsQuery.data?.data || []}
            isLoading={eventsQuery.isLoading}
            renderItem={renderEventCard}
            onItemClick={handleEventClick}
          />

          {/* Pagination Controls */}
          {eventsQuery.data && eventsQuery.data.data.length > 0 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={eventsQuery.data.totalPages}
              totalCount={eventsQuery.data.totalCount}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              isLoading={eventsQuery.isLoading}
            />
          )}

          {/* Show error message if there's an error */}
          {eventsQuery.isError && (
            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Typography variant="h6" color="error" gutterBottom>
                Error loading events
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {eventsQuery.error?.message || "Something went wrong"}
              </Typography>
            </Box>
          )}

          {/* Show "no events" message only when not loading and no data */}
          {!eventsQuery.isLoading && eventsQuery.data && eventsQuery.data.data.length === 0 && (
            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No events found
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Check back later for new events!
              </Typography>
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default EventsPage;

export const Route = createFileRoute("/(app)/events/")({
  component: EventsPage,
});