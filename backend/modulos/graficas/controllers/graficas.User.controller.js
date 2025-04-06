import pool from "../../usuarios/database/Conexion.js";

export const obtenerUsuariosPorRol = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.nombre AS rol, COUNT(u.id) AS cantidad
      FROM usuarios_usuarios u
      JOIN roles_roles r ON u.rol_id = r.id
      GROUP BY r.nombre
      ORDER BY r.nombre;
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error obteniendo usuarios por rol:', error);
    res.status(500).json({ message: 'Error al obtener usuarios por rol' });
  }
};
