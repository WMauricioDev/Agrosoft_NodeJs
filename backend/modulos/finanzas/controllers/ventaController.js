import pool from "../../usuarios/database/Conexion.js";

export const postVenta = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { monto_entregado, detalles } = req.body;

        // Validate request
        if (!monto_entregado || !detalles || !Array.isArray(detalles)) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Monto entregado y detalles son requeridos' });
        }

        // Create venta with fecha
        const fecha = new Date(); // Generar fecha actual
        const ventaResult = await client.query(
            'INSERT INTO venta_venta (fecha, monto_entregado, cambio) VALUES ($1, $2, $3) RETURNING id, fecha, monto_entregado, cambio',
            [fecha, monto_entregado, 0]
        );
        const venta = ventaResult.rows[0];

        let total_venta = 0;
        const detallesResponse = [];

        // Process detalles
        for (const detalle of detalles) {
            const { producto, cantidad, unidades_de_medida } = detalle;

            // Validate detalle
            if (!producto || !cantidad || !unidades_de_medida || cantidad <= 0) {
                await client.query('ROLLBACK');
                return res.status(400).json({ message: 'Datos de detalle inválidos' });
            }

            // Fetch product details with joins to get cultivo name
            const productResult = await client.query(
                `SELECT 
                    pp.id, 
                    pp.precio, 
                    pp.stock, 
                    c.nombre AS nombre_cultivo
                FROM precios_productos_precio_producto pp
                INNER JOIN cosechas_cosecha ch ON pp."Producto_id" = ch.id
                INNER JOIN cultivos_cultivo c ON ch.id_cultivo_id = c.id
                WHERE pp.id = $1`,
                [producto]
            );
            if (productResult.rows.length === 0) {
                await client.query('ROLLBACK');
                return res.status(400).json({ message: `Producto ${producto} no encontrado` });
            }
            const product = productResult.rows[0];

            // Check stock
            if (product.stock < cantidad) {
                await client.query('ROLLBACK');
                return res.status(400).json({
                    message: `Stock insuficiente para el producto ${product.nombre_cultivo}. Disponible: ${product.stock}`,
                });
            }

            // Calculate subtotal
            const subtotal = product.precio * cantidad;
            total_venta += subtotal;

            // Create detalle
            const detalleResult = await client.query(
                'INSERT INTO venta_detalleventa (venta_id, producto_id, cantidad, total, unidades_de_medida_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, producto_id, cantidad, total, unidades_de_medida_id',
                [venta.id, producto, cantidad, subtotal, unidades_de_medida]
            );
            const savedDetalle = detalleResult.rows[0];

            // Fetch unidad_medida name
            const unidadResult = await client.query(
                'SELECT nombre FROM unidad_medida_unidadmedida WHERE id = $1',
                [unidades_de_medida]
            );
            const unidadNombre = unidadResult.rows[0]?.nombre || 'unidad';

            // Build detalle response
            detallesResponse.push({
                id: savedDetalle.id,
                producto: savedDetalle.producto_id,
                producto_nombre: product.nombre_cultivo,
                cantidad: savedDetalle.cantidad,
                precio_unitario: product.precio,
                total: savedDetalle.total,
                unidades_de_medida: savedDetalle.unidades_de_medida_id,
                unidad_medida: unidadNombre,
            });

            // Update stock
            await client.query(
                'UPDATE precios_productos_precio_producto SET stock = stock - $1 WHERE id = $2',
                [cantidad, producto]
            );
        }

        // Calculate cambio
        const cambio = monto_entregado - total_venta;
        if (cambio < 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'El monto entregado es menor que el total de la venta' });
        }

        // Update venta with cambio
        await client.query(
            'UPDATE venta_venta SET cambio = $1 WHERE id = $2',
            [cambio, venta.id]
        );
        venta.cambio = cambio;

        await client.query('COMMIT');

        // Return response matching Django serializer
        return res.status(201).json({
            id: venta.id,
            fecha: venta.fecha.toISOString(),
            monto_entregado: venta.monto_entregado,
            cambio: venta.cambio,
            detalles: detallesResponse,
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error en postVenta:', error);
        return res.status(500).json({ message: 'Error en el servidor', error: error.message });
    } finally {
        client.release();
    }
};

// Resto de los controladores (getVentas, deleteVenta, getDetallesVenta) sin cambios
export const getVentas = async (req, res) => {
    try {
        const sql = `
            SELECT 
                v.id,
                v.fecha,
                v.monto_entregado,
                v.cambio,
                json_agg(
                    json_build_object(
                        'id', dv.id,
                        'producto', dv.producto_id,
                        'producto_nombre', c.nombre,
                        'cantidad', dv.cantidad,
                        'precio_unitario', pp.precio,
                        'total', dv.total,
                        'unidades_de_medida', dv.unidades_de_medida_id,
                        'unidad_medida', um.nombre
                    )
                ) AS detalles
            FROM venta_venta v
            LEFT JOIN venta_detalleventa dv ON v.id = dv.venta_id
            LEFT JOIN precios_productos_precio_producto pp ON dv.producto_id = pp.id
            LEFT JOIN cosechas_cosecha ch ON pp."Producto_id" = ch.id
            LEFT JOIN cultivos_cultivo c ON ch.id_cultivo_id = c.id
            LEFT JOIN unidad_medida_unidadmedida um ON dv.unidades_de_medida_id = um.id
            GROUP BY v.id, v.fecha, v.monto_entregado, v.cambio
            ORDER BY v.fecha DESC
        `;
        const result = await pool.query(sql);

        const transformedRows = result.rows.map(row => ({
            id: row.id,
            fecha: row.fecha.toISOString(),
            monto_entregado: parseFloat(row.monto_entregado),
            cambio: parseFloat(row.cambio),
            detalles: row.detalles.filter(detalle => detalle.id !== null)
        }));

        return res.status(200).json(transformedRows);
    } catch (error) {
        console.error('Error en getVentas:', error);
        return res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

export const deleteVenta = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { id } = req.params;

        const ventaCheck = await client.query('SELECT id FROM venta_venta WHERE id = $1', [id]);
        if (ventaCheck.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'Venta no encontrada' });
        }

        const detalles = await client.query(
            'SELECT producto_id, cantidad FROM venta_detalleventa WHERE venta_id = $1',
            [id]
        );
        for (const detalle of detalles.rows) {
            await client.query(
                'UPDATE precios_productos_precio_producto SET stock = stock + $1 WHERE id = $2',
                [detalle.cantidad, detalle.producto_id]
            );
        }

        const result = await client.query('DELETE FROM venta_venta WHERE id = $1', [id]);

        await client.query('COMMIT');
        return res.status(200).json({ message: 'Venta eliminada correctamente' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error en deleteVenta:', error);
        return res.status(500).json({ message: 'Error en el servidor', error: error.message });
    } finally {
        client.release();
    }
};

export const getDetallesVenta = async (req, res) => {
    try {
        const { id } = req.params;

        const ventaCheck = await pool.query('SELECT id FROM venta_venta WHERE id = $1', [id]);
        if (ventaCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Venta no encontrada' });
        }

        const sql = `
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
        `;
        const result = await pool.query(sql, [id]);

        const transformedRows = result.rows.map(row => ({
            id: row.id,
            producto: row.producto,
            producto_nombre: row.producto_nombre,
            cantidad: row.cantidad,
            precio_unitario: parseFloat(row.precio_unitario),
            total: parseFloat(row.total),
            unidades_de_medida: row.unidades_de_medida,
            unidad_medida: row.unidad_medida
        }));

        return res.status(200).json(transformedRows);
    } catch (error) {
        console.error('Error en getDetallesVenta:', error);
        return res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};