import pool from "../../usuarios/database/Conexion.js";

export const postTipo_actividad = async (req, res) => {
    try {
        const { nombre, descripcion, duracion_estimada, frecuencia } = req.body;
        if (!nombre) {
            return res.status(400).json({ "message": "El nombre es un campo requerido" });
        }
        const sql = "INSERT INTO tipo_actividad (nombre, descripcion, duracion_estimada, frecuencia) VALUES ($1, $2, $3, $4) RETURNING id";
        const result = await pool.query(sql, [nombre, descripcion, duracion_estimada, frecuencia]);
        if (result.rows.length > 0) {
            return res.status(201).json({ 
                "message": "Tipo de actividad registrado correctamente",
                "id": result.rows[0].id
            });
        }
        return res.status(400).json({ "message": "No se pudo registrar el tipo de actividad" });
    } catch (error) {
        console.error('Error en postTipo_actividad:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};

export const getTipo_actividad = async (req, res) => {
    try {
        const sql = "SELECT * FROM tipo_actividad ORDER BY nombre";
        const result = await pool.query(sql);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error en getTipo_actividad:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};

export const getIdTipo_actividad = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "SELECT * FROM tipo_actividad WHERE id = $1";
        const result = await pool.query(sql, [id]);
        if (result.rows.length > 0) {
            return res.status(200).json(result.rows[0]);
        } else {
            return res.status(404).json({ "message": "Tipo de actividad no encontrado" });
        }
    } catch (error) {
        console.error('Error en getIdTipo_actividad:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};

export const updateTipo_actividad = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, duracion_estimada, frecuencia } = req.body;
        if (!nombre) {
            return res.status(400).json({ "message": "El nombre es un campo requerido" });
        }
        const sql = "UPDATE tipo_actividad SET nombre = $1, descripcion = $2, duracion_estimada = $3, frecuencia = $4 WHERE id = $5";
        const result = await pool.query(sql, [nombre, descripcion, duracion_estimada, frecuencia, id]);
        if (result.rowCount > 0) {
            return res.status(200).json({ "message": "Tipo de actividad actualizado correctamente" });
        }
        return res.status(404).json({ "message": "No se pudo actualizar el tipo de actividad" });
    } catch (error) {
        console.error('Error en updateTipo_actividad:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};

export const deleteTipo_actividad = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "DELETE FROM tipo_actividad WHERE id = $1";
        const result = await pool.query(sql, [id]);
        if (result.rowCount > 0) {
            return res.status(200).json({ "message": "Tipo de actividad eliminado correctamente" });
        }
        return res.status(404).json({ "message": "No se pudo eliminar el tipo de actividad" });
    } catch (error) {
        console.error('Error en deleteTipo_actividad:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};