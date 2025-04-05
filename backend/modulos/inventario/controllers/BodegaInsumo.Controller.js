import pool from "../../usuarios/database/Conexion.js"

export const registrarBodegaInsumo = async (req, res) => {
    try {
        const { id_bodega, id_insumo, cantidad_disponible } = req.body
        const sql = `INSERT INTO bodega_insumo (id_bodega, id_insumo, cantidad_disponible) VALUES ($1, $2, $3)`
        const { rowCount } = await pool.query(sql, [id_bodega, id_insumo, cantidad_disponible])
        
        if (rowCount > 0) {
            res.status(201).json({ message: "Bodega-Insumo registrado" })
        } else {
            res.status(400).json({ message: "Bodega-Insumo no registrado" })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Error en el sistema" })
    }
};

export const listarBodegaInsumo = async (req, res) => {
    try {
        const sql = `
            SELECT 
                bi.id_bodega_insumo, 
                b.nombre AS nombre_bodega, 
                i.nombre AS nombre_insumo, 
                bi.cantidad_disponible
            FROM bodega_insumo bi
            JOIN bodega b ON bi.id_bodega = b.id_bodega
            JOIN insumos i ON bi.id_insumo = i.id
            ORDER BY b.nombre, i.nombre;
        `;

        const { rows } = await pool.query(sql);
        
        if (rows.length > 0) {
            res.status(200).json(rows);
        } else {
            res.status(404).json({ message: "No hay registros en Bodega_Insumo" });
        }
    } catch (error) {
        console.error("Error al listar bodega insumo:", error);
        res.status(500).json({ message: "Error al obtener datos", error: error.message });
    }
};


export const eliminarBodegaInsumo = async (req, res) => {
    try {
        const id = req.params.id
        const sql = `DELETE FROM bodega_insumo WHERE id_bodega_insumo = $1`
        const { rowCount } = await pool.query(sql, [id])
        
        if (rowCount > 0) {
            res.status(200).json({ message: "Bodega-Insumo eliminado" })
        } else {
            res.status(404).json({ message: "Bodega-Insumo no encontrado" })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Error en el sistema" })
    }
};

export const actualizarBodegaInsumo = async (req, res) => {
    try {
        const { id_bodega, id_insumo, cantidad_disponible } = req.body
        const id = req.params.id
        const sql = `UPDATE bodega_insumo SET id_bodega = $1, id_insumo = $2, cantidad_disponible = $3 WHERE id_bodega_insumo = $4`
        const { rowCount } = await pool.query(sql, [id_bodega, id_insumo, cantidad_disponible, id])
        
        if (rowCount > 0) {
            res.status(200).json({ message: "Bodega-Insumo actualizado" })
        } else {
            res.status(404).json({ message: "Bodega-Insumo no encontrado" })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Error en el sistema" })
    }
};