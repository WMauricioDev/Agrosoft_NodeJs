import React, { useState, FormEvent } from 'react';
import { Box, Button, TextField, Typography, IconButton, InputAdornment } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${BASE_URL}`;

const Register: React.FC = () => {
  const [nombre, setNombre] = useState<string>('');
  const [numero_documento, setNumero_documento] = useState<number>();
  const [apellido, setApellido] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rol_id, setRolId] = useState<string>('4'); // por defecto '4'
  const [is_staff] = useState<boolean>(true); // siempre true según tu ejemplo
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!nombre || !apellido || !email ||!numero_documento) {
      setError('Todos los campos son requeridos');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/usuarios/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
body: JSON.stringify({
  nombre,
  apellido,
  email,
  numero_documento,
  username,
  password,
  rol_id,
  is_staff
}),      });

      const data = await response.json();

      if (!response.ok) {
        if (data) {
          const parsedErrors: { [key: string]: string } = {};
          Object.entries(data).forEach(([key, value]) => {
            parsedErrors[key] = Array.isArray(value) ? value.join(', ') : String(value);
          });
          setFieldErrors(parsedErrors); // ⬅️ Ahora se está usando
          throw new Error('Corrige los campos marcados');
        }
        throw new Error('Error en el registro');
      }
      
      setSuccess('Usuario registrado correctamente');
    } catch (err) {
      setError((err as Error).message || 'Error en el registro');
    } finally {
      setLoading(false);
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
      '& .MuiInputAdornment-root': {
        backgroundColor: 'inherit', // Fondo uniforme con el campo
        height: '100%',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#a0aec0',
      '&.Mui-focused': { color: '#2ecc71' },
    },
  };

 return (
  <Box
    component="form"
    onSubmit={handleSubmit}
    sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 2.5,
      width: '100%',
    }}
  >
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
<TextField
  label="Nombre"
  value={nombre}
  onChange={(e) => {
    const value = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(value)) {
      setNombre(value);
      setFieldErrors((prev) => ({ ...prev, nombre: '' }));
    } else {
      setFieldErrors((prev) => ({ ...prev, nombre: 'Solo se permiten letras y espacios' }));
    }
  }}
  fullWidth
  required
  error={!!fieldErrors.nombre}
  helperText={fieldErrors.nombre}
  sx={textFieldStyles}
/>
      </motion.div>
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.8 }}>
<TextField
  label="Apellido"
  value={apellido}
  onChange={(e) => {
    const value = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(value)) {
      setApellido(value);
      setFieldErrors((prev) => ({ ...prev, apellido: '' }));
    } else {
      setFieldErrors((prev) => ({ ...prev, apellido: 'Solo se permiten letras y espacios' }));
    }
  }}
  fullWidth
  required
  error={!!fieldErrors.apellido}
  helperText={fieldErrors.apellido}
  sx={textFieldStyles}
/>
        </motion.div>
    </Box>


      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <TextField
          type="number"
          label="Numero de documento"
          value={numero_documento ?? ''}
          onChange={(e) => {
            const value = e.target.value;
            setNumero_documento(value === '' ? undefined : Number(value));
          }}
          fullWidth
          required
          error={!!fieldErrors.numero_documento}
          helperText={fieldErrors.numero_documento}
          sx={textFieldStyles}
        />
      </motion.div>

    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.8 }}>
      <TextField
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        required
        error={!!fieldErrors.email}
        helperText={fieldErrors.email}
        sx={textFieldStyles}
      />
    </motion.div>
    <TextField
  label="Username"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  fullWidth
  required
  error={!!fieldErrors.username}
  helperText={fieldErrors.username}
  sx={textFieldStyles}
/>

<TextField
  label="Contraseña"
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  fullWidth
  required
  error={!!fieldErrors.password}
  helperText={fieldErrors.password}
  sx={textFieldStyles}
/>


    {error && (
      <Typography variant="body2" sx={{ color: '#f56565', textAlign: 'center', fontSize: '0.875rem' }}>
        {error}
      </Typography>
    )}
    {success && (
      <Typography variant="body2" sx={{ color: '#2ecc71', textAlign: 'center', fontSize: '0.875rem' }}>
        {success}
      </Typography>
    )}

    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1 }}>
      <Button
        type="submit"
        disabled={loading}
        variant="contained"
        fullWidth
        sx={{ backgroundColor: '#2ecc71' }}
      >
        {loading ? 'Registrando...' : 'Registrarse'}
      </Button>
    </motion.div>

    <Typography
      variant="body2"
      sx={{ textAlign: 'center', color: '#718096', fontSize: '0.9rem', mt: 1 }}
    >
      ¿Ya tienes cuenta?{' '}
      <Link to="/login" style={{ color: '#27a35e', textDecoration: 'none' }}>
        Iniciar sesión
      </Link>
    </Typography>
  </Box>
);

};

export default Register;