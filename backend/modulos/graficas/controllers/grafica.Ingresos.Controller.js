import pool from "../../usuarios/database/Conexion.js";

export const obtenerDatosGraficaIngresos = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        fecha::date AS fecha, 
        SUM(total) AS total_ventas
      FROM venta_venta
      GROUP BY fecha::date
      ORDER BY fecha::date ASC
    `);

    const datos = result.rows.map(row => ({
      fecha: row.fecha.toISOString().split('T')[0], 
      total: parseFloat(row.total_ventas)
    }));

    res.status(200).json({
      message: "Datos de ingresos diarios para gráfica",
      total: datos.length,
      ingresos: datos
    });

  } catch (error) {
    console.error('Error obteniendo datos de gráfica de ingresos:', error);
    res.status(500).json({
      message: 'Error al obtener datos para gráfica',
      error: error.message
    });
  }
};
