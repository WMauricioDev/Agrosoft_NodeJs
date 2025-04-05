import pool from "../../usuarios/database/Conexion.js"

export const registrarInsumo = async (req, res) => {
    try {
        const { nombre, descripcion, precio, unidad_medida } = req.body
        const sql = `INSERT INTO insumos (nombre, descripcion, precio, unidad_medida) VALUES ($1, $2, $3, $4) RETURNING id`
        const { rows } = await pool.query(sql, [nombre, descripcion, precio, unidad_medida])
        res.status(200).json({ "message": "Insumo registrado", "id": rows[0].id })
    } catch (error) {
        res.status(500).json({ "message": "Error en el sistema", "error": error.message })
    }
};

export const listarInsumos = async (req, res) => {
    try {
        const sql = "SELECT * FROM insumos"
        const { rows } = await pool.query(sql)
        res.status(200).json(rows)
    } catch (error) {
        res.status(500).json({ "message": "Error en el sistema", "error": error.message })
    }
};

export const eliminarInsumo = async (req, res) => {
    try {
        const { id } = req.params
        const sql = `DELETE FROM insumos WHERE id = $1`
        const { rowCount } = await pool.query(sql, [id])
        if (rowCount > 0) {
            res.status(200).json({ "message": "Insumo eliminado" })
        } else {
            res.status(404).json({ "message": "Insumo no encontrado" })
        }
    } catch (error) {
        res.status(500).json({ "message": "Error en el sistema", "error": error.message })
    }
};

export const actualizarInsumo = async (req, res) => {
    try {
        const { nombre, descripcion, precio, unidad_medida } = req.body
        const { id } = req.params;
        const sql = `UPDATE insumos SET nombre = $1, descripcion = $2, precio = $3, unidad_medida = $4 WHERE id = $5`
        const { rowCount } = await pool.query(sql, [nombre, descripcion, precio, unidad_medida, id])
        if (rowCount > 0) {
            res.status(200).json({ "message": "Insumo actualizado" })
        } else {
            res.status(404).json({ "message": "Insumo no encontrado" })
        }
    } catch (error) {
        res.status(500).json({ "message": "Error en el sistema", "error": error.message })
    }
};