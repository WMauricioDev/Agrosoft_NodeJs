import pool from "../../usuarios/database/Conexion.js";

export const postUnidadMedida = async (req, res) => {
    try {
        const { nombre, descripcion, creada_por_usuario = false } = req.body;
        if (!nombre) {
            return res.status(400).json({ "message": "El campo nombre es requerido" });
        }
        if (typeof creada_por_usuario !== 'boolean') {
            return res.status(400).json({ "message": "El campo creada_por_usuario debe ser un booleano" });
        }
        const fecha_creacion = new Date().toISOString(); // Generate current timestamp
        const sql = "INSERT INTO unidad_medida_unidadmedida (nombre, descripcion, creada_por_usuario, fecha_creacion) VALUES ($1, $2, $3, $4) RETURNING id";
        const result = await pool.query(sql, [nombre, descripcion, creada_por_usuario, fecha_creacion]);
        if (result.rows.length > 0) {
            return res.status(201).json({ 
                "message": "Unidad de medida registrada correctamente",
                "id": result.rows[0].id
            });
        }
        return res.status(400).json({ "message": "No se pudo registrar la unidad de medida" });
    } catch (error) {
        console.error('Error en postUnidadMedida:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};
export const getUnidadesMedida = async (req, res) => {
    try {
        const sql = "SELECT * FROM unidad_medida_unidadmedida";
        const result = await pool.query(sql);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error en getUnidadesMedida:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};

export const getIdUnidadMedida = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "SELECT * FROM unidad_medida_unidadmedida WHERE id = $1";
        const result = await pool.query(sql, [id]);
        if (result.rows.length > 0) {
            return res.status(200).json(result.rows[0]);
        } else {
            return res.status(404).json({ "message": "Unidad de medida no encontrada" });
        }
    } catch (error) {
        console.error('Error en getIdUnidadMedida:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};

export const updateUnidadMedida = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, creada_por_usuario } = req.body;
        if (!nombre || creada_por_usuario === undefined) {
            return res.status(400).json({ "message": "Faltan campos requeridos" });
        }
        const sql = "UPDATE unidad_medida_unidadmedida SET nombre = $1, descripcion = $2, creada_por_usuario = $3 WHERE id = $4";
        const result = await pool.query(sql, [nombre, descripcion, creada_por_usuario, id]);
        if (result.rowCount > 0) {
            return res.status(200).json({ "message": "Unidad de medida actualizada correctamente" });
        }
        return res.status(404).json({ "message": "No se pudo actualizar la unidad de medida" });
    } catch (error) {
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};