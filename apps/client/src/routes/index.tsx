import { createFileRoute, Link } from '@tanstack/react-router'
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
import '../App.css'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navbar */}
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

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Hero Banner - Full Screen Width */}
        <Box 
          sx={{ 
            position: 'relative',
            width: '100%',
            height: { xs: '300px', sm: '400px', md: '500px' },
            mb: 4,
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Box
            component="img"
            src="https://esports-news.co.uk/wp-content/uploads/2025/05/Enclave.png"
            alt="Featured Event"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              p: { xs: 3, md: 5 },
              background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))',
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'center', md: 'flex-start' }
            }}
          >
            <Typography 
              variant="h3" 
              component="h1" 
              color="white" 
              fontWeight="bold" 
              align={isMobile ? 'center' : 'left'}
              sx={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}
            >
              Find Your Next Lan-Party!
            </Typography>
            
            <Box sx={{ 
              mt: 3, 
              display: 'flex', 
              gap: 2, 
              flexWrap: 'wrap', 
              justifyContent: { xs: 'center', md: 'flex-start' } 
            }}>
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                sx={{ 
                  px: 4, 
                  py: 1.2,
                  fontSize: '1.1rem',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                }}
              >
                Find Events
              </Button>
              <Button 
                variant="outlined" 
                size="large"
                sx={{ 
                  color: 'white', 
                  borderColor: 'white',
                  px: 4,
                  py: 1.2,
                  fontSize: '1.1rem',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  },
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
                }}
              >
                Sign In
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Additional content can go here */}
        <Box sx={{ px: { xs: 2, sm: 4, md: 6 }, pb: 6 }}>
          {/* Your main content sections here */}
        </Box>
      </Box>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          py: 3, 
          px: 2, 
          mt: 'auto',
          backgroundColor: '#0F1524',
          color: 'white',
          boxShadow: '0 -4px 10px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Box sx={{ 
          maxWidth: 1200,
          mx: 'auto',
          px: { xs: 2, md: 4 },
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'center', md: 'flex-start' },
          textAlign: { xs: 'center', md: 'left' }
        }}>
          <Box sx={{ mb: { xs: 2, md: 0 } }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              TicketPlace
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              © {new Date().getFullYear()} All rights reserved.
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: { xs: 4, md: 6 } }}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                Company
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>About</Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>Contact</Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                Legal
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>Terms</Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>Privacy</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}