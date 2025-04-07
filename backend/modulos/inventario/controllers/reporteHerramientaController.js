import pool from "../../usuarios/database/Conexion.js";
import PDFDocument from 'pdfkit';

export const generarReporteHerramientasActivas = async (req, res) => {
  try {
    const { rows: herramientas } = await pool.query(`
      SELECT * 
      FROM herramientas_herramienta 
      WHERE activo = true 
      ORDER BY id DESC
    `);

    const doc = new PDFDocument();
    const fechaGeneracion = new Date().toISOString().split('T')[0];

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=reporte_herramientas_disponibles_${fechaGeneracion}.pdf`);

    doc.pipe(res);

    doc.fontSize(12).text('Centro de gestión y desarrollo sostenible surcolombiano', { align: 'left' });
    doc.text(`SENA - YAMBORO`, { align: 'left' });
    doc.text(`Página 1 de 1`, { align: 'right' });
    doc.moveDown();

    doc.fontSize(14).text('Informe de Herramientas disponibles', { align: 'center', underline: true });
    doc.moveDown();

    doc.fontSize(12).text('1. Objetivo', { underline: true });
    doc.text(
      'Este documento presenta un resumen detallado de las herramientas disponibles registradas en el sistema. El objetivo es proporcionar información clave para el análisis del inventario y la toma de decisiones operativas.',
      { align: 'justify' }
    );
    doc.moveDown();

    doc.fontSize(12).text('2. Detalle de Herramientas disponibles', { underline: true });
    doc.moveDown();

    const table = {
      headers: ['Nombre', 'Descripción', 'Cantidad', 'Estado', 'Fecha Reg'],
      rows: herramientas.map(h => [
        h.nombre,
        h.descripcion || '-',
        h.cantidad.toString(),
        h.estado || '-',
        new Date(h.fecha_registro).toISOString().split('T')[0]
      ])
    };

    const startX = 50;
    let startY = doc.y;
    const cellPadding = 5;
    const colWidths = [100, 160, 70, 80, 100];

    doc.font('Helvetica-Bold');
    let x = startX;
    table.headers.forEach((header, i) => {
      doc.rect(x, startY, colWidths[i], 20).stroke();
      doc.text(header, x + cellPadding, startY + cellPadding, {
        width: colWidths[i] - cellPadding * 2,
        align: 'left'
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
          align: 'left'
        });
        x += colWidths[i];
      });

      startY += maxHeight;
    });

    doc.moveDown(2);
    doc.x = startX;

    doc.fontSize(12).text('3. Resumen General', { underline: true });

    doc.text(
      `Total de herramientas disponibles registradas: ${herramientas.length}.\n` +
      `Cantidad total de herramientas disponibles en inventario: ${herramientas.reduce((acc, h) => acc + parseFloat(h.cantidad), 0)} unidades.`,
      { width: 700, align: 'justify' }
    );

    doc.end();
  } catch (error) {
    console.error("Error al generar el reporte de herramientas disponibles:", error);
    res.status(500).json({ message: "Error al generar el reporte PDF", error: error.message });
  }
};
