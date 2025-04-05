import React, { useState, FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUsuarios, UsuarioUpdate } from "@/hooks/usuarios/useUsuarios";
import DefaultLayout from "@/layouts/default";
import { Box, Button, TextField, Typography, Modal, Backdrop, Fade, IconButton, InputAdornment } from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-hot-toast";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const PerfilPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { updateUsuario } = useUsuarios();
  const [isEditing, setIsEditing] = useState(false);
  const [editUser, setEditUser] = useState(user);
  const [editError, setEditError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!user || !editUser) {
    return (
      <DefaultLayout>
        <Typography variant="h6" sx={{ textAlign: "center", mt: 4 }}>
          No se encontró información del usuario. Por favor, inicia sesión.
        </Typography>
      </DefaultLayout>
    );
  }

  const handleEdit = () => {
    setIsEditing(true);
    setEditError(null);
    setPasswordError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditUser(user);
    setOpenModal(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setEditError(null);
    setPasswordError(null);
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleChange = (field: string, value: string) => {
    setEditUser({ ...editUser, [field]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const usuarioToUpdate: UsuarioUpdate = {
        id: editUser.id,
        nombre: editUser.nombre,
        apellido: editUser.apellido,
        email: editUser.email,
        username: editUser.username,
        rol_id: editUser.rol?.id || null,
      };
      console.log("Enviando al backend desde perfil:", usuarioToUpdate);
      const updatedUser = await updateUsuario(usuarioToUpdate);
      updateUser(updatedUser);
      setIsEditing(false);
      setEditError(null);
    } catch (err: any) {
      console.error("Error del backend:", err.response?.data);
      setEditError(err.response?.data?.detail || "No se pudo actualizar los datos. Verifica la información.");
    }
  };

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setPasswordError("Las nuevas contraseñas no coinciden.");
      return;
    }
    try {
      const token = localStorage.getItem("access_token");
      await axios.post(
        "http://127.0.0.1:8000/usuarios/change_password/",
        { current_password: currentPassword, new_password: newPassword },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      setPasswordError(null);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setOpenModal(false);
      toast.success("Contraseña actualizada con éxito.");
    } catch (err: any) {
      setPasswordError(err.response?.data?.error || "Error al cambiar la contraseña. Verifica los datos.");
    }
  };

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      backgroundColor: '#fff', // Fondo blanco
      transition: 'all 0.3s ease-in-out',
      '& fieldset': { borderColor: '#e2e8f0' },
      '&:hover fieldset': { borderColor: '#cbd5e1' },
      '&.Mui-focused fieldset': { borderColor: '#2ecc71' },
      '&.Mui-disabled': {
        backgroundColor: '#fff', // Blanco también para deshabilitados
      },
      '& .MuiInputAdornment-root': {
        backgroundColor: 'inherit', // Fondo uniforme con el campo
        height: '100%',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#a0aec0',
      '&.Mui-focused': { color: '#2ecc71' },
      '&.Mui-disabled': { color: '#718096' },
    },
  };

  return (
    <DefaultLayout>
      <Box sx={{ p: 4, maxWidth: "600px", mx: "auto" }}>
        <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
          Mi Perfil
        </Typography>
        {!isEditing ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField label="Nombre" value={user.nombre} disabled fullWidth sx={textFieldStyles} />
            <TextField label="Apellido" value={user.apellido} disabled fullWidth sx={textFieldStyles} />
            <TextField label="Email" value={user.email} disabled fullWidth sx={textFieldStyles} />
            <TextField label="Username" value={user.username || ""} disabled fullWidth sx={textFieldStyles} />
            <TextField label="Rol" value={user.rol?.rol || "Sin rol"} disabled fullWidth sx={textFieldStyles} />
            <TextField label="Contraseña" value="••••••••" disabled fullWidth sx={textFieldStyles} />
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button variant="contained" sx={{ backgroundColor: "#2ecc71" }} onClick={handleEdit}>
                Editar
              </Button>
            </Box>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {editError && (
              <Typography variant="body2" sx={{ color: "#f56565", textAlign: "center" }}>
                {editError}
              </Typography>
            )}
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                <TextField
                  label="Nombre"
                  value={editUser.nombre}
                  onChange={(e) => handleChange("nombre", e.target.value)}
                  fullWidth
                  required
                  sx={textFieldStyles}
                />
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                <TextField
                  label="Apellido"
                  value={editUser.apellido}
                  onChange={(e) => handleChange("apellido", e.target.value)}
                  fullWidth
                  required
                  sx={textFieldStyles}
                />
              </motion.div>
            </Box>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                <TextField
                  type="email"
                  label="Email"
                  value={editUser.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  fullWidth
                  required
                  sx={textFieldStyles}
                />
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
                <TextField
                  label="Username"
                  value={editUser.username || ""}
                  onChange={(e) => handleChange("username", e.target.value)}
                  fullWidth
                  sx={textFieldStyles}
                />
              </motion.div>
            </Box>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.8 }}>
              <TextField
                label="Rol"
                value={editUser.rol?.rol || "Sin rol"}
                disabled
                fullWidth
                sx={textFieldStyles}
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 1 }}>
              <TextField
                label="Contraseña"
                value="••••••••"
                disabled
                fullWidth
                InputProps={{
                  endAdornment: (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setOpenModal(true)}
                      sx={{ ml: 1 }}
                    >
                      Cambiar
                    </Button>
                  ),
                }}
                sx={textFieldStyles}
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1.2 }}>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                <Button type="submit" variant="contained" sx={{ backgroundColor: "#2ecc71" }}>
                  Actualizar datos
                </Button>
                <Button variant="outlined" onClick={handleCancel} sx={{ borderColor: "#f56565", color: "#f56565" }}>
                  Cancelar
                </Button>
              </Box>
            </motion.div>
          </Box>
        )}

        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={openModal}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
                Cambiar Contraseña
              </Typography>
              {passwordError && (
                <Typography variant="body2" sx={{ color: "#f56565", textAlign: "center", mb: 2 }}>
                  {passwordError}
                </Typography>
              )}
              <Box component="form" onSubmit={handlePasswordChange} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Contraseña Actual"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  fullWidth
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          edge="end"
                        >
                          {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldStyles}
                />
                <TextField
                  label="Nueva Contraseña"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  fullWidth
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          edge="end"
                        >
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldStyles}
                />
                <TextField
                  label="Confirmar Nueva Contraseña"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  fullWidth
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldStyles}
                />
                <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                  <Button type="submit" variant="contained" sx={{ backgroundColor: "#2ecc71" }}>
                    Cambiar
                  </Button>
                  <Button variant="outlined" onClick={() => setOpenModal(false)} sx={{ borderColor: "#f56565", color: "#f56565" }}>
                    Cancelar
                  </Button>
                </Box>
              </Box>
            </Box>
          </Fade>
        </Modal>
      </Box>
    </DefaultLayout>
  );
};

export default PerfilPage;