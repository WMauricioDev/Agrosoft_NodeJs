// modulos/reportes/finanzas/controllers/controllerReporteIngresosEgresos.js
import pool from "../../../usuarios/database/Conexion.js";
import PDFDocument from 'pdfkit';

const formatNumber = (num) => {
    const value = parseFloat(num) || 0;
    return value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
};

export const generarReporteIngresosEgresos = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin, format } = req.query;

        if (!fecha_inicio || !fecha_fin) {
            return res.status(400).json({ message: 'Debes proporcionar fecha_inicio y fecha_fin' });
        }

        // Validate date format (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(fecha_inicio) || !dateRegex.test(fecha_fin)) {
            return res.status(400).json({ message: 'Formato de fecha inválido (YYYY-MM-DD)' });
        }

        // Adjust fecha_fin to include the entire end day
        const fechaFinAdjusted = new Date(fecha_fin);
        fechaFinAdjusted.setDate(fechaFinAdjusted.getDate() + 1);
        const fechaFinStr = fechaFinAdjusted.toISOString().split('T')[0];

        // Query for ingresos (ventas)
        const ingresosSql = `
            SELECT 
                DATE_TRUNC('month', v.fecha) AS mes,
                COUNT(*) AS total_transacciones,
                COALESCE(SUM(v.monto_entregado - v.cambio), 0) AS ingresos_totales,
                COALESCE(SUM(dv.cantidad), 0) AS total_cantidad
            FROM venta_venta v
            LEFT JOIN venta_detalleventa dv ON v.id = dv.venta_id
            WHERE v.fecha BETWEEN $1 AND $2
            GROUP BY DATE_TRUNC('month', v.fecha)
            ORDER BY mes
        `;
        const ingresosResult = await pool.query(ingresosSql, [fecha_inicio, fechaFinStr]);
        const ingresos = ingresosResult.rows;

        // Query for egresos (pagos)
        const egresosSql = `
            SELECT 
                DATE_TRUNC('month', p.fecha_calculo) AS mes,
                COUNT(*) AS total_transacciones,
                COALESCE(SUM(p.total_pago), 0) AS egresos_totales
            FROM pagos_pago p
            WHERE p.fecha_calculo BETWEEN $1 AND $2
            GROUP BY DATE_TRUNC('month', p.fecha_calculo)
            ORDER BY mes
        `;
        const egresosResult = await pool.query(egresosSql, [fecha_inicio, fechaFinStr]);
        const egresos = egresosResult.rows;

        // Combine meses from ingresos and egresos
        const mesesSet = new Set([
            ...ingresos.map(i => i.mes.toISOString()),
            ...egresos.map(e => e.mes.toISOString())
        ]);
        const meses = Array.from(mesesSet).sort().map(m => new Date(m));

        // Prepare data for response and PDF
        const porMes = {
            meses: [],
            ingresos: [],
            egresos: [],
            balance: [],
            cantidadesVendidas: [],
            transaccionesIngresos: [],
            transaccionesEgresos: []
        };

        let totalIngresos = 0;
        let totalEgresos = 0;
        let totalCantidad = 0;
        let totalTransaccionesIngresos = 0;
        let totalTransaccionesEgresos = 0;

        meses.forEach(mes => {
            const mesStr = mes.toLocaleString('es-ES', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase());
            const ingresoMes = ingresos.find(i => i.mes.toISOString() === mes.toISOString()) || { ingresos_totales: 0, total_cantidad: 0, total_transacciones: 0 };
            const egresoMes = egresos.find(e => e.mes.toISOString() === mes.toISOString()) || { egresos_totales: 0, total_transacciones: 0 };

            porMes.meses.push(mesStr);
            porMes.ingresos.push(parseFloat(ingresoMes.ingresos_totales));
            porMes.egresos.push(parseFloat(egresoMes.egresos_totales));
            porMes.balance.push(parseFloat(ingresoMes.ingresos_totales) - parseFloat(egresoMes.egresos_totales));
            porMes.cantidadesVendidas.push(parseFloat(ingresoMes.total_cantidad));
            porMes.transaccionesIngresos.push(ingresoMes.total_transacciones);
            porMes.transaccionesEgresos.push(egresoMes.total_transacciones);

            totalIngresos += parseFloat(ingresoMes.ingresos_totales);
            totalEgresos += parseFloat(egresoMes.egresos_totales);
            totalCantidad += parseFloat(ingresoMes.total_cantidad);
            totalTransaccionesIngresos += ingresoMes.total_transacciones;
            totalTransaccionesEgresos += egresoMes.total_transacciones;
        });

        // Handle JSON response for frontend
        if (format === 'json') {
            return res.json({
                resumen: {
                    fecha_inicio,
                    fecha_fin,
                    total_ingresos: totalIngresos,
                    total_egresos: totalEgresos,
                    balance_neto: totalIngresos - totalEgresos,
                    total_cantidad: totalCantidad,
                    total_transacciones_ingresos: totalTransaccionesIngresos,
                    total_transacciones_egresos: totalTransaccionesEgresos
                },
                por_mes: porMes
            });
        }

        // Create PDF (original logic unchanged)
        const doc = new PDFDocument({ margin: 40 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="reporte_ingresos_egresos_${fecha_inicio}_${fecha_fin}.pdf"`);
        doc.pipe(res);

        // Title
        doc.fontSize(18).text('Reporte de Ingresos y Egresos', { align: 'center' });
        doc.moveDown();

        // 1. Objective
        doc.fontSize(12).text('1. Objetivo', { align: 'left' });
        doc.fontSize(10).text(
            'Este reporte presenta un análisis detallado de los ingresos generados por ventas y los egresos por pagos a usuarios en el período especificado. Incluye un balance neto y estadísticas por mes para facilitar la toma de decisiones financieras.',
            { align: 'justify' }
        );

        // 2. Summary by Month
        doc.moveDown();
        doc.fontSize(12).text('2. Resumen por Mes', { align: 'left' });
        doc.moveDown(0.5);

        let tableTop = doc.y;
        const rowHeight = 20;
        const colWidths = [150, 100, 100, 100, 100];
        const colTitles = ['Mes', 'Ingresos ($)', 'Egresos ($)', 'Balance ($)', 'Cant. Vendida'];

        // Table Headers
        doc.font('Helvetica-Bold').fontSize(10);
        const colPositions = [];
        let currentX = 50;
        for (let i = 0; i < colWidths.length; i++) {
            colPositions.push(currentX);
            currentX += colWidths[i];
        }
        colTitles.forEach((title, i) => {
            const x = colPositions[i];
            doc.rect(x, tableTop, colWidths[i], rowHeight).stroke();
            doc.text(title, x + 5, tableTop + 5, { width: colWidths[i] - 10, align: 'center' });
        });

        // Table Rows
        doc.font('Helvetica').fontSize(8);
        porMes.meses.forEach((mes, i) => {
            const y = tableTop + rowHeight * (i + 1);
            const values = [
                mes,
                `$${formatNumber(porMes.ingresos[i])}`,
                `$${formatNumber(porMes.egresos[i])}`,
                `$${formatNumber(porMes.balance[i])}`,
                porMes.cantidadesVendidas[i].toString()
            ];
            values.forEach((text, j) => {
                const x = colPositions[j];
                doc.rect(x, y, colWidths[j], rowHeight).stroke();
                doc.text(text, x + 5, y + 5, { width: colWidths[j] - 10, align: j === 0 ? 'left' : 'right' });
            });
        });

        // 3. General Summary
        doc.fontSize(12).text('3. Resumen General', 50, doc.y + rowHeight);
        doc.fontSize(10).text(
            `Período analizado: ${fecha_inicio} al ${fecha_fin}\n` +
            `Total ingresos: $${formatNumber(totalIngresos)}\n` +
            `Total egresos: $${formatNumber(totalEgresos)}\n` +
            `Balance neto: $${formatNumber(totalIngresos - totalEgresos)}\n` +
            `Total transacciones (ventas): ${totalTransaccionesIngresos}\n` +
            `Total transacciones (pagos): ${totalTransaccionesEgresos}\n` +
            `Total cantidad vendida: ${totalCantidad.toLocaleString('es-CO')}`,
            { align: 'justify' }
        );

        doc.end();

    } catch (error) {
        console.error('Error al generar reporte de ingresos y egresos:', error);
        if (!res.headersSent) {
            return res.status(500).json({ message: 'Error al generar el reporte', error: error.message });
        }
    }
};