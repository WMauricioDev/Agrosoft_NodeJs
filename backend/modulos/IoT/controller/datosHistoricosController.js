import pool from '../../usuarios/database/Conexion.js';

export const registrarDatosHistoricos = async (req, res) => {
  try {
    const {
      device_code,
      fk_bancal_id,
      temperatura,
      humedad_ambiente,
      luminosidad,
      lluvia,
      velocidad_viento,
      direccion_viento,
      humedad_suelo,
      ph_suelo,
      fecha_promedio,
      cantidad_mediciones,
    } = req.body;

    if (!device_code) {
      return res.status(400).json({ message: 'device_code es requerido' });
    }

    // Validar sensor por device_code
    const sensorResult = await pool.query(
      'SELECT id FROM sensores_sensor WHERE device_code = $1 AND estado = $2',
      [device_code, 'activo']
    );
    if (sensorResult.rowCount === 0) {
      return res.status(400).json({ message: 'Sensor no existe o está inactivo' });
    }
    const fk_sensor_id = sensorResult.rows[0].id;

    const sql = `
      INSERT INTO datos_meteorologicos_datoshistoricos (
        fk_sensor_id, fk_bancal_id, temperatura, humedad_ambiente, luminosidad, lluvia,
        velocidad_viento, direccion_viento, humedad_suelo, ph_suelo, fecha_promedio,
        cantidad_mediciones
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;
    const values = [
      fk_sensor_id,
      fk_bancal_id || null,
      temperatura != null ? parseFloat(temperatura) : null,
      humedad_ambiente != null ? parseFloat(humedad_ambiente) : null,
      luminosidad != null ? parseFloat(luminosidad) : null,
      lluvia != null ? parseFloat(lluvia) : null,
      velocidad_viento != null ? parseFloat(velocidad_viento) : null,
      direccion_viento != null ? parseFloat(direccion_viento) : null,
      humedad_suelo != null ? parseFloat(humedad_suelo) : null,
      ph_suelo != null ? parseFloat(ph_suelo) : null,
      fecha_promedio,
      cantidad_mediciones != null ? parseInt(cantidad_mediciones) : null,
    ];
    const { rows, rowCount } = await pool.query(sql, values);

    if (rowCount > 0) {
      res.status(201).json({ message: 'Datos históricos registrados', data: rows[0] });
    } else {
      res.status(400).json({ message: 'Datos históricos no registrados' });
    }
  } catch (error) {
    console.error('Error al registrar datos históricos:', error);
    res.status(500).json({ message: 'Error en el sistema' });
  }
};

export const listarDatosHistoricos = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin, fk_bancal_id } = req.query;
    let sql = `
      SELECT dh.*, s.nombre AS sensor_nombre, b.nombre AS bancal_nombre
      FROM datos_meteorologicos_datoshistoricos dh
      JOIN sensores_sensor s ON dh.fk_sensor_id = s.id
      LEFT JOIN bancal_bancal b ON dh.fk_bancal_id = b.id
    `;
    const params = [];
    let where = [];

    if (fecha_inicio && fecha_fin) {
      where.push('dh.fecha_promedio >= $1 AND dh.fecha_promedio < $2');
      params.push(fecha_inicio, new Date(fecha_fin).setDate(new Date(fecha_fin).getDate() + 1));
    }

    if (fk_bancal_id) {
      where.push(`dh.fk_bancal_id = $${params.length + 1}`);
      params.push(fk_bancal_id);
    }

    if (where.length) {
      sql += ` WHERE ${where.join(' AND ')}`;
    }

    sql += ' ORDER BY dh.fecha_promedio DESC';

    const { rows } = await pool.query(sql, params);

    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(404).json({ message: 'No hay registros de datos históricos' });
    }
  } catch (error) {
    console.error('Error al listar datos históricos:', error);
    res.status(500).json({ message: 'Error en el sistema' });
  }
};