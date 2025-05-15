import React from 'react';
import { Link } from '@tanstack/react-router';
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
    <AppBar position="static" color="default" elevation={0} sx={{ backgroundColor: 'white' }}>
      <Toolbar>
        {/* Logo */}
        <Typography
          variant="h6"
          component="div"
          sx={{ 
            flexGrow: 1, 
            color: '#026CDF', 
            fontWeight: 'bold',
            fontSize: '1.5rem'
          }}
        >
          Queue Up
        </Typography>
        
        {/* Navbar Buttons */}
        {!isMobile ? (
          <Box>
            <Button sx={{ mr: 1 }}>Events</Button>
            <Button sx={{ mr: 1 }}>Venues</Button>
            <Link to='/'>
              <Button variant="contained" color='warning'>My Account</Button>
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