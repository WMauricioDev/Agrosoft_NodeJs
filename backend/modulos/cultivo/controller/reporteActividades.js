import pool from "../../usuarios/database/Conexion.js";
import PDFDocument from 'pdfkit';

export const generarReporteActividades = async (req, res) => {
    try {
        const token = req.headers.authorization?.split("Bearer ")[1];
        if (!token) {
            return res.status(401).json({ message: "No se proporcionó token de autenticación" });
        }

        const { rows: actividades } = await pool.query(`
            SELECT a.*, ta.nombre AS tipo_actividad_nombre, c.nombre AS cultivo_nombre, u.nombre AS usuario_nombre
            FROM actividades_actividad a
            LEFT JOIN tipo_actividad_tipoactividad ta ON a.tipo_actividad_id = ta.id
            LEFT JOIN cultivos_cultivo c ON a.cultivo_id = c.id
            LEFT JOIN usuarios_usuarios u ON a.usuario_id = u.id
            ORDER BY a.fecha_inicio DESC
        `);
        
        const doc = new PDFDocument();
        const fechaGeneracion = new Date().toISOString().split('T')[0];
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=reporte_actividades_${fechaGeneracion}.pdf`);
        
        doc.pipe(res);
        
        doc.fontSize(12).text('Centro de gestión y desarrollo sostenible surcolombiano', { align: 'left' });
        doc.text(`SENA - YAMBORO`, { align: 'left' });
        doc.text(`Página 1 de 1`, { align: 'right' });
        doc.moveDown();
        
        doc.fontSize(14).text('Informe de Actividades', { align: 'center', underline: true });
        doc.moveDown();
        
        doc.fontSize(12).text('1. Objetivo', { underline: true });
        doc.text('Este documento presenta un resumen detallado de las actividades registradas en el sistema, incluyendo información sobre descripción, tipo de actividad, cultivo, usuario, fechas y estado. El objetivo es proporcionar una visión general de las actividades para facilitar el análisis y la toma de decisiones.', { align: 'justify' });
        doc.moveDown();
        
        doc.fontSize(12).text('2. Detalle de actividades', { underline: true });
        doc.moveDown();
        
        const table = {
            headers: ['Descripción', 'Tipo', 'Cultivo', 'Usuario', 'Fecha Inicio', 'Estado'],
            rows: actividades.map(actividad => [
                actividad.descripcion || 'Sin descripción',
                actividad.tipo_actividad_nombre || 'Sin tipo',
                actividad.cultivo_nombre || 'Sin cultivo',
                actividad.usuario_nombre || 'Sin usuario',
                actividad.fecha_inicio ? new Date(actividad.fecha_inicio).toISOString().split('T')[0] : '-',
                actividad.estado || 'Sin estado'
            ])
        };
        
        const startX = 50;
        let startY = doc.y;
        const cellPadding = 5;
        const colWidths = [120, 80, 100, 100, 80, 80];
        
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
        
        doc.text(
            `Se registran un total de ${actividades.length} actividades en el sistema.\n` +
            `Actividades completadas: ${actividades.filter(a => a.estado === 'COMPLETADA').length} actividades.`,
            {
                width: 700,
                align: 'justify'
            }
        );
        
        doc.end();
    } catch (error) {
        console.error("Error al generar el reporte de actividades:", error);
        res.status(500).json({ message: "Error al generar el reporte PDF", error: error.message });
    }
};