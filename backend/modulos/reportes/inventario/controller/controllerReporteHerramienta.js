import PDFDocument from 'pdfkit';
import pool from '../../../usuarios/database/Conexion.js';

export const generarReporteHerramientasPDF = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;
    let sql = `
      SELECT 
        id,
        nombre,
        descripcion,
        cantidad,
        estado,
        activo,
        TO_CHAR(fecha_registro, 'YYYY-MM-DD') AS fecha_registro,
        precio
      FROM herramientas_herramienta
    `;
    const values = [];

    if (fecha_inicio && fecha_fin) {
      sql += ` WHERE fecha_registro BETWEEN $1 AND $2`;
      values.push(fecha_inicio, fecha_fin);
    }

    const result = await pool.query(sql, values);
    const herramientas = result.rows;

    const doc = new PDFDocument({ margin: 30, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte_herramientas.pdf"');

    doc.pipe(res);

    doc.fontSize(16).text('Informe de Herramientas Registradas', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text('1. Objetivo');
    doc.fontSize(10).text(
      'Este documento presenta un listado completo de las herramientas registradas en el sistema, incluyendo su nombre, descripción, cantidad, estado, activo, fecha de registro y precio.',
      { align: 'justify' }
    );

    doc.moveDown();
    doc.fontSize(12).text('2. Detalle de Herramientas');
    doc.moveDown(0.5);

    const tableTop = doc.y;
    const rowHeight = 30;
    const colWidths = [50, 80, 90, 50, 70, 50, 70, 60];
    const colTitles = [
      'ID',
      'Nombre',
      'Descripción',
      'Cantidad',
      'Estado',
      'Activo',
      'Fecha Registro',
      'Precio'
    ];

    if (colWidths.length !== colTitles.length) {
      throw new Error('El número de anchos de columna no coincide con los títulos');
    }

    const colPositions = [];
    let currentX = 30;
    for (let i = 0; i < colWidths.length; i++) {
      colPositions.push(currentX);
      currentX += colWidths[i];
    }

    doc.font('Helvetica-Bold').fontSize(8);
    colTitles.forEach((title, i) => {
      const x = colPositions[i];
      if (isNaN(x) || isNaN(colWidths[i])) {
        console.error('Valores inválidos para encabezado:', { x, width: colWidths[i] });
        throw new Error('Valores inválidos en la configuración de la tabla');
      }
      doc.rect(x, tableTop, colWidths[i], rowHeight).stroke();
      doc.text(title, x + 3, tableTop + 3, { width: colWidths[i] - 6, align: 'center' });
    });

    doc.font('Helvetica').fontSize(7);
    herramientas.forEach((herramienta, i) => {
      const y = tableTop + rowHeight * (i + 1);
      const values = [
        String(herramienta.id || 'N/A'),
        herramienta.nombre || 'N/A',
        herramienta.descripcion || 'N/A',
        String(herramienta.cantidad || '0'),
        herramienta.estado || 'N/A',
        herramienta.activo ? 'Sí' : 'No',
        herramienta.fecha_registro || 'N/A',
        `$${parseFloat(herramienta.precio || 0).toFixed(2)}`
      ];

      if (values.length !== colWidths.length) {
        console.error('Valores de fila no coinciden con columnas:', values);
        return;
      }

      values.forEach((text, j) => {
        if (j >= colWidths.length) {
          console.error('Índice fuera de rango:', j);
          return;
        }
        const x = colPositions[j];
        if (isNaN(x) || isNaN(y) || isNaN(colWidths[j]) || isNaN(rowHeight)) {
          console.error('Parámetro inválido en doc.rect:', { x, y, width: colWidths[j], height: rowHeight });
          return;
        }
        doc.rect(x, y, colWidths[j], rowHeight).stroke();
        doc.text(text, x + 3, y + 3, { width: colWidths[j] - 6, lineBreak: true });
      });
    });

    const summaryY = tableTop + rowHeight * (herramientas.length + 2);
    doc.moveDown();
    doc.fontSize(12).text('3. Resumen General', 30, summaryY);
    doc.fontSize(10).text(
      `Se encontraron ${herramientas.length} herramientas registradas en el sistema.`,
      { align: 'justify' }
    );

    doc.end();
  } catch (error) {
    console.error('Error al generar PDF de herramientas:', error);
    res.status(500).json({ message: 'Error al generar el reporte PDF de herramientas' });
  }
};