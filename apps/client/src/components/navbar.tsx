import React, { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import "@fontsource/press-start-2p/index.css";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Event as EventIcon,
  Add as AddIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Build as BuildIcon,
} from "@mui/icons-material";
import useAuthStore from "@/stores/authStore";
import { ThemeToggleButton } from "./themeToggleButton";

const Navbar: React.FC = () => {
  const authStore = useAuthStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  useEffect(() => {
    (async function () {
      const isAuthenticated = await authStore.isAuthenticated();
      setIsAuthenticated(isAuthenticated);
    })();
  }, [authStore.user]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleDropdownClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
  };

  const toggleMobileDrawer = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const signOut = () => {
    authStore.removeUser();
    handleDropdownClose();
  };

  const MobileDrawer = () => (
    <Drawer
      anchor="right"
      open={mobileDrawerOpen}
      onClose={toggleMobileDrawer}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
          bgcolor: 'background.paper',
        }
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          Queue Up
        </Typography>
        <Divider />
      </Box>

      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/events" onClick={toggleMobileDrawer}>
            <ListItemIcon>
              <EventIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Events" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/events/create" onClick={toggleMobileDrawer}>
            <ListItemIcon>
              <AddIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Create Event" />
          </ListItemButton>
        </ListItem>

        <Divider sx={{ my: 1 }} />

        {isAuthenticated ? (
          <ListItem disablePadding>
            <ListItemButton onClick={() => { signOut(); toggleMobileDrawer(); }}>
              <ListItemIcon>
                <LogoutIcon color="error" />
              </ListItemIcon>
              <ListItemText primary="Sign Out" />
            </ListItemButton>
          </ListItem>
        ) : (
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/login" onClick={toggleMobileDrawer}>
              <ListItemIcon>
                <LoginIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Log In" />
            </ListItemButton>
          </ListItem>
        )}

        <Box sx={{ p: 2, mt: 'auto' }}>
          <ThemeToggleButton />
        </Box>
      </List>
    </Drawer>
  );

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)',
        boxShadow: '0 2px 12px rgba(25, 118, 210, 0.3)',
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
        {/* Logo */}
        <Box
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            transition: 'transform 0.2s ease',
            '&:hover': {
              transform: 'scale(1.02)',
            }
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "white",
              fontWeight: "bold",
              fontSize: { xs: "1.2rem", md: "1.5rem" },
              fontFamily: '"Press Start 2P", monospace',
              letterSpacing: "1px",
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            Queue Up
          </Typography>
        </Box>

        {/* Desktop Navigation */}
        {!isMobile ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Events Button */}
            <Button 
              component={Link} 
              to="/events"
              startIcon={<EventIcon />}
              sx={{
                color: 'white',
                textTransform: 'none',
                fontWeight: 600,
                px: 2,
                borderRadius: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              Events
            </Button>

            {/* Organiser Dropdown */}
            <Button
              onClick={handleDropdownClick}
              endIcon={<ArrowDropDownIcon />}
              startIcon={<BuildIcon />}
              aria-controls={open ? "organiser-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              sx={{
                color: 'white',
                textTransform: 'none',
                fontWeight: 600,
                px: 2,
                borderRadius: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              Organiser
            </Button>

            <Menu
              id="organiser-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleDropdownClose}
              sx={{
                '& .MuiPaper-root': {
                  borderRadius: 2,
                  mt: 1,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                }
              }}
            >
              <MenuItem onClick={handleDropdownClose}>
                <AddIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Link
                  to="/events/create"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    width: "100%",
                  }}
                >
                  Create Event
                </Link>
              </MenuItem>
            </Menu>

            {/* Auth Button */}
            {isAuthenticated ? (
              <Button
                variant="contained"
                onClick={signOut}
                startIcon={<LogoutIcon />}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.15)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.25)',
                    transform: 'translateY(-1px)',
                  },
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                  transition: 'all 0.2s ease'
                }}
              >
                Sign Out
              </Button>
            ) : (
              <Button
                component={Link}
                to="/login"
                variant="contained"
                startIcon={<LoginIcon />}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.15)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.25)',
                    transform: 'translateY(-1px)',
                  },
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                  transition: 'all 0.2s ease'
                }}
              >
                Log In
              </Button>
            )}

            {/* Theme Toggle */}
            <ThemeToggleButton />
          </Box>
        ) : (
          /* Mobile Menu Button */
          <IconButton 
            size="large" 
            edge="end" 
            onClick={toggleMobileDrawer}
            sx={{ 
              color: 'white',
              '&:hover': { 
                bgcolor: 'rgba(255,255,255,0.1)',
              }
            }}
          >
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>

      {/* Mobile Drawer */}
      <MobileDrawer />
    </AppBar>
  );
};

export default Navbar;