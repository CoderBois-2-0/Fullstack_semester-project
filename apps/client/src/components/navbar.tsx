import React from 'react';
import { Link } from '@tanstack/react-router';
import '@fontsource/press-start-2p/index.css';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppBar position="sticky" color="default" elevation={0} sx={{ backgroundColor: 'white', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)' }}>
      <Toolbar>
        
        {/* Logo */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1, 
            color: '#026CDF', 
            fontWeight: 'bold',
            fontSize: '1.5rem',
            textDecoration: 'none',
            cursor: 'pointer',
            fontFamily: '"Press Start 2P", monospace', // Gaming font
            letterSpacing: '1px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            '&:hover': {
              color: '#0350A0',
              textShadow: '2px 2px 6px rgba(0,0,0,0.5)'
            },
          }}
        >
        Queue Up
        </Typography>
        
        {/* Navbar Buttons */}
        {!isMobile ? (
          <Box>
            <Link to='/events'>
            <Button sx={{ mr: 1 }}>Events</Button>
            </Link>
            <Button sx={{ mr: 1 }}>Venues</Button>
            <Link to='/login'>
              <Button variant="contained" color='info'>Log In</Button>
            </Link>
          </Box>
        ) : (
          <IconButton size="large" edge="end" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;