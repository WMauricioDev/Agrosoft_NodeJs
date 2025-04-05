import pool from '../database/Conexion.js';

export const listarRolesUsuario = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM usuario_rol');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar relaciones' });
  }
};

export const AsignarRolUsuario = async (req, res) => {
  try {
    const { fk_usuario, fk_rol } = req.body;
    
    // Verificar si la relación ya existe
    const existe = await pool.query(
      'SELECT * FROM usuario_rol WHERE fk_usuario = $1 AND fk_rol = $2',
      [fk_usuario, fk_rol]
    );

    if (existe.rows.length > 0) {
      return res.status(400).json({ message: 'La relación ya existe' });
    }

    await pool.query(
      'INSERT INTO usuario_rol (fk_usuario, fk_rol) VALUES ($1, $2)',
      [fk_usuario, fk_rol]
    );

    res.status(201).json({ message: 'Rol asignado al usuario' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const EliminarRolUsuario = async (req, res) => {
  try {
    const { fk_usuario, fk_rol } = req.params;
    const { rowCount } = await pool.query(
      'DELETE FROM usuario_rol WHERE fk_usuario = $1 AND fk_rol = $2',
      [fk_usuario, fk_rol]
    );

    rowCount > 0
      ? res.status(200).json({ message: 'Relación eliminada' })
      : res.status(404).json({ message: 'Relación no encontrada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar' });
  }
};