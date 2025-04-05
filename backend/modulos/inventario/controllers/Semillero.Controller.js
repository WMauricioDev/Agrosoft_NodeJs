import pool from "../../usuarios/database/Conexion.js"

export const registrarSemillero = async (req, res) => {
    try {
        const { fk_especie, unidad_medida, fecha_siembra, fecha_estimada } = req.body
        const sql = `INSERT INTO semilleros (fk_especie, unidad_medida, fecha_siembra, fecha_estimada) VALUES ($1, $2, $3, $4) RETURNING id`
        const { rows } = await pool.query(sql, [fk_especie, unidad_medida, fecha_siembra, fecha_estimada])
        res.status(200).json({ "message": "Semillero registrado", "id": rows[0].id })
    } catch (error) {
        res.status(500).json({ "message": "Error en el sistema", "error": error.message })
    }
};

export const listarSemilleros = async (req, res) => {
    try {
        const sql = `
            SELECT s.id, s.unidad_medida, s.fecha_siembra, s.fecha_estimada,
                   e.nombre AS especie, e.descripcion, e.img, e.tiempo_crecimiento
            FROM semilleros s
            JOIN especies e ON s.fk_especie = e.id
        `;
        const { rows } = await pool.query(sql)
        
        if (rows.length > 0) {
            res.status(200).json(rows)
        } else {
            res.status(404).json({ message: "No hay registros de semilleros" })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el sistema", error: error.message })
    }
};


export const eliminarSemillero = async (req, res) => {
    try {
        const { id } = req.params
        const sql = `DELETE FROM semilleros WHERE id = $1`
        const { rowCount } = await pool.query(sql, [id])
        if (rowCount > 0) {
            res.status(200).json({ "message": "Semillero eliminado" })
        } else {
            res.status(404).json({ "message": "Semillero no encontrado" })
        }
    } catch (error) {
        res.status(500).json({ "message": "Error en el sistema", "error": error.message })
    }
};

export const actualizarSemillero = async (req, res) => {
    try {
        const { fk_especie, unidad_medida, fecha_siembra, fecha_estimada } = req.body
        const { id } = req.params
        const sql = `UPDATE semilleros SET fk_especie = $1, unidad_medida = $2, fecha_siembra = $3, fecha_estimada = $4 WHERE id = $5`
        const { rowCount } = await pool.query(sql, [fk_especie, unidad_medida, fecha_siembra, fecha_estimada, id]);
        if (rowCount > 0) {
            res.status(200).json({ "message": "Semillero actualizado" })
        } else {
            res.status(404).json({ "message": "Semillero no encontrado" })
        }
    } catch (error) {
        res.status(500).json({ "message": "Error en el sistema", "error": error.message })
    }
};