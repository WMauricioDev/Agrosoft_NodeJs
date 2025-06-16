import pool from "../../usuarios/database/Conexion.js";

export const registrarSensor = async (req, res) => {
  try {
    const {
      nombre,
      tipo_sensor_id,
      descripcion,
      bancal_id,
      medida_minima,
      medida_maxima,
      estado,
      device_code,
    } = req.body;

    if (!nombre || !tipo_sensor_id || !device_code) {
      return res.status(400).json({ message: "Nombre, tipo_sensor_id y device_code son requeridos" });
    }

    if (!["activo", "inactivo"].includes(estado)) {
      return res.status(400).json({ message: 'Estado inválido, debe ser "activo" o "inactivo"' });
    }

    const sql = `
      INSERT INTO sensores_sensor (
        nombre, tipo_sensor_id, descripcion, bancal_id, medida_minima, medida_maxima, estado, device_code
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const values = [
      nombre,
      tipo_sensor_id,
      descripcion || null,
      bancal_id || null,
      medida_minima != null ? parseFloat(medida_minima) : null,
      medida_maxima != null ? parseFloat(medida_maxima) : null,
      estado || "activo",
      device_code,
    ];
    const { rows, rowCount } = await pool.query(sql, values);

    if (rowCount > 0) {
      console.log("[registrarSensor] Sensor registrado:", rows[0]);
      res.status(201).json({ message: "Sensor registrado", data: rows[0] });
    } else {
      res.status(400).json({ message: "Sensor no registrado" });
    }
  } catch (error) {
    console.error("[registrarSensor] Error al registrar sensor:", error);
    res.status(500).json({ message: "Error en el sistema" });
  }
};

export const actualizarSensor = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      nombre,
      tipo_sensor_id,
      descripcion,
      bancal_id,
      medida_minima,
      medida_maxima,
      estado,
      device_code,
    } = req.body;

    if (!nombre || !tipo_sensor_id || !device_code) {
      return res.status(400).json({ message: "Nombre, tipo_sensor_id y device_code son requeridos" });
    }

    if (!["activo", "inactivo"].includes(estado)) {
      return res.status(400).json({ message: 'Estado inválido, debe ser "activo" o "inactivo"' });
    }

    const sql = `
      UPDATE sensores_sensor
      SET nombre = $1, tipo_sensor_id = $2, descripcion = $3, bancal_id = $4,
          medida_minima = $5, medida_maxima = $6, estado = $7, device_code = $8
      WHERE id = $9
      RETURNING *
    `;
    const values = [
      nombre,
      tipo_sensor_id,
      descripcion || null,
      bancal_id || null,
      medida_minima != null ? parseFloat(medida_minima) : null,
      medida_maxima != null ? parseFloat(medida_maxima) : null,
      estado || "activo",
      device_code,
      id,
    ];
    const { rows, rowCount } = await pool.query(sql, values);

    if (rowCount > 0) {
      console.log("[actualizarSensor] Sensor actualizado:", rows[0]);
      res.status(200).json({ message: "Sensor actualizado", data: rows[0] });
    } else {
      res.status(404).json({ message: "Sensor no encontrado" });
    }
  } catch (error) {
    console.error("[actualizarSensor] Error al actualizar sensor:", error);
    res.status(500).json({ message: "Error en el sistema" });
  }
};

export const listarSensores = async (req, res) => {
  try {
    const sql = `
      SELECT 
        s.id,
        s.nombre,
        s.tipo_sensor_id,
        s.descripcion,
        s.estado,
        s.bancal_id,
        s.device_code,
        s.medida_minima,
        s.medida_maxima,
        ts.nombre AS tipo_sensor_nombre,
        ts.unidad_medida,
        b.nombre AS bancal_nombre
      FROM sensores_sensor s
      JOIN sensores_tiposensor ts ON s.tipo_sensor_id = ts.id
      LEFT JOIN bancal_bancal b ON s.bancal_id = b.id
    `;
    const { rows } = await pool.query(sql);

    if (rows.length > 0) {
      console.log("[listarSensores] Sensores obtenidos:", rows);
      res.status(200).json(rows);
    } else {
      console.log("[listarSensores] No hay sensores registrados");
      res.status(404).json({ message: "No hay sensores registrados" });
    }
  } catch (error) {
    console.error("[listarSensores] Error al listar sensores:", error);
    res.status(500).json({ message: "Error en el sistema" });
  }
};

export const eliminarSensor = async (req, res) => {
  try {
    const id = req.params.id;
    const sql = "DELETE FROM sensores_sensor WHERE id = $1 RETURNING *";
    const { rows, rowCount } = await pool.query(sql, [id]);

    if (rowCount > 0) {
      console.log("[eliminarSensor] Sensor eliminado:", rows[0]);
      res.status(200).json({ message: "Sensor eliminado", data: rows[0] });
    } else {
      res.status(404).json({ message: "Sensor no encontrado" });
    }
  } catch (error) {
    console.error("[eliminarSensor] Error al eliminar sensor:", error);
    res.status(500).json({ message: "Error en el sistema" });
  }
};

export const obtenerSensor = async (req, res) => {
  try {
    const id = req.params.id;
    const sql = `
      SELECT 
        s.id,
        s.nombre,
        s.tipo_sensor_id,
        s.descripcion,
        s.estado,
        s.bancal_id,
        s.device_code,
        s.medida_minima,
        s.medida_maxima,
        ts.nombre AS tipo_sensor_nombre,
        ts.unidad_medida,
        b.nombre AS bancal_nombre
      FROM sensores_sensor s
      JOIN sensores_tiposensor ts ON s.tipo_sensor_id = ts.id
      LEFT JOIN bancal_bancal b ON s.bancal_id = b.id
      WHERE s.id = $1
    `;
    const { rows } = await pool.query(sql, [id]);

    if (rows.length > 0) {
      console.log("[obtenerSensor] Sensor obtenido:", rows[0]);
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ message: "Sensor no encontrado" });
    }
  } catch (error) {
    console.error("[obtenerSensor] Error al obtener sensor:", error);
    res.status(500).json({ message: "Error en el sistema" });
  }
};