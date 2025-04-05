import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import Register from '../../components/usuarios/Register';

import AgrosisLogotic from '../../assets/def_AGROSIS_LOGOTIC.png';
import LogoSena from '../../assets/logo2.png';

const RegisterPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#27a35e', // Verde más oscuro
      }}
    >
      {/* Fondo con línea horizontal curva (~) */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
          preserveAspectRatio="none"
        >
          <path
            fill="#fff" // Mitad superior blanca
            fillOpacity="1"
            d="M0,0 L0,160 Q360,140 720,160 Q1080,180 1440,160 L1440,0 Z" // Curva menos pronunciada
          />
        </svg>
      </Box>

      {/* Logo AGROSIS en la esquina superior izquierda del fondo */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 1,
        }}
      >
        <img
          src={AgrosisLogotic}
          alt="AGROSIS Logotic Small"
          style={{
            width: '140px',
            height: 'auto',
          }}
        />
      </Box>

      {/* Logo SENA en la esquina inferior izquierda del fondo */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          zIndex: 1,
        }}
      >
        <img
          src={LogoSena}
          alt="Logo SENA"
          style={{
            width: '100px',
            height: 'auto',
          }}
        />
      </Box>

      {/* Contenedor principal: Solo el formulario */}
      <Box
        sx={{
          width: { xs: '90%', sm: '70%', md: '50%' },
          maxWidth: '600px',
          backgroundColor: '#fff',
          borderRadius: '24px',
          boxShadow: '0 15px 40px rgba(0,0,0,0.1)',
          position: 'relative',
          zIndex: 2,
          overflow: 'hidden',
          p: { xs: 2, sm: 4 },
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: '#1a202c',
              textAlign: 'center',
              mb: 1,
            }}
          >
            Registrar
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: '#718096',
              textAlign: 'center',
              mb: 3,
            }}
          >
            Ingresa tus credenciales para registrarte
          </Typography>
          <Register />
        </motion.div>
      </Box>
    </Box>
  );
};

export default RegisterPage;