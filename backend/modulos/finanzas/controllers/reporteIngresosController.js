import pool from "../../usuarios/database/Conexion.js";
import PDFDocument from 'pdfkit';

export const generarReporteIngresosTotales = async (req, res) => {
  try {
    const { rows: ventas } = await pool.query(`
      SELECT v.*, c.nombre AS nombre_producto
      FROM venta_venta v
      JOIN cultivos_cultivo c ON v.producto_id = c.id
      ORDER BY v.fecha DESC
    `);

    const doc = new PDFDocument();
    const fechaGeneracion = new Date().toISOString().split('T')[0];

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=reporte_ingresos_${fechaGeneracion}.pdf`);

    doc.pipe(res);

    doc.fontSize(12).text('Centro de Gestión y Desarrollo Sostenible Surcolombiano', { align: 'left' });
    doc.text('SENA - Yamboró', { align: 'left' });
    doc.text('Página 1 de 1', { align: 'right' });
    doc.moveDown();

    doc.fontSize(14).text('Reporte de Ingresos Totales', { align: 'center', underline: true });
    doc.moveDown();

    doc.fontSize(12).text('1. Objetivo', { underline: true });
    doc.text(
      'Este documento presenta un resumen de los ingresos obtenidos por ventas registradas en el sistema. El objetivo es visualizar de forma clara y precisa los ingresos generados en el periodo evaluado.',
      { align: 'justify' }
    );
    doc.moveDown();

    doc.fontSize(12).text('2. Detalle de Ingresos', { underline: true });
    doc.moveDown();

    const table = {
      headers: ['Fecha', 'Producto', 'Cantidad', 'Precio', 'Total'],
      rows: ventas.map(v => [
        new Date(v.fecha).toISOString().split("T")[0],
        v.nombre_producto,
        v.cantidad.toString(),
        `$${parseFloat(v.precio).toFixed(2)}`,
        `$${parseFloat(v.total).toFixed(2)}`
      ])
    };

    const startX = 50;
    let startY = doc.y;
    const cellPadding = 5;
    const colWidths = [80, 130, 80, 80, 80];

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

    const totalIngresos = ventas.reduce((acc, v) => acc + parseFloat(v.total), 0);
    const totalCantidad = ventas.reduce((acc, v) => acc + parseFloat(v.cantidad), 0);

    doc.text(
      `Total de registros de venta: ${ventas.length}.\n` +
      `Cantidad total vendida: ${totalCantidad} unidades.\n` +
      `Ingreso total generado: $${totalIngresos.toFixed(2)}.`,
      { width: 700, align: 'justify' }
    );

    doc.end();
  } catch (error) {
    console.error("Error al generar el reporte de ingresos:", error);
    res.status(500).json({ message: "Error al generar el reporte PDF", error: error.message });
  }
};
