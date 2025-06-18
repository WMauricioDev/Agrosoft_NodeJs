import PDFDocument from 'pdfkit';
import pool from '../../../usuarios/database/Conexion.js';

export const generarReportePreciosProductosPDF = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;
    let sql = `
      SELECT 
        pp.id,
        pp.precio,
        TO_CHAR(pp.fecha_registro, 'YYYY-MM-DD') AS fecha_registro,
        pp."Producto_id",
        c.nombre AS nombre_producto,
        CASE 
          WHEN pp.fecha_caducidad IS NOT NULL 
          THEN TO_CHAR(pp.fecha_caducidad, 'YYYY-MM-DD') 
          ELSE 'N/A' 
        END AS fecha_caducidad,
        pp.stock,
        um.nombre AS unidad_medida_nombre
      FROM precios_productos_precio_producto pp
      LEFT JOIN cosechas_cosecha ch ON pp."Producto_id" = ch.id
      LEFT JOIN cultivos_cultivo c ON ch.id_cultivo_id = c.id
      LEFT JOIN unidad_medida_unidadmedida um ON pp.unidad_medida_id = um.id
    `;
    const values = [];

    if (fecha_inicio && fecha_fin) {
      sql += ` WHERE pp.fecha_registro BETWEEN $1 AND $2`;
      values.push(fecha_inicio, fecha_fin);
    }

    const result = await pool.query(sql, values);
    const preciosProductos = result.rows;

    const doc = new PDFDocument({ margin: 30, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte_precios_productos.pdf"');

    doc.pipe(res);

    doc.fontSize(16).text('Informe de Precios de Productos Registrados', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text('1. Objetivo');
    doc.fontSize(10).text(
      'Este documento presenta un listado completo de los precios de productos registrados en el sistema, incluyendo el precio, fecha de registro, producto, fecha de caducidad, stock y unidad de medida.',
      { align: 'justify' }
    );

    doc.moveDown();
    doc.fontSize(12).text('2. Detalle de Precios de Productos');
    doc.moveDown(0.5);

    const tableTop = doc.y;
    const rowHeight = 30;
    const colWidths = [50, 60, 70, 50, 90, 70, 50, 60];
    const colTitles = [
      'ID',
      'Precio',
      'Fecha Registro',
      'ID Producto',
      'Producto',
      'Fecha Caducidad',
      'Stock',
      'Unidad Medida'
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
    preciosProductos.forEach((precioProducto, i) => {
      const y = tableTop + rowHeight * (i + 1);
      const values = [
        String(precioProducto.id || 'N/A'),
        `$${parseFloat(precioProducto.precio || 0).toFixed(2)}`,
        precioProducto.fecha_registro || 'N/A',
        String(precioProducto.Producto_id || 'N/A'),
        precioProducto.nombre_producto || 'Sin producto',
        precioProducto.fecha_caducidad || 'N/A',
        String(precioProducto.stock || '0'),
        precioProducto.unidad_medida_nombre || 'Sin unidad'
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

    const summaryY = tableTop + rowHeight * (preciosProductos.length + 2);
    doc.moveDown();
    doc.fontSize(12).text('3. Resumen General', 30, summaryY);
    doc.fontSize(10).text(
      `Se encontraron ${preciosProductos.length} precios de productos registrados en el sistema.`,
      { align: 'justify' }
    );

    doc.end();
  } catch (error) {
    console.error('Error al generar PDF de precios de productos:', error);
    res.status(500).json({ message: 'Error al generar el reporte PDF de precios de productos' });
  }
};