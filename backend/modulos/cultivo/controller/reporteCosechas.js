import pool from "../../usuarios/database/Conexion.js";
import PDFDocument from 'pdfkit';

export const generarReporteCosechas = async (req, res) => {
    try {
        const token = req.headers.authorization?.split("Bearer ")[1];
        if (!token) {
            return res.status(401).json({ message: "No se proporcionó token de autenticación" });
        }

        const { rows: cosechas } = await pool.query(`
            SELECT cc.*, ci.nombre AS cultivo_nombre 
            FROM cosechas_cosecha cc
            LEFT JOIN cultivos_cultivo ci ON cc.id_cultivo_id = ci.id
            ORDER BY cc.fecha DESC
        `);
        
        const doc = new PDFDocument();
        const fechaGeneracion = new Date().toISOString().split('T')[0];
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=reporte_cosechas_${fechaGeneracion}.pdf`);
        
        doc.pipe(res);
        
        doc.fontSize(12).text('Centro de gestión y desarrollo sostenible surcolombiano', { align: 'left' });
        doc.text(`SENA - YAMBORO`, { align: 'left' });
        doc.text(`Página 1 de 1`, { align: 'right' });
        doc.moveDown();
        
        doc.fontSize(14).text('Informe de Cosechas', { align: 'center', underline: true });
        doc.moveDown();
        
        doc.fontSize(12).text('1. Objetivo', { underline: true });
        doc.text('Este documento presenta un resumen detallado de las cosechas registradas en el sistema, incluyendo información sobre el cultivo, cantidad cosechada, unidades de medida y fecha. El objetivo es proporcionar una visión general de la producción para facilitar el análisis y la toma de decisiones.', { align: 'justify' });
        doc.moveDown();
        
        doc.fontSize(12).text('2. Detalle de cosechas', { underline: true });
        doc.moveDown();
        
        const table = {
            headers: ['Cultivo', 'Cantidad', 'Unidad', 'Fecha', 'ID Cosecha'],
            rows: cosechas.map(cosecha => [
                cosecha.cultivo_nombre || 'Sin nombre',
                cosecha.cantidad.toString(),
                cosecha.unidades_de_medida,
                new Date(cosecha.fecha).toISOString().split('T')[0],
                cosecha.id.toString()
            ])
        };
        
        const startX = 50;
        let startY = doc.y;
        const cellPadding = 5;
        const colWidths = [150, 80, 80, 100, 80];
        
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
            `Se registran un total de ${cosechas.length} cosechas en el sistema.\n` +
            `Cantidad total cosechada: ${cosechas.reduce((sum, cosecha) => sum + parseFloat(cosecha.cantidad), 0)} unidades.`,
            {
                width: 700,
                align: 'justify'
            }
        );
        
        doc.end();
    } catch (error) {
        console.error("Error al generar el reporte de cosechas:", error);
        res.status(500).json({ message: "Error al generar el reporte PDF", error: error.message });
    }
};