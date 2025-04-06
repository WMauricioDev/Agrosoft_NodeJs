import pool from "../../usuarios/database/Conexion.js";

export const postDatoMeteorologico = async (req, res) => {
  try {
    const { fk_sensor_id, fk_bancal_id, temperature, humidity, fecha_medicion } = req.body;
    const sql = `
      INSERT INTO datos_meteorologicos_datos_metereologicos 
      (fk_sensor_id, fk_bancal_id, temperature, humidity, fecha_medicion)
      VALUES ($1, $2, $3, $4, $5) RETURNING id`;
    const result = await pool.query(sql, [
      fk_sensor_id,
      fk_bancal_id || null,
      temperature || null,
      humidity || null,
      fecha_medicion || new Date().toISOString()
    ]);

    if (result.rows.length > 0) {
      return res.status(201).json({
        message: "Dato meteorológico registrado correctamente",
        id: result.rows[0].id
      });
    }
    return res.status(400).json({ message: "No se pudo registrar el dato meteorológico" });
  } catch (error) {
    console.error("Error en postDatoMeteorologico:", error.message);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const getDatosMeteorologicos = async (req, res) => {
  try {
    const { fk_sensor, fecha_medicion__date } = req.query;
    let sql = `
      SELECT 
        id,
        fk_sensor_id AS fk_sensor,
        fk_bancal_id AS fk_bancal,
        temperature,
        humidity,
        fecha_medicion
      FROM datos_meteorologicos_datos_metereologicos`;
    const params = [];
    const conditions = [];

    if (fk_sensor) {
      conditions.push(`fk_sensor_id = $${params.length + 1}`);
      params.push(fk_sensor);
    }
    if (fecha_medicion__date) {
      conditions.push(`fecha_medicion::date = $${params.length + 1}`);
      params.push(fecha_medicion__date);
    }
    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }
    sql += " ORDER BY fecha_medicion DESC LIMIT 50";

    const result = await pool.query(sql, params);

    if (result.rows.length > 0) {
      return res.status(200).json(result.rows);
    }
    return res.status(404).json({ message: "No hay registros de datos meteorológicos" });
  } catch (error) {
    console.error("Error en getDatosMeteorologicos:", error.message);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};