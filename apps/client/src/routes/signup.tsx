import { createFileRoute, Link } from "@tanstack/react-router";
import React, { useState } from "react";
import { SiSteam, SiDiscord } from "react-icons/si";
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
  Checkbox,
  FormControlLabel,
} from "@mui/material";
// Import for icons
import { Visibility, VisibilityOff, Google } from "@mui/icons-material";

import AuthClient from "@/apiClients/authClient";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import "@/App.css";

const SignupPage: React.FC = () => {
  const authClient = new AuthClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [signupError, setSignupError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await authClient.signUp(email, password, confirmPassword);
    console.log(result);
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
              Create Account
            </Typography>
            {signupError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {signupError}
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
                  },
                }}
              />

              <TextField
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                variant="outlined"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    required
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">
                    I agree to the{" "}
                    <Link to="/" className="link-style">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/" className="link-style">
                      Privacy Policy
                    </Link>
                  </Typography>
                }
                sx={{ mt: 2 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  py: 1.5,
                  fontWeight: "bold",
                  mt: 3,
                  mb: 3,
                }}
                disabled={!agreeToTerms}
              >
                Sign Up
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
                >
                  Continue with Discord
                </Button>
              </Stack>

              <Box sx={{ textAlign: "center", mt: 4 }}>
                <Typography variant="body2">
                  Already have an account?{" "}
                  <Link to="/login" className="link-style">
                    Log in
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

export default SignupPage;

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});
