import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        backgroundImage: 'url(background.jpg)', // Assurez-vous que le chemin est correct
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Superposition sombre */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.7)',
            borderRadius: '8px',
            padding: '20px',
            maxWidth: '600px',
            width: '90%',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontFamily: 'ChocoShake', fontWeight: 'bold', mb: 2 }}
          >
            Bienvenue à
          </Typography>
          <Typography
            variant="h3"
            sx={{ fontFamily: 'ChocoShake', fontWeight: 'bold', mb: 2 }}
          >
            Bank and Business School!
          </Typography>
          <Typography
            variant="h5"
            sx={{ mb: 4 }}
          >
          👨‍🎓  Un court chemin vers le monde professionnel 👩‍🎓
          </Typography>
          <Button
            variant="contained"
            sx={{ bgcolor: '#f48fb1', '&:hover': { bgcolor: '#f06292' } }}
            onClick={() => navigate('/about')}
          >
            En savoir plus
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
