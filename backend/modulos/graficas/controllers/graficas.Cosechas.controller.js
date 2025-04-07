import pool from "../../usuarios/database/Conexion.js";

export const obtenerCosechasPorCultivo = async (req, res) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) {
      return res.status(401).json({ message: "No se proporcionó token de autenticación" });
    }

    const result = await pool.query(`
      SELECT c.nombre AS cultivo, SUM(ch.cantidad) AS total_cantidad
      FROM cosechas_cosecha ch
      JOIN cultivos_cultivo c ON ch.id_cultivo_id = c.id
      GROUP BY c.nombre
      ORDER BY c.nombre;
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error obteniendo cosechas por cultivo:', error);
    res.status(500).json({ message: 'Error al obtener cosechas por cultivo' });
  }
};