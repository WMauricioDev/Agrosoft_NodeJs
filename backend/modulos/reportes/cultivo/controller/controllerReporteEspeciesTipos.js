import PDFDocument from 'pdfkit';
import pool from '../../../usuarios/database/Conexion.js';

export const generarReporteEspeciesTiposPDF = async (req, res) => {
  try {
    // Query for types
    const tiposSql = `SELECT id, nombre, descripcion FROM tipo_especies_tipoespecie ORDER BY nombre`;
    const tiposResult = await pool.query(tiposSql);
    const tipos = tiposResult.rows;

    // Query for species with type names
    const especiesSql = `
      SELECT 
        e.id,
        e.nombre,
        e.descripcion,
        e."largoCrecimiento" AS largo_crecimiento,
        t.nombre AS tipo_nombre
      FROM especies_especie e
      LEFT JOIN tipo_especies_tipoespecie t ON e.fk_tipo_especie_id = t.id
      ORDER BY e.nombre
    `;
    const especiesResult = await pool.query(especiesSql);
    const especies = especiesResult.rows;

    const total_tipos = tipos.length;
    const total_especies = especies.length;

    const doc = new PDFDocument({ margin: 40 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte_especies_tipos.pdf"');

    doc.pipe(res);

    // Title
    doc.fontSize(18).text('Informe de Especies y Tipos Registrados', { align: 'center' });
    doc.moveDown();

    // 1. Objective
    doc.fontSize(12).text('1. Objetivo');
    doc.fontSize(10).text(
      'Este documento presenta un listado detallado de todas las especies y tipos de especies registrados en el sistema. El objetivo es proporcionar una visión completa del catálogo disponible para facilitar la consulta y gestión de la biodiversidad registrada.',
      { align: 'justify' }
    );

    // 2. Types of Species
    doc.moveDown();
    doc.fontSize(12).text('2. Tipos de Especies Registrados');
    doc.moveDown(0.5);

    let tableTop = doc.y;
    const rowHeight = 20;
    const colWidthsTipos = [100, 150, 250];
    const colTitlesTipos = ['ID', 'Nombre', 'Descripción'];
    const colPositionsTipos = [];
    let currentX = 50;

    for (let i = 0; i < colWidthsTipos.length; i++) {
      colPositionsTipos.push(currentX);
      currentX += colWidthsTipos[i];
    }

    // Types Table Headers
    doc.font('Helvetica-Bold').fontSize(10);
    colTitlesTipos.forEach((title, i) => {
      const x = colPositionsTipos[i];
      doc.rect(x, tableTop, colWidthsTipos[i], rowHeight).stroke();
      doc.text(title, x + 5, tableTop + 5, { width: colWidthsTipos[i] - 10 });
    });

    // Types Table Rows
    doc.font('Helvetica').fontSize(8);
    tipos.forEach((tipo, i) => {
      const y = tableTop + rowHeight * (i + 1);
      const descripcion = tipo.descripcion && tipo.descripcion.length > 100 
        ? tipo.descripcion.slice(0, 100) + '...' 
        : tipo.descripcion || 'N/A';
      const values = [
        String(tipo.id),
        tipo.nombre || 'N/A',
        descripcion
      ];

      values.forEach((text, j) => {
        const x = colPositionsTipos[j];
        doc.rect(x, y, colWidthsTipos[j], rowHeight).stroke();
        doc.text(text, x + 5, y + 5, { width: colWidthsTipos[j] - 10 });
      });
    });

    // 3. Species
    tableTop = doc.y + rowHeight * (tipos.length + 1);
    doc.moveDown();
    doc.fontSize(12).text('3. Especies Registradas');
    doc.moveDown(0.5);

    const colWidthsEspecies = [50, 100, 100, 200, 100];
    const colTitlesEspecies = ['ID', 'Nombre', 'Tipo', 'Descripción', 'Largo Crecimiento'];
    const colPositionsEspecies = [];
    currentX = 50;

    for (let i = 0; i < colWidthsEspecies.length; i++) {
      colPositionsEspecies.push(currentX);
      currentX += colWidthsEspecies[i];
    }

    // Species Table Headers
    doc.font('Helvetica-Bold').fontSize(10);
    colTitlesEspecies.forEach((title, i) => {
      const x = colPositionsEspecies[i];
      doc.rect(x, tableTop, colWidthsEspecies[i], rowHeight).stroke();
      doc.text(title, x + 5, tableTop + 5, { width: colWidthsEspecies[i] - 10 });
    });

    // Species Table Rows
    doc.font('Helvetica').fontSize(7);
    especies.forEach((especie, i) => {
      const y = tableTop + rowHeight * (i + 1);
      const descripcion = especie.descripcion && especie.descripcion.length > 80 
        ? especie.descripcion.slice(0, 80) + '...' 
        : especie.descripcion || 'N/A';
      const values = [
        String(especie.id),
        especie.nombre || 'N/A',
        especie.tipo_nombre || 'N/A',
        descripcion,
        especie.largo_crecimiento ? `${especie.largo_crecimiento} días` : 'N/A'
      ];

      values.forEach((text, j) => {
        const x = colPositionsEspecies[j];
        doc.rect(x, y, colWidthsEspecies[j], rowHeight).stroke();
        doc.text(text, x + 5, y + 5, { width: colWidthsEspecies[j] - 10 });
      });
    });

    // 4. General Summary
    const summaryY = tableTop + rowHeight * (especies.length + 2);
    doc.moveDown();
    doc.fontSize(12).text('4. Resumen General', 50, summaryY);
    doc.fontSize(10).text(
      `El sistema cuenta actualmente con ${total_tipos} tipos de especies registrados y ${total_especies} especies asociadas a estos tipos. Este reporte proporciona una visión completa del catálogo disponible en el sistema.`,
      { align: 'justify' }
    );

    doc.end();
  } catch (error) {
    console.error('Error al generar PDF de especies y tipos:', error);
    res.status(500).json({ message: 'Error al generar el reporte PDF de especies y tipos' });
  }
};