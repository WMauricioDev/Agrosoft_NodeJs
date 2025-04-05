import pool from "../../usuarios/database/Conexion.js";

export const postProductos_control = async (req, res) => {
    try {
        const { nombre, precio, ficha_tecnica, contenido, tipo_contenido, unidades } = req.body;
        if (!nombre || !precio || !contenido || !tipo_contenido || !unidades) {
            return res.status(400).json({ "message": "Faltan campos requeridos" });
        }
        const sql = "INSERT INTO productos_control (nombre, precio, ficha_tecnica, contenido, tipo_contenido, unidades) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id";
        const result = await pool.query(sql, [nombre, precio, ficha_tecnica, contenido, tipo_contenido, unidades]);
        if (result.rows.length > 0) {
            return res.status(201).json({ 
                "message": "Producto de control registrado correctamente",
                "id": result.rows[0].id
            });
        }
        return res.status(400).json({ "message": "No se pudo registrar el producto de control" });
    } catch (error) {
        console.error('Error en postProductos_control:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};

export const getProductos_control = async (req, res) => {
    try {
        const sql = "SELECT * FROM productos_control";
        const result = await pool.query(sql);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error en getProductos_control:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};

export const getIdProductos_control = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "SELECT * FROM productos_control WHERE id = $1";
        const result = await pool.query(sql, [id]);
        if (result.rows.length > 0) {
            return res.status(200).json(result.rows[0]);
        } else {
            return res.status(404).json({ "message": "Producto de control no encontrado" });
        }
    } catch (error) {
        console.error('Error en getIdProductos_control:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};

export const updateProductos_control = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, precio, ficha_tecnica, contenido, tipo_contenido, unidades } = req.body;
        if (!nombre || !precio || !contenido || !tipo_contenido || !unidades) {
            return res.status(400).json({ "message": "Faltan campos requeridos" });
        }
        const sql = "UPDATE productos_control SET nombre = $1, precio = $2, ficha_tecnica = $3, contenido = $4, tipo_contenido = $5, unidades = $6 WHERE id = $7";
        const result = await pool.query(sql, [nombre, precio, ficha_tecnica, contenido, tipo_contenido, unidades, id]);
        if (result.rowCount > 0) {
            return res.status(200).json({ "message": "Producto de control actualizado correctamente" });
        }
        return res.status(404).json({ "message": "No se pudo actualizar el producto de control" });
    } catch (error) {
        console.error('Error en updateProductos_control:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};

export const deleteProductos_control = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "DELETE FROM productos_control WHERE id = $1";
        const result = await pool.query(sql, [id]);
        if (result.rowCount > 0) {
            return res.status(200).json({ "message": "Producto de control eliminado correctamente" });
        }
        return res.status(404).json({ "message": "No se pudo eliminar el producto de control" });
    } catch (error) {
        console.error('Error en deleteProductos_control:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};
