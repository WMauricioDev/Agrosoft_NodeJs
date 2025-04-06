import pool from "../../usuarios/database/Conexion.js";

export const postSensores = async (req, res) => {
  try {
    const { nombre, tipo_sensor, unidad_medida, medida_minima, medida_maxima, descripcion } = req.body;
    const sql = `
      INSERT INTO sensores_sensores 
      (nombre, tipo_sensor, unidad_medida, medida_minima, medida_maxima, descripcion)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`;
    const result = await pool.query(sql, [
      nombre,
      tipo_sensor,
      unidad_medida,
      medida_minima,
      medida_maxima,
      descripcion || null
    ]);

    if (result.rows.length > 0) {
      return res.status(201).json({
        message: "Sensor registrado correctamente",
        id: result.rows[0].id
      });
    }
    return res.status(400).json({ message: "No se pudo registrar el sensor" });
  } catch (error) {
    console.error("Error en postSensores:", error.message);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const getSensores = async (req, res) => {
  try {
    const sql = `
      SELECT 
        id,
        nombre,
        tipo_sensor,
        unidad_medida,
        medida_minima AS medida_min,
        medida_maxima AS medida_max,
        descripcion
      FROM sensores_sensores`;
    const result = await pool.query(sql);

    if (result.rows.length > 0) {
      return res.status(200).json(result.rows);
    }
    return res.status(404).json({ message: "No hay registros de sensores" });
  } catch (error) {
    console.error("Error en getSensores:", error.message);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const getSensorById = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `
      SELECT 
        id,
        nombre,
        tipo_sensor,
        unidad_medida,
        medida_minima AS medida_min,
        medida_maxima AS medida_max,
        descripcion
      FROM sensores_sensores
      WHERE id = $1`;
    const result = await pool.query(sql, [id]);

    if (result.rows.length > 0) {
      return res.status(200).json(result.rows[0]);
    }
    return res.status(404).json({ message: "Sensor no encontrado" });
  } catch (error) {
    console.error("Error en getSensorById:", error.message);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const updateSensores = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, tipo_sensor, unidad_medida, medida_minima, medida_maxima, descripcion } = req.body;
    const sql = `
      UPDATE sensores_sensores 
      SET nombre = $1, tipo_sensor = $2, unidad_medida = $3, medida_minima = $4, medida_maxima = $5, descripcion = $6
      WHERE id = $7 RETURNING id`;
    const result = await pool.query(sql, [
      nombre,
      tipo_sensor,
      unidad_medida,
      medida_minima,
      medida_maxima,
      descripcion || null,
      id
    ]);

    if (result.rowCount > 0) {
      return res.status(200).json({ message: "Sensor actualizado correctamente" });
    }
    return res.status(404).json({ message: "No se pudo actualizar el sensor" });
  } catch (error) {
    console.error("Error en updateSensores:", error.message);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const deleteSensores = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `
      DELETE FROM sensores_sensores 
      WHERE id = $1 RETURNING id`;
    const result = await pool.query(sql, [id]);

    if (result.rowCount > 0) {
      return res.status(200).json({ message: "Sensor eliminado correctamente" });
    }
    return res.status(404).json({ message: "No se pudo eliminar el sensor" });
  } catch (error) {
    console.error("Error en deleteSensores:", error.message);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};