import React from 'react';
import { 
  Box, 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Chip, 
  Button,
  CardActions
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// Define Event interface within the component
export interface Event {
  id: string;
  title: string;
  imageUrl: string;
  date: string;
  time?: string;
  venue: string;
  location: string;
  category: string;
  price?: string;
  isFeatured?: boolean;
  description?: string;
  organizer?: string;
  website?: string;
}

interface EventCardProps {
  event: Event;
  onClick?: (event: Event) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  // Format date from database
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(event);
    }
  };

  const handleTicketButtonClick = (e: React.MouseEvent) => {
    // Prevent the event from bubbling up to the card
    e.stopPropagation();
    
    // Handle ticket purchase logic here
    console.log('Buy tickets for:', event.title);
    
    // Open ticketing site in new tab (replace with actual URL)
    if (event.website) {
      window.open(event.website, '_blank');
    } else {
      // Fallback if no website is provided
      alert('Tickets will be available soon!');
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.6)',
          cursor: 'pointer'  // Add cursor pointer to indicate clickable
        },
        transition: 'transform 0.2s, box-shadow 0.2s',
        borderRadius: 2,
        position: 'relative'
      }}
      onClick={handleCardClick}
    >
      {/* Event image */}
      <CardMedia
        component="img"
        height={180}
        image={event.imageUrl}
        alt={event.title}
      />
      
      {/* Featured badge if applicable */}
      {event.isFeatured && (
        <Chip
          label="Featured"
          color="secondary"
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
          }}
        />
      )}
      
      {/* Event details */}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography 
          variant="h6" 
          component="h3" 
          sx={{ fontWeight: 'bold', mb: 1 }}
        >
          {event.title}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {formatDate(event.date)} {event.time && `• ${event.time}`}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {event.venue}, {event.location}
          </Typography>
        </Box>
      </CardContent>
      
      {/* Price and action button */}
      <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
        <Chip 
          label={event.category} 
          size="small" 
          color="primary" 
        />
        
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