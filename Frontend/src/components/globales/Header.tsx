import { useState } from "react";
import { Box } from '@mui/material';
import UserMenu from '../usuarios/UserMenu';

interface HeaderProps {
  isSidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isSidebarOpen }) => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <header
      className="fixed top-0 left-0 z-40 bg-green-600 h-16 flex items-center px-6 transition-all duration-300 w-full"
      style={{
        marginLeft: isSidebarOpen ? "250px" : "70px",
        width: isSidebarOpen ? "calc(100% - 250px)" : "calc(100% - 70px)",
      }}
    >
      {/* Barra de búsqueda */}
      <div className="bg-white rounded-full px-4 py-2 flex items-center w-72 shadow-md">
        <input
          type="text"
          className="w-full border-none outline-none text-lg px-2"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Espacio flexible para empujar el UserMenu a la derecha */}
      <div className="flex-grow" />

      {/* Menú de usuario en la derecha */}
      <Box sx={{ display: 'flex', alignItems: 'center' ,}}>
        <UserMenu />
      </Box>
    </header>
  );
};