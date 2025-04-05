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
    const result = await pool.query('SELECT * FROM usuarios_usuarios');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al listar los usuarios' });
  }
};

export const ActualizarUsuarios = async (req, res) => {
  try {
    const { nombre, apellido, email, password, username, rol_id } = req.body;
    const id = req.params.id;

    const sql = `
      UPDATE usuarios_usuarios
      SET nombre=$1, apellido=$2, email=$3, password=$4, username=$5, rol_id=$6
      WHERE id=$7
    `;
    const result = await pool.query(sql, [
      nombre, apellido, email, password, username, rol_id, id
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
    const email = req.params.email;
    const result = await pool.query('SELECT * FROM usuarios_usuarios WHERE email=$1', [email]);

    if (result.rows.length > 0) {
      return res.status(200).json({ message: 'Usuario encontrado', usuario: result.rows[0] });
    } else {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al buscar el usuario' });
  }
};

export const UsuarioActual = async (req, res) => {
  try {
    const userId = req.userId;

    const result = await pool.query(
      'SELECT id, nombre, apellido, email, rol_id FROM usuarios_usuarios WHERE id=$1',
      [userId]
    );

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
