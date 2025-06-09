import pool from "../../usuarios/database/Conexion.js";

export const postTipos_control = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        if (!nombre) {
            return res.status(400).json({ "message": "El nombre es un campo requerido" });
        }
        const sql = "INSERT INTO tipo_control_tipocontrol (nombre, descripcion) VALUES ($1, $2) RETURNING id";
        const result = await pool.query(sql, [nombre, descripcion]);
        if (result.rows.length > 0) {
            return res.status(201).json({ 
                "message": "Tipo de control registrado correctamente",
                "id": result.rows[0].id
            });
        }
        return res.status(400).json({ "message": "No se pudo registrar el tipo de control" });
    } catch (error) {
        console.error('Error en postTipos_control:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};

export const getTipos_control = async (req, res) => {
    try {
        const sql = "SELECT * FROM tipo_control_tipocontrol ORDER BY nombre";
        const result = await pool.query(sql);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error en getTipos_control:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};

export const getIdTipos_control = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "SELECT * FROM tipo_control_tipocontrol WHERE id = $1";
        const result = await pool.query(sql, [id]);
        if (result.rows.length > 0) {
            return res.status(200).json(result.rows[0]);
        } else {
            return res.status(404).json({ "message": "Tipo de control no encontrado" });
        }
    } catch (error) {
        console.error('Error en getIdTipos_control:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};

export const updateTipos_control = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;
        if (!nombre) {
            return res.status(400).json({ "message": "El nombre es un campo requerido" });
        }
        const sql = "UPDATE tipo_control_tipocontrol SET nombre = $1, descripcion = $2 WHERE id = $3";
        const result = await pool.query(sql, [nombre, descripcion, id]);
        if (result.rowCount > 0) {
            return res.status(200).json({ "message": "Tipo de control actualizado correctamente" });
        }
        return res.status(404).json({ "message": "No se pudo actualizar el tipo de control" });
    } catch (error) {
        console.error('Error en updateTipos_control:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};

export const deleteTipos_control = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "DELETE FROM tipo_control_tipocontrol WHERE id = $1";
        const result = await pool.query(sql, [id]);
        if (result.rowCount > 0) {
            return res.status(200).json({ "message": "Tipo de control eliminado correctamente" });
        }
        return res.status(404).json({ "message": "No se pudo eliminar el tipo de control" });
    } catch (error) {
        console.error('Error en deleteTipos_control:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};
