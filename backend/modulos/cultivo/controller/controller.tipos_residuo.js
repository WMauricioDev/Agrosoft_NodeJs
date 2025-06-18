import pool from "../../usuarios/database/Conexion.js";

export const postTipos_residuo = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        if (!nombre) {
            return res.status(400).json({ "message": "El nombre es un campo requerido" });
        }
        const sql = "INSERT INTO tipos_residuos_tiporesiduo (nombre, descripcion) VALUES ($1, $2) RETURNING id";
        const result = await pool.query(sql, [nombre, descripcion]);
        if (result.rows.length > 0) {
            return res.status(201).json({ 
                "message": "Tipo de residuo registrado correctamente",
                "id": result.rows[0].id
            });
        }
        return res.status(400).json({ "message": "No se pudo registrar el tipo de residuo" });
    } catch (error) {
        console.error('Error en postTipos_residuo:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};

export const getTipos_residuo = async (req, res) => {
    try {
        const sql = "SELECT * FROM tipos_residuos_tiporesiduo ORDER BY nombre";
        const result = await pool.query(sql);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error en getTipos_residuo:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};

export const getIdTipos_residuo = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "SELECT * FROM tipos_residuos_tiporesiduo WHERE id = $1";
        const result = await pool.query(sql, [id]);
        if (result.rows.length > 0) {
            return res.status(200).json(result.rows[0]);
        } else {
            return res.status(404).json({ "message": "Tipo de residuo no encontrado" });
        }
    } catch (error) {
        console.error('Error en getIdTipos_residuo:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};

export const updateTipos_residuo = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;
        if (!nombre) {
            return res.status(400).json({ "message": "El nombre es un campo requerido" });
        }
        const sql = "UPDATE tipos_residuos_tiporesiduo SET nombre = $1, descripcion = $2 WHERE id = $3";
        const result = await pool.query(sql, [nombre, descripcion, id]);
        if (result.rowCount > 0) {
            return res.status(200).json({ "message": "Tipo de residuo actualizado correctamente" });
        }
        return res.status(404).json({ "message": "No se pudo actualizar el tipo de residuo" });
    } catch (error) {
        console.error('Error en updateTipos_residuo:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};

export const deleteTipos_residuo = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "DELETE FROM tipos_residuos_tiporesiduo WHERE id = $1";
        const result = await pool.query(sql, [id]);
        if (result.rowCount > 0) {
            return res.status(200).json({ "message": "Tipo de residuo eliminado correctamente" });
        }
        return res.status(404).json({ "message": "No se pudo eliminar el tipo de residuo" });
    } catch (error) {
        console.error('Error en deleteTipos_residuo:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};