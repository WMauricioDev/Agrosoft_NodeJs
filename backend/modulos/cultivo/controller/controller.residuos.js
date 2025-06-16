import pool from "../../usuarios/database/Conexion.js";

export const postResiduos = async (req, res) => {
    try {
        const { id_cosecha_id, id_tipo_residuo_id, nombre, descripcion, fecha, cantidad } = req.body;
        if (!id_cosecha_id || !id_tipo_residuo_id || !cantidad || !fecha) {
            return res.status(400).json({ "message": "id_cosecha_id, id_tipo_residuo_id, cantidad y fecha son campos requeridos" });
        }
        const sql = "INSERT INTO residuos_residuo (id_cosecha_id, id_tipo_residuo_id, nombre, descripcion, fecha, cantidad) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id";
        const result = await pool.query(sql, [id_cosecha_id, id_tipo_residuo_id, nombre, descripcion, fecha, cantidad]);
        if (result.rows.length > 0) {
            return res.status(201).json({ 
                "message": "Residuo registrado correctamente",
                "id": result.rows[0].id
            });
        }
        return res.status(400).json({ "message": "No se pudo registrar el residuo" });
    } catch (error) {
        console.error('Error en postResiduos:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};

export const getResiduos = async (req, res) => {
    try {
        const sql = "SELECT * FROM residuos_residuo ORDER BY fecha DESC";
        const result = await pool.query(sql);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error en getResiduos:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};

export const getIdResiduos = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "SELECT * FROM residuos_residuo WHERE id = $1";
        const result = await pool.query(sql, [id]);
        if (result.rows.length > 0) {
            return res.status(200).json(result.rows[0]);
        } else {
            return res.status(404).json({ "message": "Residuo no encontrado" });
        }
    } catch (error) {
        console.error('Error en getIdResiduos:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};

export const updateResiduos = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_cosecha_id, id_tipo_residuo_id, nombre, descripcion, fecha, cantidad } = req.body;
        if (!id_cosecha_id || !id_tipo_residuo_id || !cantidad || !fecha) {
            return res.status(400).json({ "message": "id_cosecha_id, id_tipo_residuo_id, cantidad y fecha son campos requeridos" });
        }
        const sql = "UPDATE residuos_residuo SET id_cosecha_id = $1, id_tipo_residuo_id = $2, nombre = $3, descripcion = $4, fecha = $5, cantidad = $6 WHERE id = $7";
        const result = await pool.query(sql, [id_cosecha_id, id_tipo_residuo_id, nombre, descripcion, fecha, cantidad, id]);
        if (result.rowCount > 0) {
            return res.status(200).json({ "message": "Residuo actualizado correctamente" });
        }
        return res.status(404).json({ "message": "No se pudo actualizar el residuo" });
    } catch (error) {
        console.error('Error en updateResiduos:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};

export const deleteResiduos = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "DELETE FROM residuos_residuo WHERE id = $1";
        const result = await pool.query(sql, [id]);
        if (result.rowCount > 0) {
            return res.status(200).json({ "message": "Residuo eliminado correctamente" });
        }
        return res.status(404).json({ "message": "No se pudo eliminar el residuo" });
    } catch (error) {
        console.error('Error en deleteResiduos:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};