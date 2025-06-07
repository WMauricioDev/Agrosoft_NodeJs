import { useState, useEffect } from "react";
import { Box, Typography } from '@mui/material';
import UserMenu from '../usuarios/UserMenu';
import Notificacion from "./Notificacion";

interface HeaderProps {
  toggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Depuración de props
  console.log('Header props:', { toggleSidebar });

  return (
    <header
      className="fixed top-0 left-0 z-40 bg-green-600 h-16 flex items-center px-2 w-full"
    >  
      {/* Espacio flexible para empujar UserMenu y Notificaciones a la derecha */}
      <div className="flex-grow" />

      {/* Menú de usuario y notificaciones a la derecha */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: isMobile ? 0 : 0.25 
      }}>
        <Notificacion />
        <Typography 
          className={`text-white ${isMobile ? 'text-xl mx-0.25' : 'text-2xl mx-0.5'} font-light`}
        >
          |
        </Typography>
        <UserMenu hideText={isMobile} /> {/* Prop hideText ahora es válida */}
      </Box>
    </header>
  );
};