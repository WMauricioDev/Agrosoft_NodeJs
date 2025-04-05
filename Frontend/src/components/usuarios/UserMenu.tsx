import React from "react";
import { useAuth } from "@/context/AuthContext";
import { IconButton, Menu, MenuItem, Typography, Box } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link } from "react-router-dom";

const UserMenu: React.FC = () => {
  const { logout, user } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  console.log("Usuario en UserMenu:", user);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  return (
    <Box>
      <IconButton onClick={handleClick} sx={{ ml: 1, color: "#fff" }}>
        <AccountCircleIcon />
        <Typography variant="body1" sx={{ ml: 1, color: "#fff" }}>
          {user ? user.nombre : "Usuario"}
        </Typography>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem disabled>
          <Box>
            <Typography variant="subtitle1">
              {user ? `${user.nombre} ${user.apellido}` : "Usuario"}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {user ? user.email : "correo@ejemplo.com"}
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem component={Link} to="/perfil" onClick={handleClose}>
          Perfil
        </MenuItem>
        <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
      </Menu>
    </Box>
  );
};

export default UserMenu;