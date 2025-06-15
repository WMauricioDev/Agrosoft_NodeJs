
import pool from '../database/Conexion.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const secretKey = 'estoesmuysecreto';
export const RegistrarUsuarios = async (req, res) => {
  try {
    const { numero_documento, nombre, apellido, username, email, password, is_staff } = req.body;

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
      1, 
      email,
      hashedPassword,
      is_staff === true,
      false, 
      '',    
      '',    
      true,  
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

export const listarUsuarios = async (req, res) => {
  try {
    const sql = `
      SELECT 
        u.id, 
        u.numero_documento, 
        u.nombre, 
        u.apellido, 
        u.username, 
        u.email, 
        u.is_staff,
        r.id AS rol_id,
        r.nombre AS rol_nombre
      FROM usuarios_usuarios u
      LEFT JOIN roles_roles r ON u.rol_id = r.id
    `;
    const result = await pool.query(sql);

    const usuarios = result.rows.map(row => ({
      id: row.id,
      numero_documento: row.numero_documento,
      nombre: row.nombre,
      apellido: row.apellido,
      username: row.username,
      email: row.email,
      is_staff: row.is_staff,
      rol: {
        id: row.rol_id,
        nombre: row.rol_nombre
      }
    }));

    res.status(200).json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al listar los usuarios' });
  }
};

export const ActualizarUsuarios = async (req, res) => {
  try {
    const { numero_documento, nombre, apellido, username, rol_id, email } = req.body;
    const id = req.params.id;

    const sql = `
      UPDATE usuarios_usuarios 
      SET numero_documento=$1, nombre=$2, apellido=$3, username=$4, rol_id=$5, email=$6
      WHERE id=$7
    `;
    console.log("Datos a actualizar:", {
  numero_documento,
  nombre,
  apellido,
  username,
  rol_id,
  email,
  id,
});

    
    const result = await pool.query(sql, [
      numero_documento, nombre, apellido, username, rol_id, email, id
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

    const idNum = Number(id);
    if (isNaN(idNum)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const sql = `
      SELECT 
        u.id, 
        u.numero_documento, 
        u.nombre, 
        u.apellido, 
        u.username, 
        u.email, 
        u.is_staff,
        r.id AS rol_id,
        r.nombre AS rol_nombre
      FROM usuarios_usuarios u
      LEFT JOIN roles_roles r ON u.rol_id = r.id
      WHERE u.id = $1
    `;

    const result = await pool.query(sql, [idNum]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const row = result.rows[0];

    const usuario = {
      id: row.id,
      numero_documento: row.numero_documento,
      nombre: row.nombre,
      apellido: row.apellido,
      username: row.username,
      email: row.email,
      is_staff: row.is_staff,
      rol: {
        id: row.rol_id,
        nombre: row.rol_nombre
      }
    };

    return res.status(200).json({ message: 'Usuario encontrado', usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al buscar el usuario' });
  }
  res.json(user);

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

    const userId = decoded.id;

    const sql = `
      SELECT 
        u.id, 
        u.numero_documento, 
        u.nombre, 
        u.apellido, 
        u.username, 
        u.email, 
        u.is_staff,
        r.id AS rol_id,
        r.nombre AS rol_nombre
      FROM usuarios_usuarios u
      LEFT JOIN roles_roles r ON u.rol_id = r.id
      WHERE u.id = $1
    `;

    const result = await pool.query(sql, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const row = result.rows[0];

    const user = {
      id: row.id,
      numero_documento: row.numero_documento,
      nombre: row.nombre,
      apellido: row.apellido,
      username: row.username,
      email: row.email,
      is_staff: row.is_staff,
      rol: {
        id: row.rol_id,
        nombre: row.rol_nombre
      }
    };

    return res.status(200).json(user);

  } catch (error) {
    console.error('Error al obtener usuario actual:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};


export const actualizarEstadoStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_staff } = req.body;

    if (typeof is_staff !== 'boolean') {
      return res.status(400).json({ message: 'El campo is_staff debe ser booleano (true o false)' });
    }

    const sql = `
      UPDATE usuarios_usuarios 
      SET is_staff = $1
      WHERE id = $2
    `;
    
    const result = await pool.query(sql, [is_staff, id]);

    if (result.rowCount > 0) {
      return res.status(200).json({ message: 'Estado de staff actualizado correctamente' });
    } else {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar is_staff:', error);
    res.status(500).json({ message: 'Error al actualizar el estado de staff' });
  }
};
