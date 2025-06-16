import PDFDocument from 'pdfkit';
import pool from '../../../usuarios/database/Conexion.js';

export const generarReporteActividadesPDF = async (req, res) => {
  try {
    const sql = `
      SELECT 
        a.id,
        a.descripcion,
        a.fecha_inicio,
        a.fecha_fin,
        a.prioridad,
        a.estado,
        t.nombre AS tipo_actividad,
        c.nombre AS cultivo,
        json_agg(u.nombre) AS usuarios,
        pi.insumo_id,
        pi.cantidad_usada,
        i.nombre AS insumo_nombre
      FROM actividades_actividad a
      LEFT JOIN tipo_actividad_tipoactividad t ON a.tipo_actividad_id = t.id
      LEFT JOIN cultivos_cultivo c ON a.cultivo_id = c.id
      LEFT JOIN actividades_actividad_usuarios au ON a.id = au.actividad_id
      LEFT JOIN usuarios_usuarios u ON au.usuarios_id = u.id
      LEFT JOIN actividades_prestamoinsumo pi ON a.id = pi.actividad_id
      LEFT JOIN insumos_insumo i ON pi.insumo_id = i.id
      WHERE a.estado = 'COMPLETADA'
      GROUP BY a.id, t.nombre, c.nombre, pi.insumo_id, pi.cantidad_usada, i.nombre
      ORDER BY a.fecha_fin DESC;
    `;

    const result = await pool.query(sql);
    const actividades = result.rows;

    // Calculate summary metrics
    const total_actividades = actividades.length;
    let periodo = 'No hay datos disponibles';
    let unique_insumos = 0;

    if (actividades.length > 0) {
      const fechas_inicio = actividades.map(a => new Date(a.fecha_inicio)).filter(d => !isNaN(d));
      const fechas_fin = actividades.map(a => new Date(a.fecha_fin)).filter(d => !isNaN(d));
      const earliest = fechas_inicio.length > 0 ? new Date(Math.min(...fechas_inicio)) : null;
      const latest = fechas_fin.length > 0 ? new Date(Math.max(...fechas_fin)) : null;
      if (earliest && latest) {
        periodo = `${earliest.toISOString().split('T')[0]} al ${latest.toISOString().split('T')[0]}`;
      }
      unique_insumos = new Set(actividades.map(a => a.insumo_id).filter(id => id !== null)).size;
    }

    const doc = new PDFDocument({ margin: 40 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte_actividades.pdf"');

    doc.pipe(res);

    // Title
    doc.fontSize(18).text('Reporte de Actividades Completadas', { align: 'center' });
    doc.moveDown();

    // 1. Objective
    doc.fontSize(12).text('1. Objetivo');
    doc.fontSize(10).text(
      'Este documento presenta un reporte detallado de las actividades COMPLETADAS en los cultivos, incluyendo información sobre insumos utilizados, fechas de ejecución y responsables.',
      { align: 'justify' }
    );

    // 2. General Summary
    doc.moveDown();
    doc.fontSize(12).text('2. Resumen General');
    doc.fontSize(10).text(
      `Total actividades completadas: ${total_actividades}\n` +
      `Período cubierto: ${periodo}\n` +
      `Insumos utilizados: ${unique_insumos} diferentes`,
      { align: 'justify' }
    );

    // 3. Activity Details
    doc.moveDown();
    doc.fontSize(12).text('3. Detalle de Actividades');
    doc.moveDown(0.5);

    const tableTop = doc.y;
    const rowHeight = 20;
    const colWidths = [80, 100, 80, 60, 80, 80, 60];
    const colTitles = ['Tipo', 'Descripción', 'Fechas', 'Prioridad', 'Cultivo', 'Insumo', 'Cantidad'];
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
    actividades.forEach((actividad, i) => {
      const y = tableTop + rowHeight * (i + 1);
      const descripcion = actividad.descripcion.length > 50 
        ? actividad.descripcion.slice(0, 50) + '...' 
        : actividad.descripcion;
      const fechas = `${actividad.fecha_inicio.toISOString().split('T')[0]} a ${actividad.fecha_fin.toISOString().split('T')[0]}`;
      const insumo = actividad.insumo_nombre || '';
      const cantidad = actividad.cantidad_usada || '';

      const values = [
        actividad.tipo_actividad || '',
        descripcion,
        fechas,
        actividad.prioridad || '',
        actividad.cultivo || '',
        insumo,
        cantidad
      ];

      values.forEach((text, j) => {
        const x = colPositions[j];
        doc.rect(x, y, colWidths[j], rowHeight).stroke();
        doc.text(text, x + 5, y + 5, { width: colWidths[j] - 10 });
      });
    });

    // 4. Additional Information
    const additionalInfoY = tableTop + rowHeight * (actividades.length + 2);
    doc.moveDown();
    doc.fontSize(12).text('4. Información Adicional', 50, additionalInfoY);

    // Group activities by ID to avoid duplicates in additional info
    const groupedActividades = {};
    actividades.forEach(a => {
      if (!groupedActividades[a.id]) {
        groupedActividades[a.id] = {
          ...a,
          insumos: []
        };
      }
      if (a.insumo_nombre) {
        groupedActividades[a.id].insumos.push({
          nombre: a.insumo_nombre,
          cantidad_usada: a.cantidad_usada
        });
      }
    });

    Object.values(groupedActividades).forEach((actividad, index) => {
      doc.moveDown(0.5);
      doc.fontSize(10).text(`Actividad: ${actividad.tipo_actividad || 'N/A'}`, { continued: false });
      const usuarios = Array.isArray(actividad.usuarios) 
        ? actividad.usuarios.filter(u => u !== null).join(', ') 
        : 'N/A';
      const insumosText = actividad.insumos.length > 0 
        ? actividad.insumos.map(i => `${i.nombre} - Cantidad: ${i.cantidad_usada}`).join('; ') 
        : 'N/A';
      const infoText = 
        `Cultivo: ${actividad.cultivo || 'N/A'}\n` +
        `Estado: ${actividad.estado || 'N/A'}\n` +
        `Período: ${actividad.fecha_inicio.toISOString().split('T')[0]} a ${actividad.fecha_fin.toISOString().split('T')[0]}\n` +
        `Responsable: ${usuarios}\n` +
        `Insumos: ${insumosText}`;
      doc.fontSize(10).text(infoText, { align: 'justify' });
    });

    doc.end();
  } catch (error) {
    console.error('Error al generar PDF de actividades:', error);
    res.status(500).json({ message: 'Error al generar el reporte PDF de actividades' });
  }
};