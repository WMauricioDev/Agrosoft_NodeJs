import pool from "../../usuarios/database/Conexion.js";

export const postControles = async (req, res) => {
    try {
        const { descripcion, fecha_control, cantidad_producto, fk_afecciones, fk_tipo_control, fk_productos_control } = req.body;
        const sql = "INSERT INTO controles (descripcion, fecha_control, cantidad_producto, fk_afecciones, fk_tipo_control, fk_productos_control) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id";
        const result = await pool.query(sql, [descripcion, fecha_control, cantidad_producto, fk_afecciones, fk_tipo_control, fk_productos_control]);
        
        if (result.rows.length > 0) {
            return res.status(201).json({ 
                "message": "Control registrado correctamente",
                "id": result.rows[0].id
            });
        }
        return res.status(400).json({ "message": "No se pudo registrar el control" });
    } catch (error) {
        console.error('Error in postControles:', error.message);
        return res.status(500).json({ "message": "Error en el servidor" });
    }
};

export const getControles = async (req, res) => {
    try {
        const sql = "SELECT * FROM controles";
        const result = await pool.query(sql);
        
        if (result.rows.length > 0) {
            return res.status(200).json(result.rows);
        } else {
            return res.status(404).json({ "message": "No hay registros de controles" });
        }
    } catch (error) {
        console.error('Error in getControles:', error.message);
        return res.status(500).json({ "message": "Error en el servidor" });
    }
};

export const getIdControles = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "SELECT * FROM controles WHERE id = $1";
        const result = await pool.query(sql, [id]);
        
        if (result.rows.length > 0) {
            return res.status(200).json(result.rows[0]);
        } else {
            return res.status(404).json({ "message": "Control no encontrado" });
        }
    } catch (error) {
        console.error('Error in getIdControles:', error.message);
        return res.status(500).json({ "message": "Error en el servidor" });
    }
};

export const updateControles = async (req, res) => {
    try {
        const { id } = req.params;
        const { descripcion, fecha_control, cantidad_producto, fk_afecciones, fk_tipo_control, fk_productos_control } = req.body;
        const sql = "UPDATE controles SET descripcion = $1, fecha_control = $2, cantidad_producto = $3, fk_afecciones = $4, fk_tipo_control = $5, fk_productos_control = $6 WHERE id = $7";
        const result = await pool.query(sql, [descripcion, fecha_control, cantidad_producto, fk_afecciones, fk_tipo_control, fk_productos_control, id]);
        
        if (result.rowCount > 0) {
            return res.status(200).json({ "message": "Control actualizado correctamente" });
        }
        return res.status(404).json({ "message": "No se pudo actualizar el control" });
    } catch (error) {
        console.error('Error in updateControles:', error.message);
        return res.status(500).json({ "message": "Error en el servidor" });
    }
};

export const deleteControles = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "DELETE FROM controles WHERE id = $1";
        const result = await pool.query(sql, [id]);
        
        if (result.rowCount > 0) {
            return res.status(200).json({ "message": "Control eliminado correctamente" });
        }
        return res.status(404).json({ "message": "No se pudo eliminar el control" });
    } catch (error) {
        console.error('Error in deleteControles:', error.message);
        return res.status(500).json({ "message": "Error en el servidor" });
    }
};
