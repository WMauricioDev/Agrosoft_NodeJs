import pool from "../../usuarios/database/Conexion.js";

export const getDatosGraficas = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin } = req.query;

        if (!fecha_inicio || !fecha_fin) {
            return res.status(400).json({ 
                error: "Debes proporcionar 'fecha_inicio' y 'fecha_fin'" 
            });
        }

        // Validar que fecha_inicio no sea mayor a fecha_fin
        if (new Date(fecha_inicio) > new Date(fecha_fin)) {
            return res.status(400).json({ 
                error: "La fecha de inicio no puede ser mayor a la fecha fin" 
            });
        }

        const cosechasPorMes = await pool.query(`
            SELECT 
                TO_CHAR(fecha, 'YYYY-MM') AS mes,
                SUM(cantidad) AS total,
                (SELECT nombre FROM unidad_medida_unidadmedida 
                 WHERE id = unidades_de_medida_id LIMIT 1) AS unidad_medida
            FROM cosechas_cosecha
            WHERE fecha BETWEEN $1 AND $2
            GROUP BY TO_CHAR(fecha, 'YYYY-MM'), unidades_de_medida_id
            ORDER BY mes
        `, [fecha_inicio, fecha_fin]);

        const cosechasPorCultivo = await pool.query(`
            SELECT 
                c.nombre AS cultivo,
                SUM(co.cantidad) AS total,
                (SELECT nombre FROM unidad_medida_unidadmedida 
                 WHERE id = co.unidades_de_medida_id LIMIT 1) AS unidad_medida
            FROM cosechas_cosecha co
            JOIN cultivos_cultivo c ON co.id_cultivo_id = c.id
            WHERE co.fecha BETWEEN $1 AND $2
            GROUP BY c.nombre, co.unidades_de_medida_id
            ORDER BY total DESC
        `, [fecha_inicio, fecha_fin]);

        const cosechasPorDiaSemana = await pool.query(`
            SELECT 
                EXTRACT(DOW FROM fecha) AS dia_semana,
                SUM(cantidad) AS total,
                (SELECT nombre FROM unidad_medida_unidadmedida 
                 WHERE id = unidades_de_medida_id LIMIT 1) AS unidad_medida
            FROM cosechas_cosecha
            WHERE fecha BETWEEN $1 AND $2
            GROUP BY EXTRACT(DOW FROM fecha), unidades_de_medida_id
            ORDER BY dia_semana
        `, [fecha_inicio, fecha_fin]);

        const diasNombres = [
            'Domingo', 
            'Lunes', 
            'Martes', 
            'Miércoles', 
            'Jueves', 
            'Viernes', 
            'Sábado'
        ];

        const totalRegistros = await pool.query(`
            SELECT COUNT(*) FROM cosechas_cosecha
            WHERE fecha BETWEEN $1 AND $2
        `, [fecha_inicio, fecha_fin]);

        const response = {
            por_mes: {
                meses: cosechasPorMes.rows.map(row => row.mes),
                cantidades: cosechasPorMes.rows.map(row => parseFloat(row.total)),
                unidad_medida: cosechasPorMes.rows[0]?.unidad_medida || ''
            },
            por_cultivo: {
                cultivos: cosechasPorCultivo.rows.map(row => row.cultivo),
                cantidades: cosechasPorCultivo.rows.map(row => parseFloat(row.total)),
                unidad_medida: cosechasPorCultivo.rows[0]?.unidad_medida || ''
            },
            por_dia_semana: {
                dias: cosechasPorDiaSemana.rows.map(row => 
                    diasNombres[row.dia_semana] || 'Desconocido'
                ),
                cantidades: cosechasPorDiaSemana.rows.map(row => parseFloat(row.total)),
                unidad_medida: cosechasPorDiaSemana.rows[0]?.unidad_medida || ''
            },
            meta: {
                fecha_inicio,
                fecha_fin,
                total_registros: parseInt(totalRegistros.rows[0].count)
            }
        };

        res.json(response);

    } catch (error) {
        console.error('Error en getDatosGraficas:', error);
        res.status(500).json({ 
            error: "Error en el servidor",
            detalle: error.message 
        });
    }
};