import pool from '../database/Conexion.js';

export const listarRoles = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM roles_roles');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar roles' });
  }
};
export const RegistrarRoles = async (req, res) => {
  const { nombre_rol } = req.body;

  try {
    const result = await pool.query('SELECT COUNT(*) FROM roles_roles');
    const count = parseInt(result.rows[0].count, 10); // Corregido

    if (count >= 5) {
      return res.status(400).json({ message: 'Límite de 5 roles alcanzado' });
    }

    const nuevoRol = await pool.query(
      'INSERT INTO roles (nombre_rol) VALUES ($1) RETURNING *',
      [nombre_rol]
    );

    res.status(201).json({ message: 'Rol registrado', rol: nuevoRol.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el rol' });
  }
};
export const ActualizarRoles = async (req, res) => {
  const { id } = req.params;
  const { nombre_rol } = req.body;

  try {
    const { rowCount } = await pool.query('UPDATE roles SET nombre_rol = $1 WHERE id = $2', [nombre_rol, id]);
    if (rowCount > 0) {
      res.status(200).json({ message: 'Rol actualizado' });
    } else {
      res.status(404).json({ message: 'Rol no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar rol' });
  }
};

export const EliminarRoles = async (req, res) => {
  const { id } = req.params;

  try {
    const { rowCount } = await pool.query('DELETE FROM roles_roles WHERE id = $1', [id]);
    if (rowCount > 0) {
      res.status(200).json({ message: 'Rol eliminado' });
    } else {
      res.status(404).json({ message: 'Rol no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar rol' });
  }
};