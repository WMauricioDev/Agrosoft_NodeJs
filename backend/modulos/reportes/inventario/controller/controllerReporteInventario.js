import PDFDocument from 'pdfkit';
import pool from '../../../usuarios/database/Conexion.js';

export const generarReporteInsumosPDF = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;
    let sql = `
      SELECT 
        i.id,
        i.nombre,
        i.descripcion,
        i.cantidad,
        um.nombre AS unidad_medida_nombre,
        ti.nombre AS tipo_insumo_nombre,
        i.activo,
        i.tipo_empacado,
        TO_CHAR(i.fecha_registro, 'YYYY-MM-DD') AS fecha_registro,
        CASE 
          WHEN i.fecha_caducidad IS NOT NULL 
          THEN TO_CHAR(i.fecha_caducidad, 'YYYY-MM-DD') 
          ELSE 'N/A' 
        END AS fecha_caducidad,
        i.precio_insumo
      FROM insumos_insumo i
      LEFT JOIN unidad_medida_unidadmedida um ON i.unidad_medida_id = um.id
      LEFT JOIN insumos_tiposinsumo ti ON i.tipo_insumo_id = ti.id
    `;
    const values = [];

    if (fecha_inicio && fecha_fin) {
      sql += ` WHERE i.fecha_registro BETWEEN $1 AND $2`;
      values.push(fecha_inicio, fecha_fin);
    }

    const result = await pool.query(sql, values);
    const insumos = result.rows;

    const doc = new PDFDocument({ margin: 30, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte_insumos.pdf"');

    doc.pipe(res);

    doc.fontSize(16).text('Informe de Insumos Registrados', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text('1. Objetivo');
    doc.fontSize(10).text(
      'Este documento presenta un listado completo de los insumos registrados en el sistema, incluyendo su nombre, descripción, cantidad, unidad de medida, tipo de insumo, estado, tipo de empaque, fecha de registro, fecha de caducidad y precio.',
      { align: 'justify' }
    );

    doc.moveDown();
    doc.fontSize(12).text('2. Detalle de Insumos');
    doc.moveDown(0.5);

    const tableTop = doc.y;
    const rowHeight = 30;
    const colWidths = [70, 80, 40, 50, 50, 40, 50, 60, 60, 60];
    const colTitles = [
      'Nombre',
      'Descripción',
      'Cantidad',
      'Unidad Medida',
      'Tipo Insumo',
      'Activo',
      'Tipo Empaque',
      'Fecha Registro',
      'Fecha Caducidad',
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
    insumos.forEach((insumo, i) => {
      const y = tableTop + rowHeight * (i + 1);
      const values = [
        insumo.nombre || 'N/A',
        insumo.descripcion || 'N/A',
        String(insumo.cantidad || '0'),
        insumo.unidad_medida_nombre || 'Sin unidad',
        insumo.tipo_insumo_nombre || 'Sin tipo',
        insumo.activo ? 'Sí' : 'No',
        insumo.tipo_empacado || 'N/A',
        insumo.fecha_registro || 'N/A',
        insumo.fecha_caducidad || 'N/A',
        `$${parseFloat(insumo.precio_insumo || 0).toFixed(2)}`
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

    const summaryY = tableTop + rowHeight * (insumos.length + 2);
    doc.moveDown();
    doc.fontSize(12).text('3. Resumen General', 30, summaryY);
    doc.fontSize(10).text(
      `Se encontraron ${insumos.length} insumos registrados en el sistema.`,
      { align: 'justify' }
    );

    doc.end();
  } catch (error) {
    console.error('Error al generar PDF de insumos:', error);
    res.status(500).json({ message: 'Error al generar el reporte PDF de insumos' });
  }
};