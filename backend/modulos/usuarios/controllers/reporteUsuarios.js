import pool from "../../usuarios/database/Conexion.js";
import PDFDocument from "pdfkit";

export const generarReporteUsuarios = async (req, res) => {
  try {
    const { rows: usuarios } = await pool.query(`
      SELECT 
        u.nombre,
        u.apellido,
        u.username,
        u.email,
        r.nombre AS rol_nombre,
        u.fecha_registro
      FROM usuarios_usuarios u
      JOIN roles_roles r ON u.rol_id = r.id
      ORDER BY u.id DESC
    `);

    const doc = new PDFDocument();
    const fechaGeneracion = new Date().toISOString().split("T")[0];

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=reporte_usuarios_${fechaGeneracion}.pdf`
    );

    doc.pipe(res);

    // ENCABEZADO
    doc.fontSize(12).text("Centro de gestión y desarrollo sostenible surcolombiano", { align: "left" });
    doc.text("SENA - YAMBORO", { align: "left" });
    doc.text("Página 1 de 1", { align: "right" });
    doc.moveDown();

    // TÍTULO
    doc.fontSize(14).text("Informe de Usuarios Registrados", { align: "center", underline: true });
    doc.moveDown();

    // SECCIÓN 1: OBJETIVO
    doc.fontSize(12).text("1. Objetivo", { underline: true });
    doc.text(
      "Este informe detalla los usuarios registrados en el sistema, incluyendo sus datos personales, nombres de usuario, correos electrónicos, roles asignados y fechas de registro. El propósito es brindar una visión general de la base de usuarios para facilitar su gestión.",
      { align: "justify" }
    );
    doc.moveDown();

    // SECCIÓN 2: TABLA
    doc.fontSize(12).text("2. Detalle de Usuarios", { underline: true });
    doc.moveDown();

    const table = {
      headers: ["Nombre", "Apellido", "Username", "Email", "Rol", "Fecha Registro"],
      rows: usuarios.map((u) => [
        u.nombre,
        u.apellido,
        u.username,
        u.email,
        u.rol_nombre,
        new Date(u.fecha_registro).toISOString().split("T")[0],
      ]),
    };

    const startX = 50;
    let startY = doc.y;
    const cellPadding = 5;
    const colWidths = [80, 80, 80, 150, 80, 100];

    doc.font("Helvetica-Bold");
    let x = startX;
    table.headers.forEach((header, i) => {
      doc.rect(x, startY, colWidths[i], 20).stroke();
      doc.text(header, x + cellPadding, startY + cellPadding, {
        width: colWidths[i] - cellPadding * 2,
        align: "left",
      });
      x += colWidths[i];
    });

    doc.font("Helvetica");
    startY += 20;
    table.rows.forEach((row) => {
      let maxHeight = 0;
      x = startX;

      row.forEach((cell, i) => {
        const height =
          doc.heightOfString(cell, {
            width: colWidths[i] - cellPadding * 2,
          }) + cellPadding * 2;
        if (height > maxHeight) maxHeight = height;
      });

      row.forEach((cell, i) => {
        doc.rect(x, startY, colWidths[i], maxHeight).stroke();
        doc.text(cell, x + cellPadding, startY + cellPadding, {
          width: colWidths[i] - cellPadding * 2,
          align: "left",
        });
        x += colWidths[i];
      });

      startY += maxHeight;
    });

    doc.moveDown(2);
    doc.x = startX;

    // SECCIÓN 3: RESUMEN
    doc.fontSize(12).text("3. Resumen General", { underline: true });

    const total = usuarios.length;
    const porRol = usuarios.reduce((acc, u) => {
      acc[u.rol_nombre] = (acc[u.rol_nombre] || 0) + 1;
      return acc;
    }, {});

    doc.text(`Total de usuarios registrados: ${total}`, { align: "justify" });

    Object.entries(porRol).forEach(([rol, cantidad]) => {
      doc.text(`- ${rol}: ${cantidad} usuario(s)`, { align: "justify" });
    });

    doc.end();
  } catch (error) {
    console.error("Error al generar el PDF:", error);
    res.status(500).json({
      message: "Error al generar el reporte PDF",
      error: error.message,
    });
  }
};
