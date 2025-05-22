import { createFileRoute, Link, type ReactNode } from "@tanstack/react-router";
import { type UseQueryResult } from "@tanstack/react-query";
import { Box, Container, Typography, Button, Paper } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useEvent } from "@/hooks/eventHook";
import type { IEvent } from "@/apiClients/eventClient";
import CardSkeleton from "@/components/cardSkeleton";

function QueryRenderer<T>(props: {
  query: UseQueryResult<T, Error>;
  renderFn: (data: T) => ReactNode;
}) {
  if (props.query.data) {
    return props.renderFn(props.query.data);
  } else {
    console.log(props.query.error?.message);
    return <p>No Event</p>;
  }
}

const EventDetail = (props: { event: IEvent }) => {
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
const EventPage = () => {
  // Extract event ID from URL
  const { eventId } = Route.useParams();
  const eventQuery = useEvent(eventId);

  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      pt={2}
      px={35}
      gap={2}
    >
      {eventQuery.isLoading ? (
        <CardSkeleton />
      ) : (
        <QueryRenderer
          query={eventQuery}
          renderFn={(event) => <EventDetail event={event} />}
        />
      )}

      {!eventQuery.isLoading && (
        <Link to="/events">
          <Button
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            sx={{ mb: 4 }}
          >
            Back to Events
          </Button>
        </Link>
      )}
    </Box>
  );
};

export default EventPage;

// Route definition for TanStack Router
export const Route = createFileRoute("/events/$eventId")({
  component: EventPage,
});
