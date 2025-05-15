import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Box } from '@mui/material';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import HeroBanner from '../components/herobanner';
import '../App.css';

const HomePage: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navbar Component */}
      <Navbar />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Hero Banner Component */}
        <HeroBanner />

        {/* Additional content can go here */}
        <Box sx={{ px: { xs: 2, sm: 4, md: 6 }, pb: 6 }}>
          {/* Additional content can go here */}
        </Box>
      </Box>

      {/* Footer Component */}
      <Footer />
    </Box>
  );
}

export default HomePage;

export const Route = createFileRoute('/')({
  component: HomePage
});