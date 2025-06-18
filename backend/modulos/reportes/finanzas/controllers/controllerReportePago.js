import PDFDocument from 'pdfkit';
import pool from '../../../usuarios/database/Conexion.js';

export const generarReportePagosPDF = async (req, res) => {
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

    // Adjust fecha_fin to include the entire end day
    const fechaFinAdjusted = new Date(fecha_fin);
    fechaFinAdjusted.setDate(fechaFinAdjusted.getDate() + 1);
    const fechaFinStr = fechaFinAdjusted.toISOString().split('T')[0];

    // Query for distinct months
    const mesesSql = `
      SELECT DISTINCT DATE_TRUNC('month', fecha_calculo) AS mes
      FROM pagos_pago
      WHERE fecha_calculo BETWEEN $1 AND $2
      ORDER BY mes
    `;
    const mesesResult = await pool.query(mesesSql, [fecha_inicio, fechaFinStr]);
    const meses = mesesResult.rows;

    // Query for total transactions and sum
    const resumenSql = `
      SELECT 
        COUNT(*) AS total_transacciones,
        COALESCE(SUM(total_pago), 0) AS ingresos_totales
      FROM pagos_pago
      WHERE fecha_calculo BETWEEN $1 AND $2
    `;
    const resumenResult = await pool.query(resumenSql, [fecha_inicio, fechaFinStr]);
    const { total_transacciones, ingresos_totales } = resumenResult.rows[0];

    const doc = new PDFDocument({ margin: 40 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte_pagos_por_mes.pdf"');

    doc.pipe(res);

    // Title
    doc.fontSize(18).text('Informe de Pagos por Usuario', { align: 'center' });
    doc.moveDown();

    // 1. Objective
    doc.fontSize(12).text('1. Objetivo', { align: 'left' });
    doc.fontSize(10).text(
      'Este documento presenta un resumen detallado de los pagos registrados en el sistema, incluyendo el nombre de quien realizó el trabajo. El objetivo es proporcionar una visión general de los pagos para facilitar el análisis financiero y la toma de decisiones.',
      { align: 'justify' }
    );

    // 2. Payments by Month
    doc.moveDown();
    doc.fontSize(12).text('2. Pagos por Mes', { align: 'left' });
    doc.moveDown(0.5);

    let tableTop = doc.y;
    const rowHeight = 20;
    const colWidths = [300, 200];
    const colTitles = ['Usuario', 'Total Pagado'];

    for (const mesInfo of meses) {
      const mes = new Date(mesInfo.mes);
      const mesNombre = mes.toLocaleString('es-ES', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase());

      doc.fontSize(12).text(`Mes: ${mesNombre}`, { align: 'left' });
      doc.moveDown(0.5);
      tableTop = doc.y;

      // Query for payments in this month
      const pagosSql = `
        SELECT 
          u.nombre AS usuario_nombre,
          SUM(p.total_pago) AS total_pago
        FROM pagos_pago p
        JOIN usuarios_usuarios u ON p.usuario_id = u.id
        WHERE DATE_TRUNC('month', p.fecha_calculo) = $1
        GROUP BY u.nombre
        ORDER BY total_pago DESC
      `;
      const pagosResult = await pool.query(pagosSql, [mesInfo.mes]);
      const pagos = pagosResult.rows;

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
      doc.font('Helvetica').fontSize(8);
      if (pagos.length > 0) {
        pagos.forEach((pago, i) => {
          const y = tableTop + rowHeight * (i + 1);
          const values = [
            pago.usuario_nombre || 'N/A',
            `$${parseFloat(pago.total_pago).toFixed(2)}`
          ];

          values.forEach((text, j) => {
            const x = colPositions[j];
            doc.rect(x, y, colWidths[j], rowHeight).stroke();
            doc.text(text, x + 5, y + 5, { width: colWidths[j] - 10 });
          });
        });
      } else {
        const y = tableTop + rowHeight;
        doc.text('No hay pagos registrados en este mes.', 50, y + 5);
      }

      tableTop = doc.y + rowHeight * (pagos.length > 0 ? pagos.length + 1 : 2);
      doc.moveDown();
    }

    // 3. General Summary
    doc.fontSize(12).text('3. Resumen General', 50, tableTop);
    doc.fontSize(10).text(
      `Período analizado: ${fecha_inicio} al ${fecha_fin}\n` +
      `Total de transacciones: ${total_transacciones}\n` +
      `Ingresos totales: $${parseFloat(ingresos_totales).toFixed(2)}`,
      { align: 'justify' }
    );

    doc.end();
  } catch (error) {
    console.error('Error al generar PDF de pagos:', error);
    res.status(500).json({ message: 'Error al generar el reporte PDF de pagos' });
  }
};