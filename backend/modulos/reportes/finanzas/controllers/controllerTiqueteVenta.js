import PDFDocument from 'pdfkit';
import pool from '../../../usuarios/database/Conexion.js';

const formatNumber = (num) => {
    const value = parseFloat(num) || 0;
    return value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
};

const getCurrentDateTime = () => {
    const now = new Date();
    return {
        date: now.toISOString().split('T')[0], // YYYY-MM-DD
        time: now.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit' }), // HH:MM AM/PM
        shortDateTime: now.toLocaleString('es-CO', { day: '2-digit', month: '2-digit', year: '2-digit', hour: 'numeric', minute: '2-digit', hour12: true }), // DD/MM/YY, HH:MM AM
        fullDateTime: now.toLocaleString('es-CO', { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: '2-digit', hour12: false }) // YYYY-MM-DD HH:MM
    };
};

export const getFacturaPDF = async (req, res) => {
    try {
        const { id } = req.params;

        const ventaCheck = await pool.query(
            'SELECT id, fecha, monto_entregado, cambio FROM venta_venta WHERE id = $1',
            [id]
        );
        if (ventaCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Venta no encontrada' });
        }
        const venta = ventaCheck.rows[0];

        const detallesResult = await pool.query(
            `
            SELECT 
                dv.id,
                dv.producto_id AS producto,
                c.nombre AS producto_nombre,
                dv.cantidad,
                pp.precio AS precio_unitario,
                dv.total,
                dv.unidades_de_medida_id AS unidades_de_medida,
                um.nombre AS unidad_medida
            FROM venta_detalleventa dv
            LEFT JOIN precios_productos_precio_producto pp ON dv.producto_id = pp.id
            LEFT JOIN cosechas_cosecha ch ON pp."Producto_id" = ch.id
            LEFT JOIN cultivos_cultivo c ON ch.id_cultivo_id = c.id
            LEFT JOIN unidad_medida_unidadmedida um ON dv.unidades_de_medida_id = um.id
            WHERE dv.venta_id = $1
            `,
            [id]
        );
        const detalles = detallesResult.rows;

        if (!detalles.every(d => d.precio_unitario != null && d.total != null) || 
            venta.monto_entregado == null || venta.cambio == null) {
            console.error('Datos numéricos inválidos:', { venta, detalles });
            return res.status(500).json({ message: 'Datos numéricos inválidos en la venta o detalles' });
        }

        const mmToPoints = 2.83465;
        const margin = 3 * mmToPoints;
        const lineSpacing = 2 * mmToPoints;
        const fontSizeHeader = 8;
        const fontSizeBody = 6;

        const doc = new PDFDocument({
            size: [80 * mmToPoints, 297 * mmToPoints],
            margin: margin
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="factura_${venta.id}.pdf"`);
        doc.pipe(res);

        const width = 80 * mmToPoints - 2 * margin;
        let y = margin;

        const { date, time } = getCurrentDateTime();

        doc.font('Courier-Bold').fontSize(fontSizeHeader);
        doc.text('Agrosoft', margin, y, { align: 'center', width });
        y += lineSpacing;
        doc.font('Courier').fontSize(fontSizeBody);
        doc.text('NIT: 541235', margin, y, { align: 'center', width });
        y += lineSpacing;
        doc.text('DIR: Centro de Gestión y Desarrollo Sostenible Surcolombiano', margin, y, { align: 'center', width });
        y += lineSpacing;
        doc.text('TELS: 3132132123', margin, y, { align: 'center', width });
        y += lineSpacing;
        doc.font('Courier-Bold').fontSize(fontSizeHeader);
        doc.text('FACTURA DE VENTA', margin, y, { align: 'center', width });
        y += lineSpacing;

        doc.font('Courier').fontSize(fontSizeBody);
        const dianInfo = [
            'Documento equivalente electrónico',
            'Autorización DIAN N° 187647056540',
            'Vigencia hasta 2026-07-29'
        ];
        for (const line of dianInfo) {
            doc.text(line, margin, y, { align: 'center', width });
            y += lineSpacing;
        }

        doc.font('Courier').fontSize(fontSizeBody);
        const cajaInfo = [
            `No. Factura: ${venta.id}`,
            `Fecha: ${date}`,
            `Hora: ${time}`,
            'Cliente: CONSUMIDOR FINAL',
            'NIT/CC: 222222222222',
            '--------------------------------'
        ];
        for (const line of cajaInfo) {
            doc.text(line, margin, y, { align: 'center', width });
            y += lineSpacing;
        }

        doc.text('DESCRIPCIÓN  CANT  V.UNIT  TOTAL', margin, y, { align: 'center', width });
        y += lineSpacing;
        doc.text('--------------------------------', margin, y, { align: 'center', width });
        y += lineSpacing;

        const colWidths = {
            descripcion: 28 * mmToPoints,
            cantidad: 8 * mmToPoints,
            valorUnit: 14 * mmToPoints,
            total: 14 * mmToPoints
        };
        let totalVenta = 0;
        for (const detalle of detalles) {
            const productoNombre = detalle.producto_nombre || 'Producto sin nombre';
            const unidadMedida = detalle.unidad_medida || 'UN';
            const descripcion = `${productoNombre.slice(0, 10)}(${unidadMedida.slice(0, 3)})`;
            const cantidad = detalle.cantidad.toString();
            const valorUnit = formatNumber(detalle.precio_unitario);
            const total = formatNumber(detalle.total);

            const xDesc = margin;
            const xCant = xDesc + colWidths.descripcion;
            const xUnit = xCant + colWidths.cantidad;
            const xTotal = xUnit + colWidths.valorUnit;

            doc.text(descripcion, xDesc, y, { width: colWidths.descripcion, align: 'left' });
            doc.text(cantidad, xCant, y, { width: colWidths.cantidad, align: 'right' });
            doc.text(valorUnit, xUnit, y, { width: colWidths.valorUnit, align: 'right' });
            doc.text(total, xTotal, y, { width: colWidths.total, align: 'right' });

            y += lineSpacing;
            totalVenta += parseFloat(detalle.total);
            
            if (y > (297 * mmToPoints - 20 * mmToPoints)) {
                doc.addPage();
                y = margin;
            }
        }

        const subtotal = totalVenta / 1.19;
        const impuesto = totalVenta - subtotal;
        const totales = [
            '--------------------------------',
            `SUBTOTAL: $${formatNumber(subtotal)}`,
            `IVA (19%): $${formatNumber(impuesto)}`,
            `TOTAL: $${formatNumber(totalVenta)}`,
            '--------------------------------',
            `EFECTIVO: $${formatNumber(venta.monto_entregado)}`,
            `CAMBIO: $${formatNumber(venta.cambio)}`
        ];
        for (const line of totales) {
            doc.text(line, margin, y, { align: 'center', width });
            y += lineSpacing;
        }

        const pagoInfo = [
            'Forma de pago: Efectivo',
            '--------------------------------',
            '¡Gracias por su compra!',
            'Software by Agrosoft'
        ];
        for (const line of pagoInfo) {
            doc.text(line, margin, y, { align: 'center', width });
            y += lineSpacing;
        }

        doc.end();

    } catch (error) {
        console.error(error);
        if (!res.headersSent) {
            return res.status(500).json({ message: 'Error en el servidor', error: error.message });
        }
    }
};