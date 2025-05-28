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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import useAuthStore from "@/stores/authStore";

const Navbar: React.FC = () => {
  const authStore = useAuthStore();

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    (async function () {
      const isAuthenticated = await authStore.isAuthenticated();
      setIsAuthenticated(isAuthenticated);
    })();
  }, [authStore.user]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleDropdownClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
  };

  const signOut = () => {
    authStore.removeUser();
  };

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{
        backgroundColor: "white",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.5)",
      }}
    >
      <Toolbar>
        {/* Logo */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            color: "#026CDF",
            fontWeight: "bold",
            fontSize: "1.5rem",
            textDecoration: "none",
            cursor: "pointer",
            fontFamily: '"Press Start 2P", monospace', // Gaming font
            letterSpacing: "1px",
            textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            "&:hover": {
              color: "#0350A0",
              textShadow: "2px 2px 6px rgba(0,0,0,0.5)",
            },
          }}
        >
          Queue Up
        </Typography>

        {/* Navbar Buttons */}
        {!isMobile ? (
          <Box>
            <Link to="/events">
              <Button sx={{ mr: 1 }}>Events</Button>
            </Link>

            {/* Organiser Dropdown */}
            <Button
              sx={{ mr: 1 }}
              onClick={handleDropdownClick}
              endIcon={<ArrowDropDownIcon />}
              aria-controls={open ? "organiser-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              Organiser
            </Button>
            <Menu
              id="organiser-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleDropdownClose}
              slotProps={{
                list: {
                  "aria-labelledby": "organiser-button",
                },
              }}
            >
              <MenuItem onClick={handleDropdownClose}>
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
              <MenuItem onClick={handleDropdownClose}>
                <Link
                  to="/create-post"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    width: "100%",
                  }}
                >
                  Create Post
                </Link>
              </MenuItem>
            </Menu>

            {isAuthenticated ? (
              <Button variant="contained" color="info" onClick={signOut}>
                Sign out
              </Button>
            ) : (
              <Link to="/login">
                <Button variant="contained" color="info">
                  Log In
                </Button>
              </Link>
            )}
          </Box>
        ) : (
          <IconButton size="large" edge="end" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
