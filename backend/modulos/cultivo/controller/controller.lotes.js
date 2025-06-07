import pool from "../../usuarios/database/Conexion.js";

export const postLote = async (req, res) => {
    try {
        const { nombre, descripcion, activo, tam_x, tam_y, latitud, longitud } = req.body;
        const sql = `
            INSERT INTO lotes_lote (nombre, descripcion, activo, tam_x, tam_y, latitud, longitud)
            VALUES($1, $2, $3, $4, $5, $6, $7)
        `;
        const rows = await pool.query(sql, [nombre, descripcion, activo, tam_x, tam_y, latitud, longitud]);

        if (rows.rowCount > 0) {
            return res.status(200).json({ message: "Lote registrado correctamente" });
        } else {
            return res.status(404).json({ message: "No se pudo registrar el lote" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
};

export const getLote = async (req, res) => {
    try {
        const sql = `
            SELECT id, nombre, descripcion, activo, tam_x, tam_y, latitud, longitud
            FROM lotes_lote
        `;

        const result = await pool.query(sql);

        if (result.rows.length > 0) {
            const lotes = result.rows.map(l => ({
                id: l.id,
                nombre: l.nombre,
                descripcion: l.descripcion,
                activo: l.activo,
                tam_x: l.tam_x,
                tam_y: l.tam_y,
                latitud: l.latitud,
                longitud: l.longitud
            }));

            res.status(200).json({ lotes });
        } else {
            res.status(404).json({ msg: 'No hay lotes registrados' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

export const IdLote = async (req, res) => {
    try {
        const { id } = req.params;

        const sql = `
            SELECT id, nombre, descripcion, activo, tam_x, tam_y, latitud, longitud
            FROM lotes_lote
            WHERE id = $1
        `;

        const result = await pool.query(sql, [id]);

        if (result.rows.length > 0) {
            const lotes = result.rows.map(l => ({
                id: l.id,
                nombre: l.nombre,
                descripcion: l.descripcion,
                activo: l.activo,
                tam_x: l.tam_x,
                tam_y: l.tam_y,
                latitud: l.latitud,
                longitud: l.longitud
            }));

            res.status(200).json({ lotes });
        } else {
            res.status(404).json({ msg: 'No se encontró el lote' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en el servidor." });
    }
};

export const actualizarLote = async (req, res) => {
    try {
        const { nombre, descripcion, activo, tam_x, tam_y, latitud, longitud } = req.body;
        const { id } = req.params;

        const sql = `
            UPDATE lotes_lote
            SET nombre = $1, descripcion = $2, activo = $3, tam_x = $4, tam_y = $5, latitud = $6, longitud = $7
            WHERE id = $8
        `;
        const { rowCount } = await pool.query(sql, [nombre, descripcion, activo, tam_x, tam_y, latitud, longitud, id]);

        if (rowCount > 0) {
            return res.status(200).json({ message: "Lote editado correctamente." });
        } else {
            return res.status(404).json({ message: "No se pudo editar el lote." });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor." });
    }
};

export const deleteLote = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = `DELETE FROM lotes_lote WHERE id = $1`;
        const { rowCount } = await pool.query(sql, [id]);

        if (rowCount > 0) {
            return res.status(200).json({ message: "Lote eliminado correctamente." });
        } else {
            return res.status(404).json({ message: "No se encontró el lote para eliminar." });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor." });
    }
};
