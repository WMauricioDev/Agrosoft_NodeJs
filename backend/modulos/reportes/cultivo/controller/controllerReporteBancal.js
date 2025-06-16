import PDFDocument from 'pdfkit';
import pool from '../../../usuarios/database/Conexion.js';

export const generarReporteBancalesPDF = async (req, res) => {
  try {
    const sql = `
      SELECT 
        b.id,
        b.nombre,
        b.tam_x,
        b.tam_y,
        b.latitud,
        b.longitud,
        l.nombre AS lote_nombre
      FROM bancal_bancal b
      LEFT JOIN lotes_lote l ON b.lote_id = l.id
    `;

    const result = await pool.query(sql);
    const bancales = result.rows;

    const doc = new PDFDocument({ margin: 40 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte_bancales.pdf"');

    doc.pipe(res);

    doc.fontSize(18).text('Informe de Bancales Registrados', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text('1. Objetivo');
    doc.fontSize(10).text(
      'Este documento presenta un listado completo de los bancales registrados en el sistema, incluyendo dimensiones, ubicación geográfica y el lote al que pertenecen.',
      { align: 'justify' }
    );

    doc.moveDown();
    doc.fontSize(12).text('2. Detalle de Bancales');
    doc.moveDown(0.5);

    const tableTop = doc.y;
    const rowHeight = 20;

const colWidths = [100, 70, 70, 100, 100, 70]; 
const colTitles = ['Nombre', 'Tamaño X', 'Tamaño Y', 'Latitud', 'Longitud', 'Lote'];

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
bancales.forEach((b, i) => {
  const y = tableTop + rowHeight * (i + 1);
  const values = [
    b.nombre,
    String(b.tam_x),
    String(b.tam_y),
    String(b.latitud),
    String(b.longitud),
    b.lote_nombre || 'Sin lote',
  ];

  values.forEach((text, j) => {
    const x = colPositions[j];
    doc.rect(x, y, colWidths[j], rowHeight).stroke();
    doc.text(text, x + 5, y + 5, { width: colWidths[j] - 10 });
  });
});

    // Resumen
    const summaryY = tableTop + rowHeight * (bancales.length + 2);
    doc.moveDown();
    doc.fontSize(12).text('3. Resumen General', 50, summaryY);
    doc.fontSize(10).text(
      `Se encontraron ${bancales.length} bancales registrados en el sistema.`,
      { align: 'justify' }
    );

    doc.end();
  } catch (error) {
    console.error('Error al generar PDF de bancales:', error);
    res.status(500).json({ message: 'Error al generar el reporte PDF de bancales' });
  }
};
