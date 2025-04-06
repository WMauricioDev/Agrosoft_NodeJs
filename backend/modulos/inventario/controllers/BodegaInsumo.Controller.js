import pool from "../../usuarios/database/Conexion.js";

export const registrarBodegaInsumo = async (req, res) => {
    try {
        const { bodega_id, insumo_id, cantidad } = req.body;

        if (!bodega_id || !insumo_id || cantidad === undefined) {
            return res.status(400).json({ message: "Todos los campos son obligatorios: bodega_id, insumo_id, cantidad" });
        }

        const sql = `INSERT INTO bodega_insumo_bodegainsumo (bodega_id, insumo_id, cantidad) VALUES ($1, $2, $3)`;
        const { rowCount } = await pool.query(sql, [bodega_id, insumo_id, cantidad]);

        if (rowCount > 0) {
            res.status(201).json({ message: "Bodega-Insumo registrado" });
        } else {
            res.status(400).json({ message: "Bodega-Insumo no registrado" });
        }
    } catch (error) {
        console.error("Error al registrar bodega insumo:", error);
        res.status(500).json({ message: "Error en el sistema", error: error.message });
    }
};

export const listarBodegaInsumo = async (req, res) => {
    try {
        const sql = `SELECT * FROM bodega_insumo_bodegainsumo`;
        const { rows } = await pool.query(sql);

        if (rows.length > 0) {
            res.status(200).json(rows);
        } else {
            res.status(404).json({ message: "No hay registros en Bodega-Insumo" });
        }
    } catch (error) {
        console.error("Error al listar bodega insumo:", error);
        res.status(500).json({ message: "Error en el sistema", error: error.message });
    }
};

export const eliminarBodegaInsumo = async (req, res) => {
    try {
        const { id } = req.params;

        const sql = `DELETE FROM bodega_insumo_bodegainsumo WHERE id = $1`;
        const { rowCount } = await pool.query(sql, [id]);

        if (rowCount > 0) {
            res.status(200).json({ message: "Bodega-Insumo eliminado" });
        } else {
            res.status(404).json({ message: "Bodega-Insumo no encontrado" });
        }
    } catch (error) {
        console.error("Error al eliminar bodega insumo:", error);
        res.status(500).json({ message: "Error en el sistema", error: error.message });
    }
};

export const actualizarBodegaInsumo = async (req, res) => {
    try {
        const { bodega_id, insumo_id, cantidad } = req.body;
        const { id } = req.params;

        if (!bodega_id || !insumo_id || cantidad === undefined) {
            return res.status(400).json({ message: "Todos los campos son obligatorios: bodega_id, insumo_id, cantidad" });
        }

        const sql = `
            UPDATE bodega_insumo_bodegainsumo
            SET bodega_id = $1, insumo_id = $2, cantidad = $3
            WHERE id = $4
        `;
        const { rowCount } = await pool.query(sql, [bodega_id, insumo_id, cantidad, id]);

        if (rowCount > 0) {
            res.status(200).json({ message: "Bodega-Insumo actualizado" });
        } else {
            res.status(404).json({ message: "Bodega-Insumo no encontrado" });
        }
    } catch (error) {
        console.error("Error al actualizar bodega insumo:", error);
        res.status(500).json({ message: "Error en el sistema", error: error.message });
    }
};
