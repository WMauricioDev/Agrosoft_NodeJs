import pool from "../../usuarios/database/Conexion.js";
import PDFDocument from 'pdfkit';

export const generarReporteInsumos = async (req, res) => {
    try {
        const { rows: insumos } = await pool.query("SELECT * FROM insumos_insumo ORDER BY id DESC");
        
        const doc = new PDFDocument();
        const fechaGeneracion = new Date().toISOString().split('T')[0];
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=reporte_insumos_${fechaGeneracion}.pdf`);
        
        doc.pipe(res);
        
        doc.fontSize(12).text('Centro de gestión y desarrollo sostenible surcolombiano', { align: 'left' });
        doc.text(`SENA - YAMBORO`, { align: 'left' });
        doc.text(`Página 1 de 1`, { align: 'right' });
        doc.moveDown();
        
        doc.fontSize(14).text('Informe de Insumos', { align: 'center', underline: true });
        doc.moveDown();
        
        doc.fontSize(12).text('1. Objetivo', { underline: true });
        doc.text('Este documento presenta un resumen detallado de los insumos registrados en el sistema, incluyendo información sobre nombre, descripción, cantidad y estado. El objetivo es proporcionar una visión general del inventario para facilitar la toma de decisiones y el análisis de gestión.', { align: 'justify' });
        doc.moveDown();
        
        doc.fontSize(12).text('2. Detalle de insumos', { underline: true });
        doc.moveDown();
        
        const table = {
            headers: ['Nombre', 'Descripción', 'Can', 'Unidad', 'Estado', 'Caducidad'],
            rows: insumos.map(insumo => [
                insumo.nombre,
                insumo.descripcion || '-',
                insumo.cantidad,
                insumo.unidad_medida,
                insumo.activo ? 'Activo' : 'Inactivo',
                insumo.fecha_caducidad ? new Date(insumo.fecha_caducidad).toISOString().split('T')[0] : '-'
            ])
        };
        
        const startX = 50;
        let startY = doc.y;
        const cellPadding = 5;
        const colWidths = [100, 150, 60, 60, 60, 80];
        
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
            `Se registran un total de ${insumos.length} insumos en el sistema.\n` +
            `Cantidad total en inventario: ${insumos.reduce((sum, insumo) => sum + parseFloat(insumo.cantidad), 0)} unidades.`,
            {
                width: 700,
                align: 'justify'
            }
        );
        
        doc.end();
    } catch (error) {
        res.status(500).json({ message: "Error al generar el reporte PDF", error: error.message });
    }
};

