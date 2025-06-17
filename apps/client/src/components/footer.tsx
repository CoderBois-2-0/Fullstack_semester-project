import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

const Footer: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 3, 
        px: 2, 
        mt: 'auto',
        backgroundColor: theme.palette.mode === 'dark' ? 'grey.900' : '#0F1524',
        color: 'white',
        boxShadow: '0 -4px 10px rgba(0, 0, 0, 0.1)',
        position: 'sticky',
        bottom: 0
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
            Queue Up
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
  );
}

export default Footer;