import PDFDocument from 'pdfkit';
import pool from '../../../usuarios/database/Conexion.js';

export const generarReportePlagasPDF = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    if (!fecha_inicio || !fecha_fin) {
      return res.status(400).json({ message: 'Debes proporcionar fecha_inicio y fecha_fin' });
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(fecha_inicio) || !dateRegex.test(fecha_fin)) {
      return res.status(400).json({ message: 'Formato de fecha inválido (YYYY-MM-DD)' });
    }

    const sql = `
      SELECT 
        rp.id,
        rp.fecha_reporte,
        rp.observaciones,
        rp.estado,
        p.nombre AS plaga_nombre,
        b.nombre AS bancal_nombre
      FROM "ReportePlaga_reporteplaga" rp
      JOIN plagas_plaga p ON rp.plaga_id = p.id
      JOIN bancal_bancal b ON rp.bancal_id = b.id
      WHERE rp.fecha_reporte BETWEEN $1 AND $2
      ORDER BY rp.fecha_reporte;
    `;

    const result = await pool.query(sql, [fecha_inicio, fecha_fin]);
    const reportes = result.rows;

    const total_reportes = reportes.length;
    const estado_counts = reportes.reduce((acc, r) => {
      acc[r.estado] = (acc[r.estado] || 0) + 1;
      return acc;
    }, { PE: 0, RE: 0, AT: 0 });

    const doc = new PDFDocument({ margin: 40 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte_plagas.pdf"');

    doc.pipe(res);

    doc.fontSize(18).text('Informe de Reportes de Plagas', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text('1. Objetivo');
    doc.fontSize(10).text(
      'Este documento presenta un resumen detallado de los reportes de plagas registrados en el sistema, incluyendo información sobre las plagas identificadas, los bancales afectados, observaciones, estados y fechas de reporte. El objetivo es proporcionar una visión general de la incidencia de plagas para facilitar la toma de decisiones y el manejo fitosanitario.',
      { align: 'justify' }
    );

    doc.moveDown();
    doc.fontSize(12).text('2. Detalle de Reportes de Plagas');
    doc.moveDown(0.5);

    const tableTop = doc.y;
    const rowHeight = 20;
    const colWidths = [100, 100, 100, 150, 100];
    const colTitles = ['ID', 'Plaga', 'Bancal', 'Observaciones', 'Estado'];
    const colPositions = [];
    let currentX = 50;

    for (let i = 0; i < colWidths.length; i++) {
      colPositions.push(currentX);
      currentX += colWidths[i];
    }

    doc.font('Helvetica-Bold').fontSize(10);
    colTitles.forEach((title, i) => {
      const x = colPositions[i];
      doc.rect(x, tableTop, colWidths[i], rowHeight).stroke();
      doc.text(title, x + 5, tableTop + 5, { width: colWidths[i] - 10 });
    });

    doc.font('Helvetica');
    reportes.forEach((reporte, i) => {
      const y = tableTop + rowHeight * (i + 1);
      const estadoText = 
        reporte.estado === 'PE' ? 'Pendiente' :
        reporte.estado === 'RE' ? 'Revisado' :
        reporte.estado === 'AT' ? 'Atendido' : reporte.estado;
      const values = [
        String(reporte.id),
        reporte.plaga_nombre,
        reporte.bancal_nombre,
        reporte.observaciones,
        estadoText
      ];

      values.forEach((text, j) => {
        const x = colPositions[j];
        doc.rect(x, y, colWidths[j], rowHeight).stroke();
        doc.text(text, x + 5, y + 5, { width: colWidths[j] - 10 });
      });
    });

    const summaryY = tableTop + rowHeight * (reportes.length + 2);
    doc.moveDown();
    doc.fontSize(12).text('3. Resumen General', 50, summaryY);
    doc.fontSize(10).text(
      `Durante el período del ${fecha_inicio} al ${fecha_fin}, se registraron ${total_reportes} reportes de plagas. ` +
      `De estos, ${estado_counts.PE} están Pendientes, ${estado_counts.RE} están Revisados y ${estado_counts.AT} están Atendidos.`,
      { align: 'justify' }
    );

    doc.end();
  } catch (error) {
    console.error('Error al generar PDF de reportes de plagas:', error);
    res.status(500).json({ message: 'Error al generar el reporte PDF de plagas' });
  }
};