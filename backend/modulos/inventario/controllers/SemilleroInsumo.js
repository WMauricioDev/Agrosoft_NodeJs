import pool from "../../usuarios/database/Conexion.js"


export const registrarSemilleroInsumo = async (req, res) => {
    try {
        const { id_semillero, id_insumo, cantidad_necesaria, id_bodega } = req.body
        if (!id_semillero || !id_insumo || !cantidad_necesaria || !id_bodega) {
            return res.status(400).json({ "message": "Todos los campos son obligatorios" })
        }
        const sql = `INSERT INTO semillero_insumo (id_semillero, id_insumo, cantidad_necesaria, id_bodega) VALUES ($1, $2, $3, $4) RETURNING id_semillero_insumo`
        const { rows } = await pool.query(sql, [id_semillero, id_insumo, cantidad_necesaria, id_bodega])
        res.status(201).json({ "message": "Semillero Insumo registrado", "id": rows[0].id_semillero_insumo })
    } catch (error) {
        res.status(500).json({ "message": "Error en el sistema", "error": error.message })
    }
};
export const listarSemilleroInsumo = async (req, res) => {
    try {
        const sql = `
            SELECT si.id_semillero_insumo, si.cantidad_necesaria,
                   s.unidad_medida AS unidad_semillero, s.fecha_siembra, s.fecha_estimada,
                   i.nombre AS nombre_insumo, i.descripcion AS descripcion_insumo, i.precio, i.unidad_medida AS unidad_insumo,
                   b.nombre AS nombre_bodega, b.ubicacion AS ubicacion_bodega
            FROM semillero_insumo si
            JOIN semilleros s ON si.id_semillero = s.id
            JOIN insumos i ON si.id_insumo = i.id
            JOIN bodega b ON si.id_bodega = b.id_bodega
        `;
        const { rows } = await pool.query(sql);
        
        if (rows.length > 0) {
            res.status(200).json(rows);
        } else {
            res.status(404).json({ message: "No hay registros de Semillero Insumo" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el sistema", error: error.message });
    }
};


export const eliminarSemilleroInsumo = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(400).json({ "message": "ID es obligatorio" })
        }
        const sql = `DELETE FROM semillero_insumo WHERE id_semillero_insumo = $1`
        const { rowCount } = await pool.query(sql, [id])
        if (rowCount > 0) {
            res.status(200).json({ "message": "Semillero Insumo eliminado" })
        } else {
            res.status(404).json({ "message": "Semillero Insumo no encontrado" })
        }
    } catch (error) {
        res.status(500).json({ "message": "Error en el sistema", "error": error.message })
    }
};

export const actualizarSemilleroInsumo = async (req, res) => {
    try {
        const { id_semillero, id_insumo, cantidad_necesaria, id_bodega } = req.body
        const { id } = req.params
        if (!id_semillero || !id_insumo || !cantidad_necesaria || !id_bodega || !id) {
            return res.status(400).json({ "message": "Todos los campos son obligatorios" })
        }
        const sql = `UPDATE semillero_insumo SET id_semillero=$1, id_insumo=$2, cantidad_necesaria=$3, id_bodega=$4 WHERE id_semillero_insumo=$5`
        const { rowCount } = await pool.query(sql, [id_semillero, id_insumo, cantidad_necesaria, id_bodega, id])
        if (rowCount > 0) {
            res.status(200).json({ "message": "Semillero Insumo actualizado" })
        } else {
            res.status(404).json({ "message": "Semillero Insumo no encontrado" })
        }
    } catch (error) {
        res.status(500).json({ "message": "Error en el sistema", "error": error.message })
    }
};
