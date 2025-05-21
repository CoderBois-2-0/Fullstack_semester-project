import React, { useState } from 'react';
import { SiSteam, SiDiscord } from 'react-icons/si';
import { createFileRoute, Link } from '@tanstack/react-router';
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
  FormControlLabel
} from '@mui/material';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import '../App.css';

// Import for icons
import { Visibility, VisibilityOff, Google } from '@mui/icons-material';

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [signupError, setSignupError] = useState('');
  
  // Add validation states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  // Email validation function
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    } else if (!re.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    } else {
      setEmailError('');
      return true;
    }
  };
  
  // Password validation function
  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    } else {
      setPasswordError('');
      return true;
    }
  };
  
  // Confirm password validation function
  const validateConfirmPassword = (confirmPassword: string) => {
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      return false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    } else {
      setConfirmPasswordError('');
      return true;
    }
  };
  
  // Handle email input change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (emailError) validateEmail(newEmail);
  };
  
  // Handle password input change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (passwordError) validatePassword(newPassword);
    if (confirmPassword) validateConfirmPassword(confirmPassword);
  };
  
  // Handle confirm password input change
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    if (confirmPasswordError) validateConfirmPassword(newConfirmPassword);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);
    
    if (isEmailValid && isPasswordValid && isConfirmPasswordValid) {
      // Implement signup logic here
      console.log('Signup attempt with:', { email, password });
    } else {
      setSignupError('Please correct the errors before submitting');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navbar Component */}
      <Navbar />

      {/* Main Content */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: 'background.default',
          py: 8
        }}
      >
        <Container maxWidth="sm">
          <Paper 
            elevation={3} 
            sx={{ 
              p: { xs: 3, sm: 4 }, 
              borderRadius: 2,
              backgroundColor: 'background.paper'
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
                onChange={handleEmailChange}
                onBlur={() => validateEmail(email)}
                required
                error={!!emailError}
                helperText={emailError}
              />
              
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                margin="normal"
                variant="outlined"
                value={password}
                onChange={handlePasswordChange}
                onBlur={() => validatePassword(password)}
                required
                error={!!passwordError}
                helperText={passwordError}
                InputProps={{
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
                  )
                }}
              />
              
              <TextField
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                fullWidth
                margin="normal"
                variant="outlined"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                onBlur={() => validateConfirmPassword(confirmPassword)}
                required
                error={!!confirmPasswordError}
                helperText={confirmPasswordError}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
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
                    I agree to the{' '}
                    <Link to="/" className="link-style">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
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
                  fontWeight: 'bold',
                  mt: 3,
                  mb: 3
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
                    color: '#8f9eff',
                    borderColor: '#8f9eff'
                  }}
                >
                  Continue with Discord
                </Button>
              </Stack>
              
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="body2">
                  Already have an account?{' '}
                  <Link to="/login" className="link-style">
                    Log in
                  </Link>
                </Typography>
              </Box>
            </form>
          </Paper>
        </Container>
      </Box>

      {/* Footer Component */}
      <Footer />
    </Box>
  );
}

export default SignupPage;

export const Route = createFileRoute('/signUp')({
  component: SignupPage
});