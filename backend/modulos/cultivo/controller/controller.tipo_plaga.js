import pool from "../../usuarios/database/Conexion.js";

export const postTipo_plaga = async (req, res) => {
    try {
        const { nombre, descripcion, img } = req.body;
        if (!nombre) {
            return res.status(400).json({ "message": "El nombre es un campo requerido" });
        }
        const sql = "INSERT INTO tipo_plaga (nombre, descripcion, img) VALUES ($1, $2, $3) RETURNING id";
        const result = await pool.query(sql, [nombre, descripcion, img]);
        if (result.rows.length > 0) {
            return res.status(201).json({ 
                "message": "Tipo de plaga registrado correctamente",
                "id": result.rows[0].id
            });
        }
        return res.status(400).json({ "message": "No se pudo registrar el tipo de plaga" });
    } catch (error) {
        console.error('Error en postTipo_plaga:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};

export const getTipo_plaga = async (req, res) => {
    try {
        const sql = "SELECT * FROM tipo_plaga ORDER BY nombre";
        const result = await pool.query(sql);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error en getTipo_plaga:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};

export const getIdTipo_plaga = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "SELECT * FROM tipo_plaga WHERE id = $1";
        const result = await pool.query(sql, [id]);
        if (result.rows.length > 0) {
            return res.status(200).json(result.rows[0]);
        } else {
            return res.status(404).json({ "message": "Tipo de plaga no encontrado" });
        }
    } catch (error) {
        console.error('Error en getIdTipo_plaga:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};

export const updateTipo_plaga = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, img } = req.body;
        if (!nombre) {
            return res.status(400).json({ "message": "El nombre es un campo requerido" });
        }
        const sql = "UPDATE tipo_plaga SET nombre = $1, descripcion = $2, img = $3 WHERE id = $4";
        const result = await pool.query(sql, [nombre, descripcion, img, id]);
        if (result.rowCount > 0) {
            return res.status(200).json({ "message": "Tipo de plaga actualizado correctamente" });
        }
        return res.status(404).json({ "message": "No se pudo actualizar el tipo de plaga" });
    } catch (error) {
        console.error('Error en updateTipo_plaga:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};

export const deleteTipo_plaga = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "DELETE FROM tipo_plaga WHERE id = $1";
        const result = await pool.query(sql, [id]);
        if (result.rowCount > 0) {
            return res.status(200).json({ "message": "Tipo de plaga eliminado correctamente" });
        }
        return res.status(404).json({ "message": "No se pudo eliminar el tipo de plaga" });
    } catch (error) {
        console.error('Error en deleteTipo_plaga:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};
