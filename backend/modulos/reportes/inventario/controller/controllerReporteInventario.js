import PDFDocument from 'pdfkit';
import pool from '../../usuarios/database/Conexion.js';

export const generarReporteInsumosPDF = async (req, res) => {
  try {
    
    const sql = `
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

    const result = await pool.query(sql);
    const insumos = result.rows;

    
    const doc = new PDFDocument({ margin: 40 });

    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte_insumos.pdf"');

    
    doc.pipe(res);

    
    doc.fontSize(18).text('Informe de Insumos Registrados', { align: 'center' });
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
    const rowHeight = 20;
    const colWidths = [100, 100, 50, 80, 80, 50, 80, 80, 50];
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

    
    doc.font('Helvetica').fontSize(10);
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

      values.forEach((text, j) => {
        const x = colPositions[j];
        doc.rect(x, y, colWidths[j], rowHeight).stroke();
        doc.text(text, x + 5, y + 5, { width: colWidths[j] - 10 });
      });
    });

    
    const summaryY = tableTop + rowHeight * (insumos.length + 2);
    doc.moveDown();
    doc.fontSize(12).text('3. Resumen General', 50, summaryY);
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