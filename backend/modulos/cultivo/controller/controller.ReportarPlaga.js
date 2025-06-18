import pool from "../../usuarios/database/Conexion.js";

const notificarCambioEstadoPlaga = async (reporte) => {
  console.log(`Notificación: Reporte ${reporte.id} cambiado a estado ${reporte.estado}`);
};

export const revisarReportePlaga = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `UPDATE "ReportePlaga_reporteplaga" SET estado = $1 WHERE id = $2 RETURNING *`;
    const result = await pool.query(sql, ['RE', id]);
    
    if (result.rowCount > 0) {
      await notificarCambioEstadoPlaga(result.rows[0]);
      return res.status(200).json({ message: "Reporte marcado como revisado" });
    }
    return res.status(404).json({ message: "Reporte no encontrado" });
  } catch (error) {
    console.error('Error en revisarReportePlaga:', error);
    return res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};

export const atenderReportePlaga = async (req, res) => {
  try {
    const { id } = req.params;
    const sql =  `UPDATE "ReportePlaga_reporteplaga" SET estado = $1 WHERE id = $2 RETURNING *`;
    const result = await pool.query(sql, ['AT', id]);
    
    if (result.rowCount > 0) {
      await notificarCambioEstadoPlaga(result.rows[0]);
      return res.status(200).json({ message: "Reporte marcado como atendido" });
    }
    return res.status(404).json({ message: "Reporte no encontrado" });
  } catch (error) {
    console.error('Error en atenderReportePlaga:', error);
    return res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};

export const postReportePlaga = async (req, res) => {
  try {
    const { plaga_id, bancal_id, observaciones } = req.body;
    
    if ( !plaga_id || !bancal_id || !observaciones) {
      return res.status(400).json({ message: "Todos los campos son requeridos" });
    }
    
    const sql = `
      INSERT INTO "ReportePlaga_reporteplaga" 
      (plaga_id, bancal_id, fecha_reporte, observaciones, estado) 
      VALUES ($1, $2, NOW(), $3, 'PE') 
      RETURNING id, plaga_id, bancal_id, fecha_reporte, observaciones, estado
    `;
    const result = await pool.query(sql, [plaga_id, bancal_id, observaciones]);
    
    if (result.rows.length > 0) {
      return res.status(201).json({
        message: "Reporte de plaga registrado correctamente",
        id: result.rows[0].id
      });
    }
    return res.status(400).json({ message: "No se pudo registrar el reporte de plaga" });
  } catch (error) {
    console.error('Error en postReportePlaga:', error);
    return res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};

export const getReportesPlaga = async (req, res) => {
  try {
    const sql = `
      SELECT rp.id, rp.plaga_id, rp.bancal_id, 
             rp.fecha_reporte, rp.observaciones, rp.estado,
             p.nombre AS plaga_nombre, 
             b.nombre AS bancal_nombre
      FROM "ReportePlaga_reporteplaga" rp
      LEFT JOIN plagas_plaga p ON rp.plaga_id = p.id
      LEFT JOIN bancal_bancal b ON rp.bancal_id = b.id
      ORDER BY rp.fecha_reporte DESC
    `;
    const result = await pool.query(sql);
    
    const transformedData = result.rows.map(row => ({
      id: row.id,
      plaga_id: { id: row.plaga_id, nombre: row.plaga_nombre },
      bancal_id: { id: row.bancal_id, nombre: row.bancal_nombre },
      fecha_reporte: row.fecha_reporte,
      observaciones: row.observaciones,
      estado: row.estado
    }));
    
    return res.status(200).json(transformedData);
  } catch (error) {
    console.error('Error en getReportesPlaga:', error);
    return res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};

export const getIdReportePlaga = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `
      SELECT rp.id, rp.usuario_id, rp.plaga_id, rp.bancal_id, 
             rp.fecha_reporte, rp.observaciones, rp.estado,
             u.nombre AS usuario_nombre, p.nombre AS plaga_nombre,
             b.nombre AS bancal_nombre
      FROM reporteplaga_reporteplaga rp
      LEFT JOIN usuarios_usuarios u ON rp.usuario_id = u.id
      LEFT JOIN plaga_plaga p ON rp.plaga_id = p.id
      LEFT JOIN bancal_bancal b ON rp.bancal_id = b.id
      WHERE rp.id = $1
    `;
    const result = await pool.query(sql, [id]);
    
    if (result.rows.length > 0) {
      return res.status(200).json(result.rows[0]);
    } else {
      return res.status(404).json({ message: "Reporte de plaga no encontrado" });
    }
  } catch (error) {
    console.error('Error en getIdReportePlaga:', error);
    return res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};

export const updateReportePlaga = async (req, res) => {
  try {
    const { id } = req.params;
    const { plaga_id, bancal_id, observaciones } = req.body;
    
    if (!plaga_id || !bancal_id || !observaciones) {
      return res.status(400).json({ message: "Todos los campos son requeridos" });
    }
    
    const sql = `
      UPDATE reporteplaga_reporteplaga 
      SET plaga_id = $1, bancal_id = $2, observaciones = $3
      WHERE id = $4
    `;
    const result = await pool.query(sql, [plaga_id, bancal_id, observaciones, id]);
    
    if (result.rowCount > 0) {
      return res.status(200).json({ message: "Reporte de plaga actualizado correctamente" });
    }
    return res.status(404).json({ message: "No se pudo actualizar el reporte de plaga" });
  } catch (error) {
    console.error('Error en updateReportePlaga:', error);
    return res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};

export const deleteReportePlaga = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "DELETE FROM reporteplaga_reporteplaga WHERE id = $1";
    const result = await pool.query(sql, [id]);
    
    if (result.rowCount > 0) {
      return res.status(200).json({ message: "Reporte de plaga eliminado correctamente" });
    }
    return res.status(404).json({ message: "No se pudo eliminar el reporte de plaga" });
  } catch (error) {
    console.error('Error en deleteReportePlaga:', error);
    return res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};