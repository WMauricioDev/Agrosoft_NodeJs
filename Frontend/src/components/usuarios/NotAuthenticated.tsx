import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';

const NotAuthenticated: React.FC = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      textAlign="center"
      p={3}
    >
      <Typography variant="h5" color="textSecondary" gutterBottom>
        No tienes acceso a esta página. Por favor, inicia sesión.
      </Typography>
      <Button
        component={Link}
        to="/login"
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
      >
        Iniciar sesión
      </Button>
      <Button
        component={Link}
        to="/register"
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
      >
        Registar usuario
      </Button>
    </Box>
  );
};

export default NotAuthenticated;