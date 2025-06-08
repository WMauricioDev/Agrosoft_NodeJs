import pool from "../../usuarios/database/Conexion.js";

export const postEspecies = async (req, res) => {
    try {
        console.log("Datos recibidos en el backend:", { body: req.body, file: req.file });
        const { nombre, descripcion, largoCrecimiento, fk_tipo_especie_id } = req.body;
        const img = req.file ? `modulos/uploads/${req.file.filename}` : null;

        if (!nombre || !fk_tipo_especie_id) {
            return res.status(400).json({ "message": "El nombre y el tipo de especie son requeridos" });
        }
        const sql = `INSERT INTO especies_especie (nombre, descripcion, img, "largoCrecimiento", fk_tipo_especie_id) VALUES ($1, $2, $3, $4, $5) RETURNING id`;
        const result = await pool.query(sql, [nombre, descripcion, img, largoCrecimiento, fk_tipo_especie_id]);
        if (result.rows.length > 0) {
            return res.status(201).json({ 
                "message": "Especie registrada correctamente",
                "id": result.rows[0].id
            });  
        }
        return res.status(400).json({ "message": "No se pudo registrar la especie" });
    } catch (error) {
        console.error('Error en postEspecies:', error);
        if (error.message === 'El archivo debe ser una imagen') {
            return res.status(400).json({ "message": error.message });
        }
        if (error.code === '23505') { // Violación de unicidad en PostgreSQL
            return res.status(400).json({ "message": "El nombre ya existe en la base de datos" });
        }
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};

export const getEspecies = async (req, res) => {
    try {
        const sql = "SELECT * FROM especies_especie";
        const result = await pool.query(sql);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error en getEspecies:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};

export const getIdEspecies = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "SELECT * FROM especies_especie WHERE id = $1";
        const result = await pool.query(sql, [id]);
        if (result.rows.length > 0) {
            return res.status(200).json(result.rows[0]);
        } else {
            return res.status(404).json({ "message": "Especie no encontrada" });
        }
    } catch (error) {
        console.error('Error en getIdEspecies:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};

export const updateEspecies = async (req, res) => {
    try {
        console.log("Datos recibidos en updateEspecies:", { body: req.body, file: req.file });
        const { id } = req.params;
        const { nombre, descripcion, largoCrecimiento, fk_tipo_especie_id } = req.body;
        const img = req.file ? `modulos/uploads/${req.file.filename}` : req.body.img;

        if (!nombre || !fk_tipo_especie_id) {
            return res.status(400).json({ "message": "El nombre y el tipo de especie son requeridos" });
        }
        const sql = `UPDATE especies_especie SET nombre = $1, descripcion = $2, img = $3, "largoCrecimiento" = $4, fk_tipo_especie_id = $5 WHERE id = $6`;
        const result = await pool.query(sql, [nombre, descripcion, img, largoCrecimiento, fk_tipo_especie_id, id]);
        if (result.rowCount > 0) {
            return res.status(200).json({ "message": "Especie actualizada correctamente" });
        }
        return res.status(404).json({ "message": "No se pudo actualizar la especie" });
    } catch (error) {
        console.error('Error en updateEspecies:', error);
        if (error.message === 'El archivo debe ser una imagen') {
            return res.status(400).json({ "message": error.message });
        }
        if (error.code === '23505') {
            return res.status(400).json({ "message": "El nombre ya existe en la base de datos" });
        }
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};


export const deleteEspecies = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "DELETE FROM especies_especie WHERE id = $1";
        const result = await pool.query(sql, [id]);
        if (result.rowCount > 0) {
            return res.status(200).json({ "message": "Especie eliminada correctamente" });
        }
        return res.status(404).json({ "message": "No se pudo eliminar la especie" });
    } catch (error) {
        console.error('Error en deleteEspecies:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};