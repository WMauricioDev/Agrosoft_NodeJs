import pool from "../../usuarios/database/Conexion.js";

export const postCultivos = async (req, res) => {
    try {
        const { nombre, unidad_de_medida_id, activo, fechaSiembra, Especie_id, Bancal_id } = req.body;
        if (!nombre || !unidad_de_medida_id || !activo || !fechaSiembra || !Especie_id || !Bancal_id) {
            return res.status(400).json({ "message": "Faltan campos requeridos" });
        }
        const sql = `INSERT INTO cultivos_cultivo (nombre, "unidad_de_medida_id", activo, "fechaSiembra", "Especie_id", "Bancal_id") VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`;
        const result = await pool.query(sql, [nombre, unidad_de_medida_id, activo, fechaSiembra, Especie_id, Bancal_id]);
        if (result.rows.length > 0) {
            return res.status(201).json({ 
                "message": "Cultivo registrado correctamente",
                "id": result.rows[0].id
            });
        }
        return res.status(400).json({ "message": "No se pudo registrar el cultivo" });
    } catch (error) {
        console.error('Error en postCultivos:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};

export const getCultivos = async (req, res) => {
    try {
        const sql = "SELECT * FROM cultivos_cultivo";
        const result = await pool.query(sql);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error en getCultivos:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};

export const getIdCultivos = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "SELECT * FROM cultivos_cultivo WHERE id = $1";
        const result = await pool.query(sql, [id]);
        if (result.rows.length > 0) {
            return res.status(200).json(result.rows[0]);
        } else {
            return res.status(404).json({ "message": "Cultivo no encontrado" });
        }
    } catch (error) {
        console.error('Error en getIdCultivos:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};

export const updateCultivos = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, unidad_de_medida_id, activo, fechaSiembra, Especie_id, Bancal_id } = req.body;
        if (!nombre || !unidad_de_medida_id || !activo || !fechaSiembra || !Especie_id || !Bancal_id) {
            return res.status(400).json({ "message": "Faltan campos requeridos" });
        }
        const sql =  `UPDATE cultivos_cultivo SET nombre = $1, "unidad_de_medida_id" = $2, activo = $3, "fechaSiembra" = $4, "Especie_id" = $5, "Bancal_id" = $6 WHERE id = $7 `;
        const result = await pool.query(sql, [nombre, unidad_de_medida_id, activo, fechaSiembra, Especie_id, Bancal_id, id]);
        if (result.rowCount > 0) {
            return res.status(200).json({ "message": "Cultivo actualizado correctamente" });
        }
        return res.status(404).json({ "message": "No se pudo actualizar el cultivo" });
    } catch (error) {
        console.error('Error en updateCultivos:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};

export const deleteCultivos = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "DELETE FROM cultivos_cultivo WHERE id = $1";
        const result = await pool.query(sql, [id]);
        if (result.rowCount > 0) {
            return res.status(200).json({ "message": "Cultivo eliminado correctamente" });
        }
        return res.status(404).json({ "message": "No se pudo eliminar el cultivo" });
    } catch (error) {
        console.error('Error en deleteCultivos:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};