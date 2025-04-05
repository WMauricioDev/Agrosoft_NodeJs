import pool from '../database/Conexion.js';

export const listarPermisos = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM permisos');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar permisos' });
  }
};

export const RegistrarPermisos = async (req, res) => {
  const { nombre, descripcion } = req.body;

  if (!nombre) {
    return res.status(400).json({ message: 'Nombre de permiso requerido' });
  }

  try {
    const { rows } = await pool.query(
      'INSERT INTO permisos (nombre, descripcion) VALUES ($1, $2) RETURNING *',
      [nombre, descripcion]
    );
    res.status(201).json({ message: 'Permiso creado', permiso: rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      res.status(409).json({ message: 'El permiso ya existe' });
    } else {
      res.status(500).json({ message: 'Error del servidor' });
    }
  }
};

export const ActualizarPermisos = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;

  try {
    const { rows } = await pool.query(
      'UPDATE permisos SET nombre = $1, descripcion = $2 WHERE id = $3 RETURNING *',
      [nombre, descripcion, id]
    );

    rows.length > 0
      ? res.status(200).json({ message: 'Permiso actualizado', permiso: rows[0] })
      : res.status(404).json({ message: 'Permiso no encontrado' });
  } catch (error) {
    if (error.code === '23505') {
      res.status(409).json({ message: 'El nombre del permiso ya existe' });
    } else {
      res.status(500).json({ message: 'Error al actualizar' });
    }
  }
};

export const EliminarPermisos = async (req, res) => {
  const { id } = req.params;

  try {
    const { rowCount } = await pool.query('DELETE FROM permisos WHERE id = $1', [id]);
    rowCount > 0
      ? res.status(200).json({ message: 'Permiso eliminado' })
      : res.status(404).json({ message: 'Permiso no encontrado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar' });
  }
};