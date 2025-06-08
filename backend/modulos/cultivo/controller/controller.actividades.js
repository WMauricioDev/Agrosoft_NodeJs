import pool from "../../usuarios/database/Conexion.js";

export const postActividad = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const {
            tipo_actividad_id,
            descripcion,
            fecha_inicio,
            fecha_fin,
            cultivo_id,
            usuarios,
            estado,
            prioridad,
            instrucciones_adicionales,
            insumos = [],
            herramientas = []
        } = req.body;

        // Validate insumos
        for (const insumo_entry of insumos) {
            const { insumo: insumo_id, cantidad_usada = 0 } = insumo_entry;
            const insumoResult = await client.query('SELECT cantidad FROM insumos WHERE id = $1', [insumo_id]);
            if (insumoResult.rows.length === 0) {
                throw new Error(`Insumo con ID ${insumo_id} no encontrado`);
            }
            const insumo = insumoResult.rows[0];
            if (cantidad_usada > insumo.cantidad) {
                throw new Error(`No hay suficiente stock para insumo ID ${insumo_id}. Disponible: ${insumo.cantidad}, solicitado: ${cantidad_usada}`);
            }
        }

        // Validate herramientas
        for (const herramienta_entry of herramientas) {
            const { herramienta: herramienta_id, cantidad_entregada = 1 } = herramienta_entry;
            const bodegaResult = await client.query('SELECT cantidad FROM bodega_herramientas WHERE herramienta_id = $1', [herramienta_id]);
            if (bodegaResult.rows.length === 0) {
                throw new Error(`BodegaHerramienta para herramienta ID ${herramienta_id} no encontrada`);
            }
            const bodega = bodegaResult.rows[0];
            if (cantidad_entregada > bodega.cantidad) {
                throw new Error(`No hay suficientes herramientas disponibles para ID ${herramienta_id}. Disponible: ${bodega.cantidad}, solicitado: ${cantidad_entregada}`);
            }
        }

        // Create actividad
        const actividadSql = `
            INSERT INTO actividades (
                tipo_actividad_id, descripcion, fecha_inicio, fecha_fin,
                cultivo_id, estado, prioridad, instrucciones_adicionales
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id
        `;
        const actividadResult = await client.query(actividadSql, [
            tipo_actividad_id,
            descripcion,
            fecha_inicio,
            fecha_fin,
            cultivo_id,
            estado || 'PENDIENTE',
            prioridad || 'MEDIA',
            instrucciones_adicionales || null
        ]);

        const actividadId = actividadResult.rows[0].id;

        // Handle usuarios (many-to-many)
        if (usuarios && Array.isArray(usuarios)) {
            const usuarioSql = `
                INSERT INTO actividad_usuarios (actividad_id, usuario_id)
                VALUES ($1, $2)
            `;
            for (const usuarioId of usuarios) {
                await client.query(usuarioSql, [actividadId, usuarioId]);
            }
        }

        // Process insumos
        for (const insumo_entry of insumos) {
            const { insumo: insumo_id, cantidad_usada = 0 } = insumo_entry;
            await client.query('UPDATE insumos SET cantidad = cantidad - $1 WHERE id = $2', [cantidad_usada, insumo_id]);
            await client.query(
                'INSERT INTO prestamos_insumos (actividad_id, insumo_id, cantidad_usada, cantidad_devuelta) VALUES ($1, $2, $3, $4)',
                [actividadId, insumo_id, cantidad_usada, 0]
            );
        }

        // Process herramientas
        for (const herramienta_entry of herramientas) {
            const { herramienta: herramienta_id, cantidad_entregada = 1, entregada = true, devuelta = false, fecha_devolucion = null } = herramienta_entry;
            const bodegaResult = await client.query('SELECT id FROM bodega_herramientas WHERE herramienta_id = $1', [herramienta_id]);
            const bodega_herramienta_id = bodegaResult.rows[0]?.id || null;
            await client.query(
                'UPDATE bodega_herramientas SET cantidad = cantidad - $1, cantidad_prestada = cantidad_prestada + $1 WHERE herramienta_id = $2',
                [cantidad_entregada, herramienta_id]
            );
            await client.query(
                `INSERT INTO prestamos_herramientas (
                    actividad_id, herramienta_id, bodega_herramienta_id,
                    cantidad_entregada, cantidad_devuelta, entregada, devuelta, fecha_devolucion
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [actividadId, herramienta_id, bodega_herramienta_id, cantidad_entregada, 0, entregada, devuelta, fecha_devolucion]
            );
        }

        await client.query('COMMIT');
        return res.status(201).json({
            message: "Actividad registrada correctamente",
            id: actividadId
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error in postActividad:', error.message);
        return res.status(400).json({ message: error.message || "Error en la solicitud" });
    } finally {
        client.release();
    }
};

export const getActividades = async (req, res) => {
    try {
        const sql = `
            SELECT a.*, 
                   t.nombre as tipo_actividad_nombre,
                   array_agg(au.usuario_id) as usuarios,
                   json_agg(json_build_object(
                       'id', pi.id,
                       'insumo_id', pi.insumo_id,
                       'insumo_nombre', i.nombre,
                       'cantidad_usada', pi.cantidad_usada,
                       'cantidad_devuelta', pi.cantidad_devuelta,
                       'fecha_devolucion', pi.fecha_devolucion,
                       'unidad_medida', um.abreviatura
                   )) as prestamos_insumos,
                   json_agg(json_build_object(
                       'id', ph.id,
                       'herramienta_id', ph.herramienta_id,
                       'herramienta_nombre', h.nombre,
                       'bodega_herramienta_id', ph.bodega_herramienta_id,
                       'bodega_herramienta_cantidad', bh.cantidad,
                       'cantidad_entregada', ph.cantidad_entregada,
                       'cantidad_devuelta', ph.cantidad_devuelta,
                       'entregada', ph.entregada,
                       'devuelta', ph.devuelta,
                       'fecha_devolucion', ph.fecha_devolucion
                   )) as prestamos_herramientas
            FROM actividades a
            LEFT JOIN tipo_actividad t ON a.tipo_actividad_id = t.id
            LEFT JOIN actividad_usuarios au ON a.id = au.actividad_id
            LEFT JOIN prestamos_insumos pi ON a.id = pi.actividad_id
            LEFT JOIN insumos i ON pi.insumo_id = i.id
            LEFT JOIN unidad_medida um ON i.unidad_medida_id = um.id
            LEFT JOIN prestamos_herramientas ph ON a.id = ph.actividad_id
            LEFT JOIN herramientas h ON ph.herramienta_id = h.id
            LEFT JOIN bodega_herramientas bh ON ph.bodega_herramienta_id = bh.id
            GROUP BY a.id, t.nombre
            ORDER BY a.fecha_fin DESC
        `;
        const result = await pool.query(sql);

        if (result.rows.length > 0) {
            return res.status(200).json(result.rows);
        } else {
            return res.status(404).json({ message: "No hay registros de actividades" });
        }
    } catch (error) {
        console.error('Error in getActividades:', error.message);
        return res.status(500).json({ message: "Error en el servidor" });
    }
};

export const getIdActividad = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = `
            SELECT a.*, 
                   t.nombre as tipo_actividad_nombre,
                   array_agg(au.usuario_id) as usuarios,
                   json_agg(json_build_object(
                       'id', pi.id,
                       'insumo_id', pi.insumo_id,
                       'insumo_nombre', i.nombre,
                       'cantidad_usada', pi.cantidad_usada,
                       'cantidad_devuelta', pi.cantidad_devuelta,
                       'fecha_devolucion', pi.fecha_devolucion,
                       'unidad_medida', um.abreviatura
                   )) as prestamos_insumos,
                   json_agg(json_build_object(
                       'id', ph.id,
                       'herramienta_id', ph.herramienta_id,
                       'herramienta_nombre', h.nombre,
                       'bodega_herramienta_id', ph.bodega_herramienta_id,
                       'bodega_herramienta_cantidad', bh.cantidad,
                       'cantidad_entregada', ph.cantidad_entregada,
                       'cantidad_devuelta', ph.cantidad_devuelta,
                       'entregada', ph.entregada,
                       'devuelta', ph.devuelta,
                       'fecha_devolucion', ph.fecha_devolucion
                   )) as prestamos_herramientas
            FROM actividades a
            LEFT JOIN tipo_actividad t ON a.tipo_actividad_id = t.id
            LEFT JOIN actividad_usuarios au ON a.id = au.actividad_id
            LEFT JOIN prestamos_insumos pi ON a.id = pi.actividad_id
            LEFT JOIN insumos i ON pi.insumo_id = i.id
            LEFT JOIN unidad_medida um ON i.unidad_medida_id = um.id
            LEFT JOIN prestamos_herramientas ph ON a.id = ph.actividad_id
            LEFT JOIN herramientas h ON ph.herramienta_id = h.id
            LEFT JOIN bodega_herramientas bh ON ph.bodega_herramienta_id = bh.id
            WHERE a.id = $1
            GROUP BY a.id, t.nombre
        `;
        const result = await pool.query(sql, [id]);

        if (result.rows.length > 0) {
            return res.status(200).json(result.rows[0]);
        } else {
            return res.status(404).json({ message: "Actividad no encontrada" });
        }
    } catch (error) {
        console.error('Error in getIdActividad:', error.message);
        return res.status(500).json({ message: "Error en el servidor" });
    }
};

export const updateActividad = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { id } = req.params;
        const {
            tipo_actividad_id,
            descripcion,
            fecha_inicio,
            fecha_fin,
            cultivo_id,
            usuarios,
            estado,
            prioridad,
            instrucciones_adicionales,
            insumos,
            herramientas
        } = req.body;

        // Validate insumos
        if (insumos) {
            for (const insumo_entry of insumos) {
                const { insumo: insumo_id, cantidad_usada = 0 } = insumo_entry;
                const insumoResult = await client.query('SELECT cantidad FROM insumos WHERE id = $1', [insumo_id]);
                if (insumoResult.rows.length === 0) {
                    throw new Error(`Insumo con ID ${insumo_id} no encontrado`);
                }
                const insumo = insumoResult.rows[0];
                if (cantidad_usada > insumo.cantidad) {
                    throw new Error(`No hay suficiente stock para insumo ID ${insumo_id}. Disponible: ${insumo.cantidad}, solicitado: ${cantidad_usada}`);
                }
            }
        }

        // Validate herramientas
        if (herramientas) {
            for (const herramienta_entry of herramientas) {
                const { herramienta: herramienta_id, cantidad_entregada = 1 } = herramienta_entry;
                const bodegaResult = await client.query('SELECT cantidad FROM bodega_herramientas WHERE herramienta_id = $1', [herramienta_id]);
                if (bodegaResult.rows.length === 0) {
                    throw new Error(`BodegaHerramienta para herramienta ID ${herramienta_id} no encontrada`);
                }
                const bodega = bodegaResult.rows[0];
                if (cantidad_entregada > bodega.cantidad) {
                    throw new Error(`No hay suficientes herramientas disponibles para ID ${herramienta_id}. Disponible: ${bodega.cantidad}, solicitado: ${cantidad_entregada}`);
                }
            }
        }

        // Update actividad
        const actividadSql = `
            UPDATE actividades
            SET tipo_actividad_id = $1, descripcion = $2, fecha_inicio = $3,
                fecha_fin = $4, cultivo_id = $5, estado = $6,
                prioridad = $7, instrucciones_adicionales = $8
            WHERE id = $9
        `;
        const actividadResult = await client.query(actividadSql, [
            tipo_actividad_id,
            descripcion,
            fecha_inicio,
            fecha_fin,
            cultivo_id,
            estado || 'PENDIENTE',
            prioridad || 'MEDIA',
            instrucciones_adicionales || null,
            id
        ]);

        if (actividadResult.rowCount === 0) {
            throw new Error("Actividad no encontrada");
        }

        // Update usuarios
        if (usuarios !== undefined) {
            await client.query('DELETE FROM actividad_usuarios WHERE actividad_id = $1', [id]);
            if (Array.isArray(usuarios)) {
                const usuarioSql = `
                    INSERT INTO actividad_usuarios (actividad_id, usuario_id)
                    VALUES ($1, $2)
                `;
                for (const usuarioId of usuarios) {
                    await client.query(usuarioSql, [id, usuarioId]);
                }
            }
        }

        // Update insumos
        if (insumos !== undefined) {
            await client.query('DELETE FROM prestamos_insumos WHERE actividad_id = $1', [id]);
            for (const insumo_entry of insumos) {
                const { insumo: insumo_id, cantidad_usada = 0 } = insumo_entry;
                await client.query('UPDATE insumos SET cantidad = cantidad - $1 WHERE id = $2', [cantidad_usada, insumo_id]);
                await client.query(
                    'INSERT INTO prestamos_insumos (actividad_id, insumo_id, cantidad_usada, cantidad_devuelta) VALUES ($1, $2, $3, $4)',
                    [id, insumo_id, cantidad_usada, 0]
                );
            }
        }

        // Update herramientas
        if (herramientas !== undefined) {
            const prestamosActuales = await client.query('SELECT * FROM prestamos_herramientas WHERE actividad_id = $1 AND devuelta = false', [id]);
            for (const prestamo of prestamosActuales.rows) {
                if (prestamo.bodega_herramienta_id) {
                    await client.query(
                        'UPDATE bodega_herramientas SET cantidad = cantidad + $1, cantidad_prestada = cantidad_prestada - $1 WHERE id = $2',
                        [prestamo.cantidad_entregada, prestamo.bodega_herramienta_id]
                    );
                }
            }
            await client.query('DELETE FROM prestamos_herramientas WHERE actividad_id = $1', [id]);
            for (const herramienta_entry of herramientas) {
                const { herramienta: herramienta_id, cantidad_entregada = 1, entregada = true, devuelta = false, fecha_devolucion = null } = herramienta_entry;
                const bodegaResult = await client.query('SELECT id FROM bodega_herramientas WHERE herramienta_id = $1', [herramienta_id]);
                const bodega_herramienta_id = bodegaResult.rows[0]?.id || null;
                await client.query(
                    'UPDATE bodega_herramientas SET cantidad = cantidad - $1, cantidad_prestada = cantidad_prestada + $1 WHERE herramienta_id = $2',
                    [cantidad_entregada, herramienta_id]
                );
                await client.query(
                    `INSERT INTO prestamos_herramientas (
                        actividad_id, herramienta_id, bodega_herramienta_id,
                        cantidad_entregada, cantidad_devuelta, entregada, devuelta, fecha_devolucion
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                    [id, herramienta_id, bodega_herramienta_id, cantidad_entregada, 0, entregada, devuelta, fecha_devolucion]
                );
            }
        }

        await client.query('COMMIT');
        return res.status(200).json({ message: "Actividad actualizada correctamente" });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error in updateActividad:', error.message);
        return res.status(400).json({ message: error.message || "Error en la solicitud" });
    } finally {
        client.release();
    }
};

export const deleteActividad = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "DELETE FROM actividades WHERE id = $1";
        const result = await pool.query(sql, [id]);

        if (result.rowCount > 0) {
            return res.status(200).json({ message: "Actividad eliminada correctamente" });
        }
        return res.status(404).json({ message: "No se pudo eliminar la actividad" });
    } catch (error) {
        console.error('Error in deleteActividad:', error.message);
        return res.status(500).json({ message: "Error en el servidor" });
    }
};

export const finalizarActividad = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { id } = req.params;
        const { fecha_fin } = req.body;

        if (!fecha_fin) {
            throw new Error("La fecha de finalización es requerida");
        }

        const actividadResult = await client.query('SELECT estado FROM actividades WHERE id = $1', [id]);
        if (actividadResult.rows.length === 0) {
            throw new Error("Actividad no encontrada");
        }
        if (actividadResult.rows[0].estado === 'COMPLETADA') {
            throw new Error("Esta actividad ya está completada");
        }

        await client.query(
            'UPDATE actividades SET estado = $1, fecha_fin = $2 WHERE id = $3',
            ['COMPLETADA', fecha_fin, id]
        );

        // Update insumos
        await client.query(
            `UPDATE prestamos_insumos 
             SET cantidad_devuelta = cantidad_usada, fecha_devolucion = $1 
             WHERE actividad_id = $2`,
            [fecha_fin, id]
        );

        // Update herramientas
        const prestamosHerramientas = await client.query(
            'SELECT * FROM prestamos_herramientas WHERE actividad_id = $1 AND devuelta = false',
            [id]
        );
        for (const prestamo of prestamosHerramientas.rows) {
            if (prestamo.bodega_herramienta_id) {
                const cantidad_devuelta = prestamo.cantidad_entregada - prestamo.cantidad_devuelta;
                await client.query(
                    'UPDATE bodega_herramientas SET cantidad = cantidad + $1, cantidad_prestada = cantidad_prestada - $1 WHERE id = $2',
                    [cantidad_devuelta, prestamo.bodega_herramienta_id]
                );
            }
        }
        await client.query(
            `UPDATE prestamos_herramientas 
             SET devuelta = true, cantidad_devuelta = cantidad_entregada, fecha_devolucion = $1 
             WHERE actividad_id = $2`,
            [fecha_fin, id]
        );

        const insumosCount = (await client.query('SELECT COUNT(*) FROM prestamos_insumos WHERE actividad_id = $1', [id])).rows[0].count;
        const herramientasCount = (await client.query('SELECT COUNT(*) FROM prestamos_herramientas WHERE actividad_id = $1', [id])).rows[0].count;

        await client.query('COMMIT');
        return res.status(200).json({
            message: "Actividad finalizada correctamente",
            insumos_devueltos: parseInt(insumosCount),
            herramientas_devueltas: parseInt(herramientasCount)
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error in finalizarActividad:', error.message);
        return res.status(400).json({ message: error.message || "Error en la solicitud" });
    } finally {
        client.release();
    }
};

export const graficoCostos = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin, tipo_grafico = 'barra' } = req.query;
        let sql = `
            SELECT a.*, 
                   t.nombre as tipo_actividad_nombre,
                   array_agg(au.usuario_id) as usuarios_ids,
                   json_agg(json_build_object(
                       'id', pi.id,
                       'insumo_id', pi.insumo_id,
                       'precio_insumo', i.precio_insumo,
                       'cantidad_usada', pi.cantidad_usada
                   )) as prestamos_insumos,
                   json_agg(json_build_object(
                       'id', ph.id,
                       'herramienta_id', ph.herramienta_id,
                       'precio', h.precio,
                       'cantidad_entregada', ph.cantidad_entregada
                   )) as prestamos_herramientas,
                   array_agg(u.nombre) as usuarios_nombres
            FROM actividades a
            LEFT JOIN tipo_actividad t ON a.tipo_actividad_id = t.id
            LEFT JOIN actividad_usuarios au ON a.id = au.actividad_id
            LEFT JOIN usuarios u ON au.usuario_id = u.id
            LEFT JOIN prestamos_insumos pi ON a.id = pi.actividad_id
            LEFT JOIN insumos i ON pi.insumo_id = i.id
            LEFT JOIN prestamos_herramientas ph ON a.id = ph.actividad_id
            LEFT JOIN herramientas h ON ph.herramienta_id = h.id
        `;
        const params = [];
        if (fecha_inicio && fecha_fin) {
            sql += ` WHERE a.fecha_inicio >= $1 AND a.fecha_fin <= $2`;
            params.push(fecha_inicio, fecha_fin);
        }
        sql += ` GROUP BY a.id, t.nombre ORDER BY a.fecha_fin DESC`;

        const result = await pool.query(sql, params);
        const data = result.rows.map(actividad => {
            const costo_insumos = actividad.prestamos_insumos.reduce((sum, pi) => 
                sum + (parseFloat(pi.precio_insumo || 0) * parseFloat(pi.cantidad_usada || 0)), 0);
            const costo_herramientas = actividad.prestamos_herramientas.reduce((sum, ph) => 
                sum + (parseFloat(ph.precio || 0) * parseFloat(ph.cantidad_entregada || 0)), 0);
            const tiempo_invertido_horas = (new Date(actividad.fecha_fin) - new Date(actividad.fecha_inicio)) / 3600000;

            // Note: Mano de obra calculation is simplified as salario table access is not implemented
            const costo_mano_obra = 0; // Placeholder, as salario logic requires additional table

            const total = costo_insumos + costo_herramientas + costo_mano_obra;

            return {
                actividad: actividad.tipo_actividad_nombre,
                costo_total: total,
                desglose: {
                    insumos: costo_insumos,
                    herramientas: costo_herramientas,
                    mano_de_obra: costo_mano_obra
                },
                tiempo_invertido_horas: time_invertido_horas.toFixed(2),
                fecha_inicio: new Date(actividad.fecha_inicio).toISOString().split('T')[0],
                fecha_fin: new Date(actividad.fecha_fin).toISOString().split('T')[0],
                usuarios: actividad.usuarios_nombres.filter(Boolean)
            };
        });

        return res.status(200).json({
            tipo_grafico,
            periodo: { fecha_inicio, fecha_fin },
            data
        });
    } catch (error) {
        console.error('Error in graficoCostos:', error.message);
        return res.status(500).json({ message: "Error en el servidor" });
    }
};