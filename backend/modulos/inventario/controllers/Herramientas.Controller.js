import pool from "../../usuarios/database/Conexion.js"

export const registrarHerramienta = async (req, res) => {
    try {
        const { fk_lote, nombre, descripcion, unidades } = req.body
        const sql = `INSERT INTO Herramientas (fk_lote, nombre, descripcion, unidades) VALUES ($1, $2, $3, $4)`
        const { rowCount } = await pool.query(sql, [fk_lote, nombre, descripcion, unidades])
        
        if (rowCount > 0) {
            res.status(201).json({ "message": "Herramienta registrada" })
        } else {
            res.status(400).json({ "message": "No se pudo registrar la herramienta" })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ "message": "Error en el servidor" })
    }
};

export const listarHerramientas = async (req, res) => {
    try {
        const sql = `
            SELECT 
                h.id, 
                h.nombre, 
                h.descripcion,
                h.unidades, 
                h.fk_lote, 
                l.nombre AS nombre_lote 
            FROM Herramientas h
            INNER JOIN Lotes l ON h.fk_lote = l.id
            ORDER BY h.nombre ASC
        `;
        const { rows } = await pool.query(sql);
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error al listar herramientas:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};


export const eliminarHerramienta = async (req, res) => {
    try {
        const id = req.params.id
        const sql = `DELETE FROM Herramientas WHERE id = $1`
        const { rowCount } = await pool.query(sql, [id])
        
        if (rowCount > 0) {
            res.status(200).json({ "message": "Herramienta eliminada" })
        } else {
            res.status(404).json({ "message": "Herramienta no encontrada" })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ "message": "Error en el servidor" })
    }
};

export const actualizarHerramienta = async (req, res) => {
    try {
        const { fk_lote, nombre, descripcion, unidades } = req.body
        const id = req.params.id
        const sql = `UPDATE Herramientas SET fk_lote = $1, nombre = $2, descripcion = $3, unidades = $4 WHERE id = $5`
        const { rowCount } = await pool.query(sql, [fk_lote, nombre, descripcion, unidades, id])
        
        if (rowCount > 0) {
            res.status(200).json({ "message": "Herramienta actualizada" })
        } else {
            res.status(404).json({ "message": "Herramienta no encontrada" })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ "message": "Error en el servidor" })
    }
};
