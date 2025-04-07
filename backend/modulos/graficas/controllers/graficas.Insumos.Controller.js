import pool from "../../usuarios/database/Conexion.js";

export const obtenerInsumosProximosAVencer = async (req, res) => {
  try {
    const hoy = new Date();
    const diezDiasDespues = new Date();
    diezDiasDespues.setDate(hoy.getDate() + 10);

    const result = await pool.query(`
      SELECT 
        id,
        nombre,
        descripcion,
        cantidad,
        unidad_medida,
        tipo_empacado,
        fecha_caducidad
      FROM insumos_insumo
      WHERE fecha_caducidad BETWEEN $1 AND $2
      ORDER BY fecha_caducidad ASC
    `, [hoy, diezDiasDespues]);

    res.status(200).json({
      message: "Insumos que vencen en los próximos 10 días",
      total: result.rowCount,
      insumos: result.rows
    });

  } catch (error) {
    console.error('Error obteniendo insumos próximos a vencer:', error);
    res.status(500).json({
      message: 'Error al obtener insumos próximos a vencer'
    });
  }
};
