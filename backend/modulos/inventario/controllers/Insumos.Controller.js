import pool from "../../usuarios/database/Conexion.js";

export const registrarInsumo = async (req, res) => {
    try {
        const {
            nombre,
            descripcion,
            cantidad,
            unidad_medida,
            activo,
            tipo_empacado,
            fecha_caducidad
        } = req.body;

        const fecha_registro = new Date();
        const fecha_actualizacion = new Date(); 

        const sql = `
            INSERT INTO insumos_insumo (
                nombre,
                descripcion,
                cantidad,
                unidad_medida,
                activo,
                tipo_empacado,
                fecha_caducidad,
                fecha_registro,
                fecha_actualizacion
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id
        `;

        const { rows } = await pool.query(sql, [
            nombre,
            descripcion,
            cantidad,
            unidad_medida,
            activo,
            tipo_empacado,
            fecha_caducidad,
            fecha_registro,
            fecha_actualizacion
        ]);

        res.status(201).json({ message: "Insumo registrado", id: rows[0].id });
    } catch (error) {
        res.status(500).json({ message: "Error en el sistema", error: error.message });
    }
};


export const listarInsumos = async (req, res) => {
    try {
        const sql = "SELECT * FROM insumos_insumo ORDER BY id DESC";
        const { rows } = await pool.query(sql);
        res.status(200).json(rows);
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
            unidad_medida,
            activo,
            tipo_empacado,
            fecha_caducidad
        } = req.body;

        const { id } = req.params;

        const sql = `
            UPDATE insumos_insumo 
            SET nombre = $1,
                descripcion = $2,
                cantidad = $3,
                unidad_medida = $4,
                activo = $5,
                tipo_empacado = $6,
                fecha_caducidad = $7
            WHERE id = $8
        `;

        const { rowCount } = await pool.query(sql, [
            nombre,
            descripcion,
            cantidad,
            unidad_medida,
            activo,
            tipo_empacado,
            fecha_caducidad,
            id
        ]);

        if (rowCount > 0) {
            res.status(200).json({ message: "Insumo actualizado" });
        } else {
            res.status(404).json({ message: "Insumo no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error en el sistema", error: error.message });
    }
};
