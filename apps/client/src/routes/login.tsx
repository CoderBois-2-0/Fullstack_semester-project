import React, { useState } from "react";
import { SiSteam, SiDiscord } from "react-icons/si";
import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  Divider,
  Stack,
} from "@mui/material";
import "../App.css";

// Import for icons
import { Visibility, VisibilityOff } from "@mui/icons-material";
import AuthClient from "@/apiClients/authClient";
import useAuthStore from "@/stores/authStore";

const LoginPage: React.FC = () => {
  const navigate = useNavigate({ from: "/login" });

  const authStore = useAuthStore();
  const authClient = new AuthClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isValidating, setIsValidating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, _setLoginError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsValidating(true)
    const result = await authClient.signIn(email, password);
    if (result) {
      authStore.setUser(result);
      navigate({ to: "/events" });
    }

    setIsValidating(false);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "background.default",
          py: 8,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 2,
              backgroundColor: "background.paper",
            }}
          >
            <Typography
              component="h1"
              variant="h4"
              align="center"
              fontWeight="bold"
              color="primary"
              mb={4}
            >
              Log In
            </Typography>

            {loginError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {loginError}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                label="Email Address"
                type="email"
                fullWidth
                margin="normal"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />

              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                slotProps={{
                  input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  }
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 1,
                  mb: 2,
                }}
              >
                <Link to="/" className="link-style">
                  Forgot password?
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  py: 1.5,
                  fontWeight: "bold",
                  mb: 3,
                }}
                  disabled={isValidating}
              >
                Log In
              </Button>

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  OR
                </Typography>
              </Divider>

              <Stack spacing={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="inherit"
                  startIcon={<SiSteam />}
                  sx={{ py: 1.2 }}
                  disabled={isValidating}
                >
                  Continue with Steam
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<SiDiscord />}
                  sx={{
                    py: 1.2,
                    color: "#8f9eff",
                    borderColor: "#8f9eff",
                  }}
                  disabled={isValidating}
                >
                  Continue with Discord
                </Button>
              </Stack>

              <Box sx={{ textAlign: "center", mt: 4 }}>
                <Typography variant="body2">
                  Don't have an account?{" "}
                  <Link to="/signup" className="link-style">
                    Sign up
                  </Link>
                </Typography>
              </Box>
            </form>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default LoginPage;

export const Route = createFileRoute("/login")({
  component: LoginPage,
  loader: async ({ context }) => {
    const isAuthorized = await context.authStore.isAuthenticated();
    if (isAuthorized) {
      throw redirect({
        to: "/",
      });
    }
  },
});
