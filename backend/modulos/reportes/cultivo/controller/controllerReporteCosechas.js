import PDFDocument from 'pdfkit';
import pool from '../../../usuarios/database/Conexion.js';

export const generarReporteCosechasPDF = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    if (!fecha_inicio || !fecha_fin) {
      return res.status(400).json({ message: 'Debes proporcionar fecha_inicio y fecha_fin' });
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(fecha_inicio) || !dateRegex.test(fecha_fin)) {
      return res.status(400).json({ message: 'Formato de fecha inválido (YYYY-MM-DD)' });
    }

    const sql = `
      SELECT 
        c.fecha,
        c.cantidad,
        cult.nombre AS id_cultivo_nombre
      FROM cosechas_cosecha c
      JOIN cultivos_cultivo cult ON c.id_cultivo_id = cult.id
      WHERE c.fecha BETWEEN $1 AND $2
      ORDER BY c.fecha;
    `;

    const result = await pool.query(sql, [fecha_inicio, fecha_fin]);
    const cosechas = result.rows;

    const total_cosechas = cosechas.length;
    const cantidad_total = cosechas.reduce((sum, c) => sum + c.cantidad, 0);
    const promedio_cosecha = total_cosechas > 0 ? cantidad_total / total_cosechas : 0;

    const doc = new PDFDocument({ margin: 40 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte_cosechas.pdf"');

    doc.pipe(res);

    // Title
    doc.fontSize(18).text('Informe de Cosechas', { align: 'center' });
    doc.moveDown();

    // 1. Objective
    doc.fontSize(12).text('1. Objetivo');
    doc.fontSize(10).text(
      'Este documento presenta un resumen detallado de las cosechas registradas en el sistema, incluyendo información sobre cultivos, cantidades recolectadas y fechas de cosecha. El objetivo es proporcionar una visión general del rendimiento agrícola para facilitar la toma de decisiones y el análisis de productividad.',
      { align: 'justify' }
    );

    // 2. Harvest Details
    doc.moveDown();
    doc.fontSize(12).text('2. Detalle de Cosechas');
    doc.moveDown(0.5);

    const tableTop = doc.y;
    const rowHeight = 20;
    const colWidths = [200, 150, 150];
    const colTitles = ['Producto', 'Cantidad', 'Fecha'];
    const colPositions = [];
    let currentX = 50;

    for (let i = 0; i < colWidths.length; i++) {
      colPositions.push(currentX);
      currentX += colWidths[i];
    }

    // Table Headers
    doc.font('Helvetica-Bold').fontSize(10);
    colTitles.forEach((title, i) => {
      const x = colPositions[i];
      doc.rect(x, tableTop, colWidths[i], rowHeight).stroke();
      doc.text(title, x + 5, tableTop + 5, { width: colWidths[i] - 10 });
    });

    // Table Rows
    doc.font('Helvetica');
    cosechas.forEach((cosecha, i) => {
      const y = tableTop + rowHeight * (i + 1);
      const values = [
        cosecha.id_cultivo_nombre,
        String(cosecha.cantidad),
        cosecha.fecha.toISOString().split('T')[0], // Format as YYYY-MM-DD
      ];

      values.forEach((text, j) => {
        const x = colPositions[j];
        doc.rect(x, y, colWidths[j], rowHeight).stroke();
        doc.text(text, x + 5, y + 5, { width: colWidths[j] - 10 });
      });
    });

    // 3. General Summary
    const summaryY = tableTop + rowHeight * (cosechas.length + 2);
    doc.moveDown();
    doc.fontSize(12).text('3. Resumen General', 50, summaryY);
    doc.fontSize(10).text(
      `Durante el período del ${fecha_inicio} al ${fecha_fin}, se registraron ${total_cosechas} cosechas. La cantidad total cosechada fue de ${cantidad_total} unidades, con un promedio de ${promedio_cosecha.toFixed(2)} unidades por cosecha.`,
      { align: 'justify' }
    );

    doc.end();
  } catch (error) {
    console.error('Error al generar PDF de cosechas:', error);
    res.status(500).json({ message: 'Error al generar el reporte PDF de cosechas' });
  }
};