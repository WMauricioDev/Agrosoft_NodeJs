import pool from "../../usuarios/database/Conexion.js";

export const obtenerDatosHistoricos = async (req, res) => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) {
      return res.status(401).json({ message: "No se proporcionó token de autenticación" });
    }

    const hoy = new Date();
    const diezDiasAntes = new Date();
    diezDiasAntes.setDate(hoy.getDate() - 10);

    const result = await pool.query(`
      SELECT 
        fecha_medicion,
        temperature,
        humidity
      FROM datos_meteorologicos_datos_metereologicos
      WHERE fecha_medicion BETWEEN $1 AND $2
      ORDER BY fecha_medicion ASC;
    `, [diezDiasAntes, hoy]);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error al obtener datos históricos:", error);
    res.status(500).json({ message: "Error al obtener datos históricos" });
  }
};
