// reporteDatosHistoricos.js
import PDFDocument from 'pdfkit';
import SVGtoPDF from 'svg-to-pdfkit';
import pool from "../../usuarios/database/Conexion.js";

// Obtener los datos para generar el reporte
export const obtenerDatosParaReporte = async (fecha_inicio, fecha_fin, fk_sensor) => {
  try {
    let sql = `
      SELECT 
        id,
        fk_sensor_id AS fk_sensor,
        fk_bancal_id AS fk_bancal,
        temperature,
        humidity,
        fecha_medicion
      FROM datos_meteorologicos_datos_metereologicos
      WHERE fecha_medicion BETWEEN $1 AND $2`;

    const params = [fecha_inicio, fecha_fin];

    if (fk_sensor) {
      sql += ` AND fk_sensor_id = $${params.length + 1}`;
      params.push(fk_sensor);
    }

    sql += ` ORDER BY fecha_medicion DESC`;

    const result = await pool.query(sql, params);
    return result.rows.length > 0 ? result.rows : null;
  } catch (error) {
    console.error("Error al obtener los datos para el reporte:", error.message);
    throw new Error("Error al obtener los datos para el reporte");
  }
};

// Generar el reporte PDF
export const generarReporteDatosHistoricos = async (req, res) => {
  try {
    let { fecha_inicio, fecha_fin, fk_sensor } = req.body;

    // Si no se proporciona, usar fechas por defecto
    const hoy = new Date();
    const hace30Dias = new Date();
    hace30Dias.setDate(hoy.getDate() - 30);

    if (!fecha_inicio) {
      fecha_inicio = hace30Dias.toISOString().split('T')[0];
    }

    if (!fecha_fin) {
      fecha_fin = hoy.toISOString().split('T')[0];
    }

    const datosHistoricos = await obtenerDatosParaReporte(fecha_inicio, fecha_fin, fk_sensor);

    if (!datosHistoricos) {
      return res.status(404).json({ message: "No se encontraron datos históricos para el rango de fechas especificado" });
    }

    const doc = new PDFDocument();
    const fechaGeneracion = new Date().toISOString().split('T')[0];

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=reporte_datos_historicos_${fechaGeneracion}.pdf`);
    doc.pipe(res);

    // Encabezado
    doc.fontSize(12).text('Sistema de Monitoreo IoT - Agrosoft', { align: 'left' });
    doc.text(`Reporte Generado el ${fechaGeneracion}`, { align: 'left' });
    doc.text(`Página 1 de 1`, { align: 'right' });
    doc.moveDown();

    // Título
    doc.fontSize(14).text('Informe de Datos Históricos de Sensores', { align: 'center', underline: true });
    doc.moveDown();

    // Objetivo
    doc.fontSize(12).text('1. Objetivo', { underline: true });
    doc.text(
      `Este documento presenta un resumen detallado de los datos históricos registrados por los sensores entre ${fecha_inicio} y ${fecha_fin}, incluyendo temperatura, humedad y fechas de medición.`,
      { align: 'justify' }
    );
    doc.moveDown();

    // Detalle de los datos
    doc.fontSize(12).text('2. Detalle de Datos Históricos', { underline: true });
    doc.moveDown();

    const table = {
      headers: ['ID', 'Sensor', 'Temp (°C)', 'Humedad (%)', 'Fecha'],
      rows: datosHistoricos.map(dato => [
        dato.id != null ? dato.id.toString() : 'N/A',
        dato.fk_sensor != null ? dato.fk_sensor.toString() : 'N/A',
        dato.temperature != null ? dato.temperature.toString() : 'N/A',
        dato.humidity != null ? dato.humidity.toString() : 'N/A',
        dato.fecha_medicion ? new Date(dato.fecha_medicion).toISOString().split('T')[0] : 'N/A',
      ]),
    };

    const startX = 50;
    let startY = doc.y;
    const cellPadding = 5;
    const colWidths = [50, 120, 90, 90, 100];

    doc.font('Helvetica-Bold');
    let x = startX;
    table.headers.forEach((header, i) => {
      doc.rect(x, startY, colWidths[i], 20).stroke();
      doc.text(header, x + cellPadding, startY + cellPadding, {
        width: colWidths[i] - cellPadding * 2,
        align: 'left',
      });
      x += colWidths[i];
    });

    doc.font('Helvetica');
    startY += 20;
    table.rows.forEach(row => {
      let maxHeight = 0;
      x = startX;

      row.forEach((cell, i) => {
        const height = doc.heightOfString(cell, { width: colWidths[i] - cellPadding * 2 }) + cellPadding * 2;
        if (height > maxHeight) maxHeight = height;
      });

      row.forEach((cell, i) => {
        doc.rect(x, startY, colWidths[i], maxHeight).stroke();
        doc.text(cell, x + cellPadding, startY + cellPadding, {
          width: colWidths[i] - cellPadding * 2,
          align: 'left',
        });
        x += colWidths[i];
      });

      startY += maxHeight;
    });

    doc.moveDown(2);

    // Resumen general
    const total = datosHistoricos.length;
    const promedioTemp =
      total > 0
        ? (datosHistoricos.reduce((sum, d) => sum + (d.temperature || 0), 0) / total).toFixed(2)
        : 'N/A';
    const promedioHumedad =
      total > 0
        ? (datosHistoricos.reduce((sum, d) => sum + (d.humidity || 0), 0) / total).toFixed(2)
        : 'N/A';

    doc.fontSize(12).text('3. Resumen General', { underline: true });
    doc.text(
      `Se registran un total de ${total} mediciones.\n` +
      `Temperatura promedio: ${promedioTemp}°C \n` +
      `Humedad promedio: ${promedioHumedad}%`,
      {
        width: 700,
        align: 'justify'
      }
    );

    doc.end();
  } catch (error) {
    console.error("Error al generar el reporte de datos históricos:", error);
    res.status(500).json({ message: "Error al generar el reporte PDF", error: error.message });
  }
};
