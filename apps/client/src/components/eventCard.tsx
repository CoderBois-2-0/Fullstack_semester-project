import React from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Button,
  CardActions,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import { type IEvent } from "@/apiClients/eventClient";

interface EventCardProps {
  event: IEvent;
  onClick?: (event: IEvent) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  // Format date from database
  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "short",
      day: "numeric",
    };

    return date.toLocaleDateString("en-US", options);
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(event);
    }
  };

  const handleTicketButtonClick = (e: React.MouseEvent) => {
    // Prevent the event from bubbling up to the card
    e.stopPropagation();

    alert("Tickets will be available soon!");
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.5)",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.6)",
          cursor: "pointer", // Add cursor pointer to indicate clickable
        },
        transition: "transform 0.2s, box-shadow 0.2s",
        borderRadius: 2,
        position: "relative",
      }}
      onClick={handleCardClick}
    >
      {/* Event image */}
      <CardMedia
        component="img"
        height={180}
        image="/default-event-image"
        alt={event.name}
      />

      {/* Event details */}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          variant="h6"
          component="h3"
          sx={{ fontWeight: "bold", mb: 1 }}
        >
          {event.name}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <CalendarTodayIcon
            fontSize="small"
            sx={{ mr: 1, color: "text.secondary" }}
          />
          <Typography variant="body2" color="text.secondary">
            {formatDate(event.startDate)}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <LocationOnIcon
            fontSize="small"
            sx={{ mr: 1, color: "text.secondary" }}
          />
          <Typography variant="body2" color="text.secondary">
            {event.location}
          </Typography>
        </Box>
      </CardContent>

      {/* Price and action button */}
      <CardActions sx={{ justifyContent: "space-between", px: 2 }}>
        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={handleTicketButtonClick}
        >
          Get Tickets
        </Button>
      </CardActions>
    </Card>
  );
};

export default EventCard;
