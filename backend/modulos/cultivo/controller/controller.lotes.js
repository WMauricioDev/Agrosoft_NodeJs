import pool from "../../usuarios/database/Conexion.js";

export const postLote = async (req, res) => {
    try {
        const { nombre, descripcion, activo, tam_x, tam_y, pos_x, pos_y } = req.body;
        if (!nombre || activo === undefined || !tam_x || !tam_y || !pos_x || !pos_y) {
            return res.status(400).json({ message: "Faltan campos requeridos" });
        }
        const sql = `
            INSERT INTO lotes_lote (nombre, descripcion, activo, tam_x, tam_y, pos_x, pos_y) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING id
        `;
        const result = await pool.query(sql, [nombre, descripcion, activo, tam_x, tam_y, pos_x, pos_y]);
        if (result.rows.length > 0) {
            return res.status(201).json({ 
                message: "Lote registrado correctamente",
                id: result.rows[0].id
            });
        }
        return res.status(400).json({ message: "No se pudo registrar el lote" });
    } catch (error) {
        console.error('Error en postLote:', error);
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};

export const getLote = async (req, res) => {
    try {
        const sql = `
            SELECT id, nombre, descripcion, activo, tam_x, tam_y, pos_x, pos_y 
            FROM lotes_lote 
            ORDER BY nombre
        `;
        const result = await pool.query(sql);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error en getLote:', error);
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};

export const getIdLote = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = `
            SELECT id, nombre, descripcion, activo, tam_x, tam_y, pos_x, pos_y 
            FROM lotes_lote 
            WHERE id = $1
        `;
        const result = await pool.query(sql, [id]);
        if (result.rows.length > 0) {
            return res.status(200).json(result.rows[0]);
        } else {
            return res.status(404).json({ message: "Lote no encontrado" });
        }
    } catch (error) {
        console.error('Error en getIdLote:', error);
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};

export const updateLote = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, activo, tam_x, tam_y, pos_x, pos_y } = req.body;
        if (!nombre || activo === undefined || !tam_x || !tam_y || !pos_x || !pos_y) {
            return res.status(400).json({ message: "Faltan campos requeridos" });
        }
        const sql = `
            UPDATE lotes_lote 
            SET nombre = $1, descripcion = $2, activo = $3, tam_x = $4, tam_y = $5, pos_x = $6, pos_y = $7 
            WHERE id = $8
        `;
        const result = await pool.query(sql, [nombre, descripcion, activo, tam_x, tam_y, pos_x, pos_y, id]);
        if (result.rowCount > 0) {
            return res.status(200).json({ message: "Lote actualizado correctamente" });
        }
        return res.status(404).json({ message: "No se pudo actualizar el lote" });
    } catch (error) {
        console.error('Error en updateLote:', error);
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};

export const deleteLote = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "DELETE FROM lotes_lote WHERE id = $1";
        const result = await pool.query(sql, [id]);
        if (result.rowCount > 0) {
            return res.status(200).json({ message: "Lote eliminado correctamente" });
        }
        return res.status(404).json({ message: "No se pudo eliminar el lote" });
    } catch (error) {
        console.error('Error en deleteLote:', error);
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};