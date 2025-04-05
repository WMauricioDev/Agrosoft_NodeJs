import pool from "../../usuarios/database/Conexion.js";

export const postActividades = async (req, res) => {
    try {
        const { fk_cultivo, fk_usuario, fk_insumo, fk_programacion, fk_tipo_actividad, titulo, descripcion, fecha, cantidad_producto } = req.body;
        const sql = "INSERT INTO actividades (fk_cultivo, fk_usuario, fk_insumo, fk_programacion, fk_tipo_actividad, titulo, descripcion, fecha, cantidad_producto) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id";
        const result = await pool.query(sql, [fk_cultivo, fk_usuario, fk_insumo, fk_programacion, fk_tipo_actividad, titulo, descripcion, fecha, cantidad_producto]);
        
        if (result.rows.length > 0) {
            return res.status(201).json({ 
                "message": "Actividad registrada correctamente",
                "id": result.rows[0].id
            });
        }
        return res.status(400).json({ "message": "No se pudo registrar la actividad" });
    } catch (error) {
        console.error('Error in postActividades:', error.message);
        return res.status(500).json({ "message": "Error en el servidor" });
    }
};

export const getActividades = async (req, res) => {
    try {
        const sql = "SELECT * FROM actividades";
        const result = await pool.query(sql);
        
        if (result.rows.length > 0) {
            return res.status(200).json(result.rows);
        } else {
            return res.status(404).json({ "message": "No hay registros de actividades" });
        }
    } catch (error) {
        console.error('Error in getActividades:', error.message);
        return res.status(500).json({ "message": "Error en el servidor" });
    }
};

export const getIdActividades = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "SELECT * FROM actividades WHERE id = $1";
        const result = await pool.query(sql, [id]);
        
        if (result.rows.length > 0) {
            return res.status(200).json(result.rows[0]);
        } else {
            return res.status(404).json({ "message": "Actividad no encontrada" });
        }
    } catch (error) {
        console.error('Error in getIdActividades:', error.message);
        return res.status(500).json({ "message": "Error en el servidor" });
    }
};

export const updateActividades = async (req, res) => {
    try {
        const { id } = req.params;
        const { fk_cultivo, fk_usuario, fk_insumo, fk_programacion, fk_tipo_actividad, titulo, descripcion, fecha, cantidad_producto } = req.body;
        const sql = "UPDATE actividades SET fk_cultivo = $1, fk_usuario = $2, fk_insumo = $3, fk_programacion = $4, fk_tipo_actividad = $5, titulo = $6, descripcion = $7, fecha = $8, cantidad_producto = $9 WHERE id = $10";
        const result = await pool.query(sql, [fk_cultivo, fk_usuario, fk_insumo, fk_programacion, fk_tipo_actividad, titulo, descripcion, fecha, cantidad_producto, id]);
        
        if (result.rowCount > 0) {
            return res.status(200).json({ "message": "Actividad actualizada correctamente" });
        }
        return res.status(404).json({ "message": "No se pudo actualizar la actividad" });
    } catch (error) {
        console.error('Error in updateActividades:', error.message);
        return res.status(500).json({ "message": "Error en el servidor" });
    }
};

export const deleteActividades = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "DELETE FROM actividades WHERE id = $1";
        const result = await pool.query(sql, [id]);
        
        if (result.rowCount > 0) {
            return res.status(200).json({ "message": "Actividad eliminada correctamente" });
        }
        return res.status(404).json({ "message": "No se pudo eliminar la actividad" });
    } catch (error) {
        console.error('Error in deleteActividades:', error.message);
        return res.status(500).json({ "message": "Error en el servidor" });
    }
};
