import PDFDocument from 'pdfkit';
import pool from '../../../usuarios/database/Conexion.js';
import { parseISO, addDays } from 'date-fns';

export const generarReporteUsuariosPDF = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    if (!fecha_inicio || !fecha_fin) {
      return res.status(400).json({ message: "Debes proporcionar 'fecha_inicio' y 'fecha_fin'" });
    }

    const inicio = parseISO(fecha_inicio);
    const fin = addDays(parseISO(fecha_fin), 1); 

    const sql = `
      SELECT 
        u.nombre,
        u.email,
        u.date_joined,
        r.nombre AS rol_nombre
      FROM usuarios_usuarios u
      LEFT JOIN roles_roles r ON u.rol_id = r.id
      WHERE u.date_joined BETWEEN $1 AND $2
    `;

    const result = await pool.query(sql, [inicio, fin]);
    const usuarios = result.rows;

    const doc = new PDFDocument({ margin: 40 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte_usuarios.pdf"');

    doc.pipe(res);

    doc.fontSize(18).text('Informe de Usuarios Activos', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Período: ${fecha_inicio} a ${fecha_fin}`);
    doc.moveDown();

    doc.text('1. Objetivo');
    doc.fontSize(10).text(
      'Este documento presenta un resumen detallado de los usuarios activos hasta la fecha en el sistema, incluyendo información de contacto y roles asignados.',
      { align: 'justify' }
    );

    doc.moveDown();
    doc.fontSize(12).text('2. Detalle de Usuarios');
    doc.moveDown(0.5);

    // Tabla con bordes
    const tableTop = doc.y;
    const rowHeight = 20;

    const cols = [
      { label: 'Nombre', x: 50, width: 100 },
      { label: 'Email', x: 150, width: 180 },
      { label: 'Rol', x: 330, width: 100 },
      { label: 'Fecha Registro', x: 430, width: 100 }
    ];

    // Encabezado
    doc.font('Helvetica-Bold');
    cols.forEach(col => {
      doc.rect(col.x, tableTop, col.width, rowHeight).stroke();
      doc.text(col.label, col.x + 5, tableTop + 5, { width: col.width - 10 });
    });

    // Filas de datos
    doc.font('Helvetica');
    usuarios.forEach((u, i) => {
      const y = tableTop + rowHeight * (i + 1);
      cols.forEach(col => {
        doc.rect(col.x, y, col.width, rowHeight).stroke();
      });

      doc.text(u.nombre, cols[0].x + 5, y + 5, { width: cols[0].width - 10 });
      doc.text(u.email, cols[1].x + 5, y + 5, { width: cols[1].width - 10 });
      doc.text(u.rol_nombre || 'Sin rol', cols[2].x + 5, y + 5, { width: cols[2].width - 10 });
      doc.text(new Date(u.date_joined).toISOString().split('T')[0], cols[3].x + 5, y + 5, { width: cols[3].width - 10 });
    });

    const resumenTop = tableTop + rowHeight * (usuarios.length + 2);
    doc.y = resumenTop;
    doc.moveDown();
    doc.fontSize(12).text('3. Resumen General');
    doc.fontSize(10).text(
      `Durante el período del ${fecha_inicio} al ${fecha_fin}, se registraron ${usuarios.length} usuarios activos en el sistema.`,
      { align: 'justify' }
    );

    doc.end();
  } catch (error) {
    console.error('Error al generar PDF:', error);
    res.status(500).json({ message: 'Error al generar el reporte PDF' });
  }
};
