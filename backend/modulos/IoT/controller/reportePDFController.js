import pool from '../../usuarios/database/Conexion.js';
import { format } from 'date-fns';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

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

export const generarReportePDFMeteorologico = async (req, res) => {
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

    // Crear PDF
    const doc = new PDFDocument();
    const pdfPath = path.resolve('reporte_datos_meteorologicos.pdf');
    const stream = fs.createWriteStream(pdfPath);

    doc.pipe(stream);

    // Encabezado
    doc.fontSize(12).text('Agrosoft - Reporte de Datos Meteorológicos', { align: 'center' });
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, { align: 'right' });
    doc.moveDown(1);

    // Objetivo
    doc.fontSize(10).text('1. Objetivo', { underline: true });
    doc.text(
      'Este documento detalla los datos meteorológicos históricos registrados en el sistema, ' +
      'facilitando el análisis de las condiciones ambientales para la gestión de cultivos.'
    );
    doc.moveDown();

    // Tabla de datos
    doc.text('2. Registro de Datos Meteorológicos (Últimos 100 Registros)', { underline: true });

    const tableData = [
      ['ID', 'Sensor', 'Bancal', 'Temp (°C)', 'Hum (%)', 'Fecha'],
    ];

    data.forEach(row => {
      tableData.push([
        row.id.toString(),
        row.sensor_nombre || 'N/A',
        row.bancal_nombre || 'N/A',
        row.temperatura != null ? row.temperatura.toFixed(2) : 'N/A',
        row.humedad_ambiente != null ? row.humedad_ambiente.toFixed(2) : 'N/A',
        row.fecha_medicion ? format(new Date(row.fecha_medicion), 'yyyy-MM-dd HH:mm') : 'N/A',
      ]);
    });

    const tableTop = doc.y;
    const columnWidths = [50, 100, 100, 80, 80, 120];
    const rowHeight = 20;

    tableData.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        doc.font(rowIndex === 0 ? 'Helvetica-Bold' : 'Helvetica')
          .text(cell, 50 + columnWidths.slice(0, colIndex).reduce((sum, w) => sum + w, 0), tableTop + rowIndex * rowHeight, {
            width: columnWidths[colIndex],
            align: 'center',
          });
      });
    });

    doc.moveDown(2);

    // Promedios diarios
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

    doc.text('3. Promedios Diarios', { underline: true });
    const dailyTableData = [
      ['Fecha', 'Temp Prom (°C)', 'Hum Prom (%)'],
    ];

    dailyAverages.forEach(row => {
      dailyTableData.push([
        row.date.toISOString().split('T')[0],
        row.avg_temp != null ? parseFloat(row.avg_temp).toFixed(2) : 'N/A',
        row.avg_hum != null ? parseFloat(row.avg_hum).toFixed(2) : 'N/A',
      ]);
    });

    const dailyTableTop = doc.y;
    dailyTableData.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        doc.font(rowIndex === 0 ? 'Helvetica-Bold' : 'Helvetica')
          .text(cell, 50 + columnWidths.slice(0, colIndex).reduce((sum, w) => sum + w, 0), dailyTableTop + rowIndex * rowHeight, {
            width: columnWidths[colIndex],
            align: 'center',
          });
      });
    });

    doc.moveDown(2);

    // Resumen general
    doc.text('4. Resumen General', { underline: true });
    const overallAvgSql = `
      SELECT 
        AVG(temperatura) AS avg_temp,
        AVG(humedad_ambiente) AS avg_hum
      FROM datos_meteorologicos_datos_metereologicos
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
    `;
    const overallAvgResult = await pool.query(overallAvgSql, params);
    const { avg_temp, avg_hum } = overallAvgResult.rows[0];

    doc.text(
      `Se registraron ${data.length} mediciones en el sistema.\n` +
      `- Temperatura Promedio: ${avg_temp != null ? parseFloat(avg_temp).toFixed(2) : 'N/A'} °C\n` +
      `- Humedad Promedio: ${avg_hum != null ? parseFloat(avg_hum).toFixed(2) : 'N/A'} %`
    );

    doc.end();

    stream.on('finish', () => {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="reporte_datos_meteorologicos.pdf"');
      fs.createReadStream(pdfPath).pipe(res);
      fs.unlink(pdfPath, err => {
        if (err) console.error('Error al eliminar archivo PDF temporal:', err);
      });
    });
  } catch (error) {
    console.error('Error al generar reporte PDF:', error);
    res.status(500).json({ message: 'Error en el sistema' });
  }
};