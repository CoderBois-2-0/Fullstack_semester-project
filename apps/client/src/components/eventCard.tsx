import React from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  CardActions,
  Chip,
  Avatar,
  Divider,
} from "@mui/material";
import {
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  EuroSymbol as PriceIcon,
  Chat as ChatIcon,
  ConfirmationNumber as TicketIcon,
} from "@mui/icons-material";

import { type IEvent } from "@/apiClients/eventClient/dto";
import { Link } from "@tanstack/react-router";

interface EventCardProps {
  event: IEvent;
  onClick?: (event: IEvent) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("da-DK", options);
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(event);
    }
  };

  const handleTicketButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    alert("Tickets will be available soon!");
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        overflow: "hidden",
        position: "relative",
        background: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        '&:hover': {
          transform: "translateY(-8px) scale(1.02)",
          boxShadow: (theme) => theme.shadows[16],
          '& .event-image': {
            transform: 'scale(1.1)',
          },
          '& .event-overlay': {
            opacity: 1,
          }
        }
      }}
      onClick={handleCardClick}
    >
      {/* Event Image with Overlay */}
      <Box sx={{ position: 'relative', overflow: 'hidden', height: 200 }}>
        <CardMedia
          component="img"
          height={200}
          image="/default-event-image.png"
          alt={event.name}
          className="event-image"
          sx={{
            transition: 'transform 0.5s ease',
            objectFit: 'cover'
          }}
        />
        
        {/* Gradient Overlay */}
        <Box
          className="event-overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, transparent 50%, rgba(0,0,0,0.3) 100%)',
            opacity: 0,
            transition: 'opacity 0.3s ease'
          }}
        />

        {/* Price Badge */}
        <Chip
          icon={<PriceIcon />}
          label={event.price || "Free"}
          color={event.price ? "primary" : "success"}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            bgcolor: event.price ? 'primary.main' : 'success.main',
            color: 'white',
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}
        />
      </Box>

      {/* Event Content */}
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography
          variant="h6"
          component="h3"
          sx={{ 
            fontWeight: 700, 
            mb: 2,
            lineHeight: 1.3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {event.name}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, mr: 1.5 }}>
              <CalendarIcon sx={{ fontSize: 16 }} />
            </Avatar>
            <Typography variant="body2" color="text.primary" fontWeight={500}>
              {formatDate(event.startDate)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32, mr: 1.5 }}>
              <LocationIcon sx={{ fontSize: 16 }} />
            </Avatar>
            <Typography 
              variant="body2" 
              color="text.primary"
              fontWeight={500}
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {event.location}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <Divider />

      {/* Actions */}
      <CardActions sx={{ p: 2, gap: 1 }}>
        <Button
          variant="contained"
          size="small"
          startIcon={<TicketIcon />}
          onClick={handleTicketButtonClick}
          sx={{
            flex: 1,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            py: 1,
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
        >
          Get Tickets
        </Button>

        <Link
          to="/events/$eventId/forum"
          params={{ eventId: event.id }}
          onClick={(e) => e.stopPropagation()}
          style={{ flex: 1 }}
        >
          <Button 
            variant="outlined" 
            size="small"
            startIcon={<ChatIcon />}
            fullWidth
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              py: 1,
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          >
            Forum
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
};

export default EventCard;