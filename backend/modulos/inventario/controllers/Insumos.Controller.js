import pool from "../../usuarios/database/Conexion.js";

export const registrarTipoInsumo = async (req, res) => {
    try {
        const { nombre, descripcion, creada_por_usuario } = req.body;

        if (!nombre || nombre.length > 50) {
            return res.status(400).json({ message: "El nombre es requerido y debe tener máximo 50 caracteres" });
        }

        const sql = `
            INSERT INTO insumos_tiposinsumo (
                nombre, descripcion, creada_por_usuario, fecha_creacion
            ) VALUES ($1, $2, $3, $4) RETURNING id
        `;

        const values = [
            nombre,
            descripcion || null,
            creada_por_usuario !== undefined ? creada_por_usuario : false,
            new Date()
        ];

        const { rows } = await pool.query(sql, values);
        res.status(200).json({ message: "Tipo de insumo registrado", id: rows[0].id });
    } catch (error) {
        if (error.code === '23505') {
            res.status(400).json({ message: "El nombre del tipo de insumo ya existe" });
        } else {
            res.status(500).json({ message: "Error en el sistema", error: error.message });
        }
    }
};

export const obtenerTiposInsumo = async (req, res) => {
    try {
        const sql = `
            SELECT 
                id,
                nombre,
                descripcion,
                creada_por_usuario,
                TO_CHAR(fecha_creacion, 'YYYY-MM-DD') AS fecha_creacion
            FROM insumos_tiposinsumo
        `;
        const { rows } = await pool.query(sql);

        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los tipos de insumo", error: error.message });
    }
};

export const registrarInsumo = async (req, res) => {
    try {
        const {
            nombre,
            descripcion,
            cantidad,
            unidad_medida_id,
            tipo_insumo_id,
            activo,
            tipo_empacado,
            fecha_caducidad,
            precio_insumo
        } = req.body;

        const sql = `
            INSERT INTO insumos_insumo (
                nombre, descripcion, cantidad, unidad_medida_id, tipo_insumo_id,
                activo, tipo_empacado, fecha_caducidad, precio_insumo, fecha_registro
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id
        `;

        const values = [
            nombre,
            descripcion,
            cantidad || 1,
            unidad_medida_id || null,
            tipo_insumo_id || null,
            activo !== undefined ? activo : true,
            tipo_empacado || null,
            fecha_caducidad || null,
            precio_insumo || 0.00,
            new Date()
        ];

        const { rows } = await pool.query(sql, values);
        res.status(200).json({ message: "Insumo registrado", id: rows[0].id });
    } catch (error) {
        res.status(500).json({ message: "Error en el sistema", error: error.message });
    }
};

export const listarInsumos = async (req, res) => {
    try {
        const sql = `
            SELECT 
                i.id, 
                i.nombre, 
                i.descripcion, 
                i.cantidad, 
                i.unidad_medida_id,
                um.nombre AS unidad_medida_nombre,
                um.descripcion AS unidad_medida_descripcion,
                um.creada_por_usuario AS unidad_medida_creada_por_usuario,
                TO_CHAR(um.fecha_creacion, 'YYYY-MM-DD') AS unidad_medida_fecha_creacion,
                i.tipo_insumo_id,
                ti.nombre AS tipo_insumo_nombre,
                ti.descripcion AS tipo_insumo_descripcion,
                ti.creada_por_usuario AS tipo_insumo_creada_por_usuario,
                TO_CHAR(ti.fecha_creacion, 'YYYY-MM-DD') AS tipo_insumo_fecha_creacion,
                i.activo, 
                i.tipo_empacado, 
                TO_CHAR(i.fecha_registro, 'YYYY-MM-DD') AS fecha_registro, 
                CASE 
                    WHEN i.fecha_caducidad IS NOT NULL 
                    THEN TO_CHAR(i.fecha_caducidad, 'YYYY-MM-DD') 
                    ELSE NULL 
                END AS fecha_caducidad,
                i.precio_insumo
            FROM insumos_insumo i
            LEFT JOIN unidad_medida_unidadmedida um ON i.unidad_medida_id = um.id
            LEFT JOIN insumos_tiposinsumo ti ON i.tipo_insumo_id = ti.id
        `;
        const { rows } = await pool.query(sql);
        
        // Transformar los datos para que coincidan con la estructura esperada por el frontend
        const transformedRows = rows.map(row => ({
            id: row.id,
            nombre: row.nombre,
            descripcion: row.descripcion,
            cantidad: row.cantidad,
            unidad_medida: row.unidad_medida_id ? {
                id: row.unidad_medida_id,
                nombre: row.unidad_medida_nombre,
                descripcion: row.unidad_medida_descripcion,
                creada_por_usuario: row.unidad_medida_creada_por_usuario,
                fecha_creacion: row.unidad_medida_fecha_creacion
            } : null,
            tipo_insumo: row.tipo_insumo_id ? {
                id: row.tipo_insumo_id,
                nombre: row.tipo_insumo_nombre,
                descripcion: row.tipo_insumo_descripcion,
                creada_por_usuario: row.tipo_insumo_creada_por_usuario,
                fecha_creacion: row.tipo_insumo_fecha_creacion
            } : null,
            activo: row.activo,
            tipo_empacado: row.tipo_empacado,
            fecha_registro: row.fecha_registro,
            fecha_caducidad: row.fecha_caducidad,
            precio_insumo: row.precio_insumo
        }));

        res.status(200).json(transformedRows);
    } catch (error) {
        res.status(500).json({ message: "Error en el sistema", error: error.message });
    }
};

export const eliminarInsumo = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = `DELETE FROM insumos_insumo WHERE id = $1`;
        const { rowCount } = await pool.query(sql, [id]);
        if (rowCount > 0) {
            res.status(200).json({ message: "Insumo eliminado" });
        } else {
            res.status(404).json({ message: "Insumo no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error en el sistema", error: error.message });
    }
};

export const actualizarInsumo = async (req, res) => {
    try {
        const {
            nombre,
            descripcion,
            cantidad,
            unidad_medida_id,
            tipo_insumo_id,
            activo,
            tipo_empacado,
            fecha_caducidad,
            precio_insumo
        } = req.body;
        const { id } = req.params;

        const sql = `
            UPDATE insumos_insumo
            SET nombre = $1, descripcion = $2, cantidad = $3, unidad_medida_id = $4,
                tipo_insumo_id = $5, activo = $6, tipo_empacado = $7, fecha_caducidad = $8,
                precio_insumo = $9
            WHERE id = $10
        `;
        const values = [
            nombre,
            descripcion,
            cantidad || 1,
            unidad_medida_id || null,
            tipo_insumo_id || null,
            activo !== undefined ? activo : true,
            tipo_empacado || null,
            fecha_caducidad || null,
            precio_insumo || 0.00,
            id
        ];

        const { rowCount } = await pool.query(sql, values);
        if (rowCount > 0) {
            res.status(200).json({ message: "Insumo actualizado" });
        } else {
            res.status(404).json({ message: "Insumo no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error en el sistema", error: error.message });
    }
};