import pool from '../database/Conexion.js';

export const RegistrarUsuarios = async (req, res) => {
  try {
    const { nombre, apellido, email, password, username, rol_id } = req.body;

    if (!nombre || !apellido || !email || !password) {
      return res.status(400).json({ message: 'Nombre, apellido, email y contraseña son obligatorios' });
    }

    const sql = `
      INSERT INTO usuarios_usuarios (nombre, apellido, email, password, username, rol_id, fecha_registro)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
    `;
    const result = await pool.query(sql, [
      nombre, apellido, email, password, username, rol_id
    ]);

    if (result.rowCount > 0) {
      return res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } else {
      return res.status(400).json({ message: 'No se pudo registrar el usuario' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el usuario' });
  }
};

export const listarUsuarios = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id,
        u.nombre,
        u.apellido,
        u.username,
        u.email,
        u.rol_id,
        r.nombre AS rol_nombre
      FROM usuarios_usuarios u
      JOIN roles_roles r ON u.rol_id = r.id
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al listar los usuarios:', error);
    res.status(500).json({ message: 'Error al listar los usuarios' });
  }
};

export const ActualizarUsuarios = async (req, res) => {
  try {
    const { nombre, apellido, email, password, username, rol_id } = req.body;
    const id = req.params.id;

    let sql;
    let values;

    if (password) {
      // Si se envía una nueva contraseña
      sql = `
        UPDATE usuarios_usuarios
        SET nombre=$1, apellido=$2, email=$3, password=$4, username=$5, rol_id=$6
        WHERE id=$7
      `;
      values = [nombre, apellido, email, password, username, rol_id, id];
    } else {
      // Si no se envía la contraseña (se mantiene la anterior)
      sql = `
        UPDATE usuarios_usuarios
        SET nombre=$1, apellido=$2, email=$3, username=$4, rol_id=$5
        WHERE id=$6
      `;
      values = [nombre, apellido, email, username, rol_id, id];
    }

    const result = await pool.query(sql, values);

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
    const result = await pool.query('DELETE FROM usuarios_usuarios WHERE id=$1', [id]);

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
    const result = await pool.query(`
      SELECT 
        u.id,
        u.nombre,
        u.apellido,
        u.username,
        u.email,
        u.rol_id,
        r.nombre AS rol_nombre
      FROM usuarios_usuarios u
      JOIN roles_roles r ON u.rol_id = r.id
      WHERE u.id = $1
    `, [id]); 

    if (result.rows.length > 0) {
      return res.status(200).json({ message: 'Usuario encontrado', usuario: result.rows[0] });
    } else {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error al buscar el usuario:', error);
    res.status(500).json({ message: 'Error al buscar el usuario' });
  }
};

export const UsuarioActual = async (req, res) => {
  try {
    const userId = req.userId;

    const result = await pool.query(`
      SELECT 
        u.id, u.nombre, u.apellido, u.email, u.username, u.rol_id, r.nombre AS rol_nombre
      FROM usuarios_usuarios u
      JOIN roles_roles r ON u.rol_id = r.id
      WHERE u.id = $1
    `, [userId]);

    if (result.rows.length > 0) {
      return res.status(200).json(result.rows[0]);
    } else {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error en /usuarios/me:', error);
    return res.status(500).json({ message: 'Error al obtener usuario actual' });
  }
};
