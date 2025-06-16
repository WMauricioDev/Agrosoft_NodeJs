import pool from "../../usuarios/database/Conexion.js";

export const getActividadCostosGrafica = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin, tipo_grafico } = req.query;
        
        let query = `
    SELECT 
        ta.nombre AS actividad,
        a.fecha_inicio,
        a.fecha_fin,
        COALESCE(SUM(pi.cantidad_usada * i.precio_insumo), 0) AS costo_insumos,
        COALESCE(SUM(ph.cantidad_entregada * h.precio), 0) AS costo_herramientas,
        COALESCE((
            SELECT SUM(
                (EXTRACT(EPOCH FROM (a.fecha_fin - a.fecha_inicio))/3600) * 
                    (s."valorJornal" / 8)
            )
            FROM usuarios_usuarios u
            JOIN salario_salario s ON u.rol_id = s.rol_id
            WHERE u.id IN (
                SELECT usuarios_id FROM actividades_actividad_usuarios 
                WHERE actividad_id = a.id
            )
            AND s.activo = true
            AND s.fecha_de_implementacion <= a.fecha_fin
        ), 0) AS costo_mano_obra
    FROM actividades_actividad a
    JOIN tipo_actividad_tipoactividad ta ON a.tipo_actividad_id = ta.id
    LEFT JOIN actividades_prestamoinsumo pi ON pi.actividad_id = a.id
    LEFT JOIN insumos_insumo i ON pi.insumo_id = i.id
    LEFT JOIN actividades_prestamoherramienta ph ON ph.actividad_id = a.id
    LEFT JOIN herramientas_herramienta h ON ph.herramienta_id = h.id
`;


        const params = [];
        
        if (fecha_inicio && fecha_fin) {
            query += ` WHERE a.fecha_inicio >= $1 AND a.fecha_fin <= $2`;
            params.push(fecha_inicio, fecha_fin);
        }

        query += `
            GROUP BY a.id, ta.nombre, a.fecha_inicio, a.fecha_fin
            ORDER BY ta.nombre
        `;

        const result = await pool.query(query, params);

        const data = result.rows.map(row => {
            const costo_insumos = parseFloat(row.costo_insumos);
            const costo_herramientas = parseFloat(row.costo_herramientas);
            const costo_mano_obra = parseFloat(row.costo_mano_obra);
            const total = costo_insumos + costo_herramientas + costo_mano_obra;
            
            return {
                actividad: row.actividad,
                costo_total: total,
                desglose: {
                    insumos: costo_insumos,
                    herramientas: costo_herramientas,
                    mano_de_obra: costo_mano_obra
                },
                fecha_inicio: row.fecha_inicio.toISOString().split('T')[0],
                fecha_fin: row.fecha_fin.toISOString().split('T')[0]
            };
        });

        return res.status(200).json({
            tipo_grafico: tipo_grafico || 'barra',
            periodo: {
                fecha_inicio: fecha_inicio || null,
                fecha_fin: fecha_fin || null
            },
            data: data
        });

    } catch (error) {
        console.error('Error en getActividadCostosGrafica:', error);
        return res.status(500).json({ 
            message: "Error en el servidor", 
            error: error.message 
        });
    }
};