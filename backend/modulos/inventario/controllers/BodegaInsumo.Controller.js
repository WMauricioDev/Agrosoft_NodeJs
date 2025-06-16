import pool from "../../usuarios/database/Conexion.js";

export const registrarBodegaInsumo = async (req, res) => {
    try {
        const { bodega, insumo, cantidad } = req.body;

        if (!bodega || !insumo || !cantidad || cantidad < 1) {
            return res.status(400).json({ message: "bodega, insumo y cantidad (entero positivo) son requeridos" });
        }

        // Validar que bodega existe
        const bodegaCheck = await pool.query("SELECT id FROM bodega_bodega WHERE id = $1", [bodega]);
        if (bodegaCheck.rowCount === 0) {
            return res.status(400).json({ message: "bodega no válido" });
        }

        // Validar que insumo existe
        const insumoCheck = await pool.query("SELECT id FROM insumos_insumo WHERE id = $1", [insumo]);
        if (insumoCheck.rowCount === 0) {
            return res.status(400).json({ message: "insumo no válido" });
        }

        const sql = `
            INSERT INTO bodega_insumo_bodegainsumo (bodega_id, insumo_id, cantidad)
            VALUES ($1, $2, $3) RETURNING id
        `;
        const { rows } = await pool.query(sql, [bodega, insumo, cantidad]);

        res.status(201).json({ message: "Bodega-Insumo registrado", id: rows[0].id });
    } catch (error) {
        if (error.code === "23503") { // Error de violación de clave foránea en PostgreSQL
            res.status(400).json({ message: "bodega o insumo no válido" });
        } else {
            console.error(error);
            res.status(500).json({ message: "Error en el sistema", error: error.message });
        }
    }
};

export const listarBodegaInsumo = async (req, res) => {
    try {
        const sql = `
            SELECT 
                bi.id AS id,
                bi.bodega_id AS bodega,
                bi.insumo_id AS insumo,
                bi.cantidad AS cantidad
            FROM bodega_insumo_bodegainsumo bi
            INNER JOIN bodega_bodega b ON bi.bodega_id = b.id
            INNER JOIN insumos_insumo i ON bi.insumo_id = i.id
        `;

        const { rows } = await pool.query(sql);
        
        if (rows.length > 0) {
            res.status(200).json(rows);
        } else {
            res.status(404).json({ message: "No hay registros en Bodega-Insumo" });
        }
    } catch (error) {
        console.error("Error al listar bodega insumo:", error);
        res.status(500).json({ message: "Error al obtener datos", error: error.message });
    }
};

export const eliminarBodegaInsumo = async (req, res) => {
    console.log(`📌 Solicitud DELETE recibida para ID: ${req.params.id}`);
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
        console.error(error);
        res.status(500).json({ message: "Error en el sistema", error: error.message });
    }
};

export const actualizarBodegaInsumo = async (req, res) => {
    console.log(`📌 Solicitud PUT recibida para ID: ${req.params.id}, Payload:`, req.body);
    try {
        const { bodega, insumo, cantidad } = req.body;
        const { id } = req.params;

        if (!bodega || !insumo || !cantidad || cantidad < 1) {
            return res.status(400).json({ message: "bodega, insumo y cantidad (entero positivo) son requeridos" });
        }

        const bodegaCheck = await pool.query("SELECT id FROM bodega_bodega WHERE id = $1", [bodega]);
        if (bodegaCheck.rowCount === 0) {
            return res.status(400).json({ message: "bodega no válido" });
        }

        const insumoCheck = await pool.query("SELECT id FROM insumos_insumo WHERE id = $1", [insumo]);
        if (insumoCheck.rowCount === 0) {
            return res.status(400).json({ message: "insumo no válido" });
        }

        const sql = `
            UPDATE bodega_insumo_bodegainsumo
            SET bodega_id = $1, insumo_id = $2, cantidad = $3
            WHERE id = $4
        `;
        const { rowCount } = await pool.query(sql, [bodega, insumo, cantidad, id]);
        
        if (rowCount > 0) {
            res.status(200).json({ message: "Bodega-Insumo actualizado" });
        } else {
            res.status(404).json({ message: "Bodega-Insumo no encontrado" });
        }
    } catch (error) {
        if (error.code === "23503") {
            res.status(400).json({ message: "bodega o insumo no válido" });
        } else {
            console.error(error);
            res.status(500).json({ message: "Error en el sistema", error: error.message });
        }
    }
};