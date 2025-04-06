import pool from "../../usuarios/database/Conexion.js";

export const postBancal = async (req, res) => {
    try {
        const { nombre, TamX, TamY, posX, posY, fk_lote } = req.body;
        if (!nombre || !TamX || !TamY || !posX || !posY || !fk_lote) {
            return res.status(400).json({ message: "Faltan campos requeridos" });
        }
        const sql = `
            INSERT INTO bancal_bancal (nombre, "TamX", "TamY", "posX", "posY", lote_id) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING id
        `;
        const result = await pool.query(sql, [nombre, TamX, TamY, posX, posY, fk_lote]);
        if (result.rows.length > 0) {
            return res.status(201).json({ 
                message: "Bancal registrado correctamente",
                id: result.rows[0].id
            });
        }
        return res.status(400).json({ message: "No se pudo registrar el bancal" });
    } catch (error) {
        console.error('Error en postBancal:', error);
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};

export const getBancales = async (req, res) => {
    try {
        const sql = `
            SELECT id, nombre, "TamX", "TamY", "posX", "posY", lote_id 
            FROM bancal_bancal 
            ORDER BY nombre
        `;
        const result = await pool.query(sql);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error en getBancales:', error);
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};

export const getIdBancal = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = `
            SELECT id, nombre, "TamX", "TamY", "posX", "posY", lote_id 
            FROM bancal_bancal 
            WHERE id = $1
        `;
        const result = await pool.query(sql, [id]);
        if (result.rows.length > 0) {
            return res.status(200).json(result.rows[0]);
        } else {
            return res.status(404).json({ message: "Bancal no encontrado" });
        }
    } catch (error) {
        console.error('Error en getIdBancal:', error);
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};

export const updateBancal = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, TamX, TamY, posX, posY, fk_lote } = req.body;
        if (!nombre || !TamX || !TamY || !posX || !posY || !fk_lote) {
            return res.status(400).json({ message: "Faltan campos requeridos" });
        }
        const sql = `
            UPDATE bancal_bancal 
            SET nombre = $1, "TamX" = $2, "TamY" = $3, "posX" = $4, "posY" = $5, lote_id = $6 
            WHERE id = $7
        `;
        const result = await pool.query(sql, [nombre, TamX, TamY, posX, posY, fk_lote, id]);
        if (result.rowCount > 0) {
            return res.status(200).json({ message: "Bancal actualizado correctamente" });
        }
        return res.status(404).json({ message: "No se pudo actualizar el bancal" });
    } catch (error) {
        console.error('Error en updateBancal:', error);
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};

export const deleteBancal = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "DELETE FROM bancal_bancal WHERE id = $1";
        const result = await pool.query(sql, [id]);
        if (result.rowCount > 0) {
            return res.status(200).json({ message: "Bancal eliminado correctamente" });
        }
        return res.status(404).json({ message: "No se pudo eliminar el bancal" });
    } catch (error) {
        console.error('Error en deleteBancal:', error);
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};