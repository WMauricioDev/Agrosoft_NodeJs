import pool from '../../usuarios/database/Conexion.js';
import { format } from 'date-fns';

export const registrarDatosMeteorologicos = async (req, res) => {
  try {
    const { fk_sensor_id, fk_bancal_id, temperatura, humedad_ambiente, luminosidad, humedad_suelo, lluvia, ph_suelo, direccion_viento, velocidad_viento, fecha_medicion } = req.body;
    const sql = `
      INSERT INTO datos_meteorologicos_datos_metereologicos (
        fk_sensor_id, fk_bancal_id, temperatura, humedad_ambiente, luminosidad, humedad_suelo, lluvia, ph_suelo, direccion_viento, velocidad_viento, fecha_medicion
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    const { rows, rowCount } = await pool.query(sql, [
      fk_sensor_id, fk_bancal_id, temperatura, humedad_ambiente, luminosidad, humedad_suelo, lluvia, ph_suelo, direccion_viento, velocidad_viento, fecha_medicion || new Date().toISOString()
    ]);

    if (rowCount > 0) {
      res.status(201).json({ message: 'Datos meteorológicos registrados', data: rows[0] });
    } else {
      res.status(400).json({ message: 'Datos meteorológicos no registrados' });
    }
  } catch (error) {
    console.error('Error al registrar datos meteorológicos:', error);
    res.status(500).json({ message: 'Error en el sistema' });
  }
};

export const listarDatosMeteorologicos = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin, fk_bancal_id } = req.query;
    let sql = `
      SELECT dm.*, s.nombre AS sensor_nombre, b.nombre AS bancal_nombre
      FROM datos_meteorologicos_datos_metereologicos dm
      JOIN sensores_sensor s ON dm.fk_sensor_id = s.id
      LEFT JOIN bancal_bancal b ON dm.fk_bancal_id = b.id
    `;
    const params = [];
    let where = [];

    if (fecha_inicio && fecha_fin) {
      where.push('dm.fecha_medicion >= $1 AND dm.fecha_medicion < $2');
      params.push(fecha_inicio, new Date(fecha_fin).setDate(new Date(fecha_fin).getDate() + 1));
    }

    if (fk_bancal_id) {
      where.push(`dm.fk_bancal_id = $${params.length + 1}`);
      params.push(fk_bancal_id);
    }

    if (where.length) {
      sql += ` WHERE ${where.join(' AND ')}`;
    }

    sql += ' ORDER BY dm.fecha_medicion DESC';

    const { rows } = await pool.query(sql, params);

    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(404).json({ message: 'No hay registros de datos meteorológicos' });
    }
  } catch (error) {
    console.error('Error al listar datos meteorológicos:', error);
    res.status(500).json({ message: 'Error en el sistema' });
  }
};

export const obtenerDatosMeteorologicos = async (req, res) => {
  try {
    const id = req.params.id;
    const sql = `
      SELECT dm.*, s.nombre AS sensor_nombre, b.nombre AS bancal_nombre
      FROM datos_meteorologicos_datos_metereologicos dm
      JOIN sensores_sensor s ON dm.fk_sensor_id = s.id
      LEFT JOIN bancal_bancal b ON dm.fk_bancal_id = b.id
      WHERE dm.id = $1
    `;
    const { rows } = await pool.query(sql, [id]);

    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ message: 'Dato meteorológico no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener dato meteorológico:', error);
    res.status(500).json({ message: 'Error en el sistema' });
  }
};

export const generarReporteMeteorologico = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin, fk_bancal_id } = req.query;
    let sql = `
      SELECT 
        dm.id, s.nombre AS sensor_nombre, b.nombre AS bancal_nombre, 
        dm.temperatura, dm.humedad_ambiente, dm.fecha_medicion
      FROM datos_meteorologicos_datos_metereologicos dm
      JOIN sensores_sensor s ON dm.fk_sensor_id = s.id
      LEFT JOIN bancal_bancal b ON dm.fk_bancal_id = b.id
    `;
    const params = [];
    let where = [];

    if (fecha_inicio && fecha_fin) {
      where.push('dm.fecha_medicion >= $1 AND dm.fecha_medicion < $2');
      params.push(fecha_inicio, new Date(fecha_fin).setDate(new Date(fecha_fin).getDate() + 1));
    }

    if (fk_bancal_id) {
      where.push(`dm.fk_bancal_id = $${params.length + 1}`);
      params.push(fk_bancal_id);
    }

    if (where.length) {
      sql += ` WHERE ${where.join(' AND ')}`;
    }

    sql += ' ORDER BY dm.fecha_medicion DESC LIMIT 100';

    const dataResult = await pool.query(sql, params);
    const data = dataResult.rows;

    // Calcular promedios diarios
    const dailyAvgSql = `
      SELECT 
        DATE(fecha_medicion) AS date,
        AVG(temperatura) AS avg_temp,
        AVG(humedad_ambiente) AS avg_hum
      FROM datos_meteorologicos_datos_metereologicos
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      GROUP BY DATE(fecha_medicion)
      ORDER BY date
    `;
    const dailyAvgResult = await pool.query(dailyAvgSql, params);
    const dailyAverages = dailyAvgResult.rows;

    // Calcular promedios generales
    const overallAvgSql = `
      SELECT 
        AVG(temperatura) AS avg_temp,
        AVG(humedad_ambiente) AS avg_hum
      FROM datos_meteorologicos_datos_metereologicos
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
    `;
    const overallAvgResult = await pool.query(overallAvgSql, params);
    const { avg_temp, avg_hum } = overallAvgResult.rows[0];

    if (data.length > 0) {
      res.status(200).json({
        message: 'Reporte generado correctamente',
        data: data.map(d => ({
          id: d.id,
          sensor: d.sensor_nombre || 'N/A',
          bancal: d.bancal_nombre || 'N/A',
          temperatura: d.temperatura != null ? d.temperatura : 'N/A',
          humedad_ambiente: d.humedad_ambiente != null ? d.humedad_ambiente : 'N/A',
          fecha: d.fecha_medicion ? format(new Date(d.fecha_medicion), 'yyyy-MM-dd HH:mm') : 'N/A',
        })),
        daily_averages: dailyAverages.map(d => ({
          fecha: d.date,
          avg_temp: d.avg_temp != null ? parseFloat(d.avg_temp).toFixed(2) : 'N/A',
          avg_hum: d.avg_hum != null ? parseFloat(d.avg_hum).toFixed(2) : 'N/A',
        })),
        summary: {
          total_records: data.length,
          overall_avg_temp: avg_temp != null ? parseFloat(avg_temp).toFixed(2) : 'N/A',
          overall_avg_hum: avg_hum != null ? parseFloat(avg_hum).toFixed(2) : 'N/A',
        },
      });
    } else {
      res.status(404).json({ message: 'No hay datos para el reporte' });
    }
  } catch (error) {
    console.error('Error al generar reporte:', error);
    res.status(500).json({ message: 'Error en el sistema' });
  }
};