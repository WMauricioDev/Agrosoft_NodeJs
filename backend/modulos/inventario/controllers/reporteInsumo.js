import pool from "../../usuarios/database/Conexion.js";
import excel from 'exceljs';
import pdf from 'pdfkit';

export const generarReporteInsumos = async (req, res) => {
    try {
        const { formato } = req.params;
        const { fechaInicio, fechaFin } = req.body;
        
        if (!fechaInicio || !fechaFin) {
            return res.status(400).json({
                success: false,
                message: "Error: Debes proporcionar 'fechaInicio' y 'fechaFin'"
            });
        }

        let sql = "SELECT * FROM insumos_insumo WHERE fecha_registro BETWEEN $1 AND $2 ORDER BY id DESC";
        const { rows } = await pool.query(sql, [fechaInicio, fechaFin]);
        
        // Cálculos estadísticos
        const totalInsumos = rows.length;
        const cantidadTotal = rows.reduce((sum, insumo) => sum + parseFloat(insumo.cantidad), 0);
        const promedioCantidad = totalInsumos > 0 ? cantidadTotal / totalInsumos : 0;

        if (formato === 'excel') {
            const workbook = new excel.Workbook();
            const worksheet = workbook.addWorksheet('Insumos');
            
            worksheet.mergeCells('A1:G1');
            const titleRow = worksheet.getCell('A1');
            titleRow.value = 'Reporte de Insumos';
            titleRow.font = { bold: true, size: 16 };
            titleRow.alignment = { horizontal: 'center' };

            worksheet.mergeCells('A2:G2');
            const infoRow = worksheet.getCell('A2');
            infoRow.value = `Período: ${fechaInicio} al ${fechaFin} | Generado: ${new Date().toISOString().split('T')[0]}`;
            infoRow.alignment = { horizontal: 'center' };

            worksheet.columns = [
                { header: 'ID', key: 'id', width: 10, style: { font: { bold: true } } },
                { header: 'Nombre', key: 'nombre', width: 30 },
                { header: 'Descripción', key: 'descripcion', width: 40 },
                { header: 'Cantidad', key: 'cantidad', width: 15 },
                { header: 'Unidad Medida', key: 'unidad_medida', width: 20 },
                { header: 'Activo', key: 'activo', width: 10 },
                { header: 'Fecha Registro', key: 'fecha_registro', width: 20 }
            ];

            rows.forEach(insumo => worksheet.addRow(insumo));

            worksheet.mergeCells(`A${rows.length + 3}:G${rows.length + 3}`);
            const summaryRow = worksheet.getCell(`A${rows.length + 3}`);
            summaryRow.value = `Resumen: ${totalInsumos} insumos registrados | Cantidad total: ${cantidadTotal} | Promedio: ${promedioCantidad.toFixed(2)}`;
            summaryRow.font = { bold: true };
            summaryRow.alignment = { horizontal: 'center' };

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=reporte_insumos_${new Date().toISOString().split('T')[0]}.xlsx`);
            
            await workbook.xlsx.write(res);
            res.end();
            
        } else if (formato === 'pdf') {
            const doc = new pdf({ size: 'letter' });
            const buffers = [];
            
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename=reporte_insumos_${new Date().toISOString().split('T')[0]}.pdf`);
                res.send(pdfData);
            });

            doc.fontSize(16).text('Centro de gestión y desarrollo sostenible surcolombiano\nSENA - YAMBORÓ', { align: 'center' });
            doc.moveDown();
            doc.fontSize(20).text('Informe de Insumos', { align: 'center' });
            doc.moveDown();
            doc.fontSize(12).text(`Generado el: ${new Date().toISOString().split('T')[0]}`, { align: 'center' });
            doc.moveDown(2);

            doc.fontSize(14).text('1. Objetivo', { underline: true });
            doc.moveDown();
            doc.fontSize(12).text('Este documento presenta un resumen detallado de los insumos registrados en el sistema, incluyendo información sobre nombres, cantidades y fechas de registro. El objetivo es proporcionar una visión general del inventario para facilitar la toma de decisiones y el análisis de gestión.', { align: 'justify' });
            doc.moveDown(2);

            doc.fontSize(14).text('2. Detalle de Insumos', { underline: true });
            doc.moveDown();

            const tableTop = doc.y;
            const tableLeft = 50;
            const columnWidth = (doc.page.width - 100) / 4;

            doc.font('Helvetica-Bold')
               .fillColor('white')
               .rect(tableLeft, tableTop, doc.page.width - 100, 20)
               .fill()
               .fillColor('black')
               .text('ID', tableLeft, tableTop + 5)
               .text('Nombre', tableLeft + columnWidth, tableTop + 5)
               .text('Cantidad', tableLeft + columnWidth * 2, tableTop + 5)
               .text('Activo', tableLeft + columnWidth * 3, tableTop + 5);

            let y = tableTop + 20;
            rows.forEach(insumo => {
                doc.font('Helvetica')
                   .text(insumo.id.toString(), tableLeft, y + 5)
                   .text(insumo.nombre, tableLeft + columnWidth, y + 5)
                   .text(insumo.cantidad.toString(), tableLeft + columnWidth * 2, y + 5)
                   .text(insumo.activo ? 'Sí' : 'no', tableLeft + columnWidth * 3, y + 5);
                
                doc.moveTo(tableLeft, y + 20)
                   .lineTo(tableLeft + (doc.page.width - 100), y + 20)
                   .stroke();
                
                y += 20;
            });

            doc.moveDown(2);

            doc.fontSize(14).text('3. Resumen General', { underline: true });
            doc.moveDown();
            doc.fontSize(12).text(`Durante el período del ${fechaInicio} al ${fechaFin}, se registraron ${totalInsumos} insumos. La cantidad total registrada fue de ${cantidadTotal} unidades, con un promedio de ${promedioCantidad.toFixed(2)} unidades por insumo.`, { align: 'justify' });

            doc.end();
            
        } else {
            res.status(400).json({ 
                success: false,
                message: "Formato de reporte no válido. Use 'pdf' o 'excel'" 
            });
        }
        
    } catch (error) {
        console.error('Error en reporteInsumos:', error);
        res.status(500).json({ 
            success: false,
            message: "Error generando reporte",
            error: error.message 
        });
    }
};