import pool from '../database/Conexion.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const secretKey = 'estoesmuysecreto';
// Registrar un nuevo usuario
export const RegistrarUsuarios = async (req, res) => {
  try {
    const { numero_documento, nombre, apellido, username, rol_id, email, password, is_staff } = req.body;

    if (!numero_documento || !password || !nombre || !apellido || !email) {
      return res.status(400).json({ message: 'Identificación, nombre, apellido, email y contraseña son obligatorios' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
const sql = `
  INSERT INTO usuarios_usuarios (
    numero_documento, nombre, apellido, username, rol_id, email, password,
    is_staff, is_superuser, first_name, last_name, is_active, date_joined, last_login
  ) 
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
`;

const now = new Date();

const result = await pool.query(sql, [
  numero_documento,
  nombre,
  apellido,
  username,
  rol_id,
  email,
  hashedPassword,
  is_staff === true,
  false, // is_superuser
  '',    // first_name (puedes usar nombre si quieres)
  '',    // last_name (puedes usar apellido si quieres)
  true,  // is_active
  now,
  now
]);

    if (result.rowCount > 0) {
      return res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } else {
      return res.status(400).json({ message: 'No se pudo registrar el usuario' });
    }
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      return res.status(400).json({ message: 'El usuario o correo ya existe' });
    }
    res.status(500).json({ message: 'Error al crear el usuario' });
  }
};

// Listar todos los usuarios
export const listarUsuarios = async (req, res) => {
  try {
    const sql = 'SELECT id, numero_documento, nombre, apellido, username, rol_id, email, is_staff FROM usuarios_usuarios';
    const result = await pool.query(sql);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al listar los usuarios' });
  }
};

// Actualizar un usuario
export const ActualizarUsuarios = async (req, res) => {
  try {
    const { numero_documento, nombre, apellido, username, rol_id, email, password, is_staff } = req.body;
    const id = req.params.id;

    let hashedPassword = password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const sql = `
      UPDATE usuarios_usuarios 
      SET numero_documento=$1, nombre=$2, apellido=$3, username=$4, rol_id=$5, email=$6, password=$7, is_staff=$8
      WHERE id=$9
    `;
    const result = await pool.query(sql, [
      numero_documento, nombre, apellido, username, rol_id, email, hashedPassword, is_staff === true, id
    ]);

    if (result.rowCount > 0) {
      return res.status(200).json({ message: 'Usuario actualizado exitosamente' });
    } else {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el usuario' });
  }
};

// Eliminar un usuario
export const EliminarUsuarios = async (req, res) => {
  try {
    const id = req.params.id;
    const sql = 'DELETE FROM usuarios_usuarios WHERE id=$1';
    const result = await pool.query(sql, [id]);

    if (result.rowCount > 0) {
      return res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } else {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
};

export const BuscarUsuarios = async (req, res) => {
  try {
    const id = req.params.id;

    // Validar que sea un número
    const idNum = Number(id);
    if (isNaN(idNum)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const sql = 'SELECT id, numero_documento, nombre, apellido, username, rol_id, email, is_staff FROM usuarios_usuarios WHERE id=$1';
    const result = await pool.query(sql, [idNum]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.status(200).json({ message: 'Usuario encontrado', usuario: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al buscar el usuario' });
  }
};

export const obtenerUsuarioActual = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token mal formateado' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, secretKey);
    } catch (error) {
      return res.status(401).json({ message: 'Token inválido o expirado' });
    }

    const userId = decoded.id; // asumiendo que en el token guardas el id como "id"

    const sql = `
      SELECT id, numero_documento, nombre, apellido, username, rol_id, email, is_staff 
      FROM usuarios_usuarios WHERE id = $1
    `;
    const result = await pool.query(sql, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener usuario actual:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};
