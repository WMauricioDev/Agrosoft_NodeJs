import pool from "../../usuarios/database/Conexion.js";

export const postFase_lunar = async (req, res) => {
    try {
        const { nombre, descripcion, fecha } = req.body;
        if (!nombre || !fecha) {
            return res.status(400).json({ "message": "Faltan campos requeridos" });
        }
        const sql = "INSERT INTO fase_lunar (nombre, descripcion, fecha) VALUES ($1, $2, $3) RETURNING id";
        const result = await pool.query(sql, [nombre, descripcion, fecha]);
        if (result.rows.length > 0) {
            return res.status(201).json({ 
                "message": "Fase lunar registrada correctamente",
                "id": result.rows[0].id
            });
        }
        return res.status(400).json({ "message": "No se pudo registrar la fase lunar" });
    } catch (error) {
        console.error('Error en postFase_lunar:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};

export const getFase_lunar = async (req, res) => {
    try {
        const sql = "SELECT * FROM fase_lunar";
        const result = await pool.query(sql);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error en getFase_lunar:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};

export const getIdFase_lunar = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "SELECT * FROM fase_lunar WHERE id = $1";
        const result = await pool.query(sql, [id]);
        if (result.rows.length > 0) {
            return res.status(200).json(result.rows[0]);
        } else {
            return res.status(404).json({ "message": "Fase lunar no encontrada" });
        }
    } catch (error) {
        console.error('Error en getIdFase_lunar:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};

export const updateFase_lunar = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, fecha } = req.body;
        if (!nombre || !fecha) {
            return res.status(400).json({ "message": "Faltan campos requeridos" });
        }
        const sql = "UPDATE fase_lunar SET nombre = $1, descripcion = $2, fecha = $3 WHERE id = $4";
        const result = await pool.query(sql, [nombre, descripcion, fecha, id]);
        if (result.rowCount > 0) {
            return res.status(200).json({ "message": "Fase lunar actualizada correctamente" });
        }
        return res.status(404).json({ "message": "No se pudo actualizar la fase lunar" });
    } catch (error) {
        console.error('Error en updateFase_lunar:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};

export const deleteFase_lunar = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "DELETE FROM fase_lunar WHERE id = $1";
        const result = await pool.query(sql, [id]);
        if (result.rowCount > 0) {
            return res.status(200).json({ "message": "Fase lunar eliminada correctamente" });
        }
        return res.status(404).json({ "message": "No se pudo eliminar la fase lunar" });
    } catch (error) {
        console.error('Error en deleteFase_lunar:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};
