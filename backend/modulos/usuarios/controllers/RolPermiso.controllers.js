import pool from '../database/Conexion.js';

export const listarPermisosRol = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT rp.fk_rol, rp.fk_permiso, r.nombre_rol, p.nombre AS nombre_permiso
      FROM rol_permiso rp
      JOIN roles r ON rp.fk_rol = r.id
      JOIN permisos p ON rp.fk_permiso = p.id
    `);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al listar permisos de rol:', error);
    res.status(500).json({ message: 'Error al listar permisos de rol' });
  }
};

export const AsignarPermisoRol = async (req, res) => {
  const { fk_rol, fk_permiso } = req.body;

  try {
    // Verificar si la relación ya existe
    const existe = await pool.query(
      'SELECT * FROM rol_permiso WHERE fk_rol = $1 AND fk_permiso = $2',
      [fk_rol, fk_permiso]
    );

    if (existe.rows.length > 0) {
      return res.status(400).json({ message: 'La relación ya existe' });
    }

    // Insertar la relación
    await pool.query(
      'INSERT INTO rol_permiso (fk_rol, fk_permiso) VALUES ($1, $2)',
      [fk_rol, fk_permiso]
    );

    res.status(201).json({ message: 'Permiso asignado al rol' });
  } catch (error) {
    if (error.code === '23503') { // Error de clave foránea
      return res.status(404).json({ message: 'Rol o permiso no encontrado' });
    }
    console.error('Error al asignar permiso al rol:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const EliminarPermisoRol = async (req, res) => {
  const { fk_rol, fk_permiso } = req.params;

  try {
    const { rowCount } = await pool.query(
      'DELETE FROM rol_permiso WHERE fk_rol = $1 AND fk_permiso = $2',
      [fk_rol, fk_permiso]
    );

    if (rowCount > 0) {
      res.status(200).json({ message: 'Permiso eliminado del rol' });
    } else {
      res.status(404).json({ message: 'Relación no encontrada' });
    }
  } catch (error) {
    console.error('Error al eliminar permiso del rol:', error);
    res.status(500).json({ message: 'Error al eliminar permiso del rol' });
  }
};