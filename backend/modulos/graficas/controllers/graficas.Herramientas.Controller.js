import pool from "../../usuarios/database/Conexion.js";

export const obtenerHerramientasPorNombre = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        nombre,
        SUM(cantidad) AS total
      FROM herramientas_herramienta
      GROUP BY nombre
      ORDER BY total DESC;
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error al obtener herramientas por nombre:", error);
    res.status(500).json({ message: "Error al obtener herramientas por nombre" });
  }
};
