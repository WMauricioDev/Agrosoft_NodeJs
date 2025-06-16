import PDFDocument from 'pdfkit';
import pool from '../../../usuarios/database/Conexion.js';

export const generarReporteCultivosPDF = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    // Build SQL query
    let sql = `
      SELECT 
        c.nombre,
        c."fechaSiembra" AS fecha_siembra,
        c.unidad_de_medida_id,
        e.nombre AS especie_nombre,
        b.nombre AS bancal_nombre
      FROM cultivos_cultivo c
      LEFT JOIN especies_especie e ON c."Especie_id" = e.id
      LEFT JOIN bancal_bancal b ON c."Bancal_id" = b.id
      WHERE c.activo = true
    `;
    const params = [];

    if (fecha_inicio && fecha_fin) {
      // Validate date format (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(fecha_inicio) || !dateRegex.test(fecha_fin)) {
        return res.status(400).json({ message: 'Formato de fecha inválido (YYYY-MM-DD)' });
      }
      sql += ` AND c."fechaSiembra" BETWEEN $1 AND $2`;
      params.push(fecha_inicio, fecha_fin);
    }

    sql += ` ORDER BY c."fechaSiembra"`;

    const result = await pool.query(sql, params);
    const cultivos = result.rows;

    const doc = new PDFDocument({ margin: 40 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte_cultivos_activos.pdf"');

    doc.pipe(res);

    // Title
    doc.fontSize(18).text('Reporte de Cultivos Activos', { align: 'center' });
    doc.moveDown();

    // 1. Objective
    doc.fontSize(12).text('1. Objetivo');
    doc.fontSize(10).text(
      'Este documento presenta un reporte detallado de los cultivos activos registrados en el sistema, incluyendo información clave para la gestión agrícola como especies, ubicación, fechas de siembra y estado actual.',
      { align: 'justify' }
    );

    // 2. General Summary
    doc.moveDown();
    doc.fontSize(12).text('2. Resumen General');
    doc.fontSize(10).text(
      `Total de cultivos activos: ${cultivos.length}\n` +
      `Rango de fechas: ${fecha_inicio || 'No especificado'} a ${fecha_fin || 'No especificado'}`,
      { align: 'justify' }
    );

    // 3. Crop Details
    doc.moveDown();
    doc.fontSize(12).text('3. Detalle de Cultivos Activos');
    doc.moveDown(0.5);

    const tableTop = doc.y;
    const rowHeight = 20;
    const colWidths = [100, 100, 100, 100, 100];
    const colTitles = ['Nombre', 'Especie', 'Bancal', 'Fecha Siembra', 'Unidad Medida'];
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
    cultivos.forEach((cultivo, i) => {
      const y = tableTop + rowHeight * (i + 1);
      const values = [
        cultivo.nombre || 'N/A',
        cultivo.especie_nombre || 'N/A',
        cultivo.bancal_nombre || 'N/A',
        cultivo.fecha_siembra.toISOString().split('T')[0],
        cultivo.unidad_de_medida_id || 'N/A'
      ];

      values.forEach((text, j) => {
        const x = colPositions[j];
        doc.rect(x, y, colWidths[j], rowHeight).stroke();
        doc.text(text, x + 5, y + 5, { width: colWidths[j] - 10 });
      });
    });

    // 4. Additional Information
    const additionalInfoY = tableTop + rowHeight * (cultivos.length + 2);
    doc.moveDown();
    doc.fontSize(12).text('4. Información Adicional', 50, additionalInfoY);
    doc.fontSize(10).text(
      'Estado: Todos los cultivos listados se encuentran en estado activo.\n' +
      'Notas: Para más detalles sobre cada cultivo, consulte el sistema de gestión agrícola.',
      { align: 'justify' }
    );

    doc.end();
  } catch (error) {
    console.error('Error al generar PDF de cultivos:', error);
    res.status(500).json({ message: 'Error al generar el reporte PDF de cultivos' });
  }
};