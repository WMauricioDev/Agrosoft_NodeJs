import pool from "../../usuarios/database/Conexion.js";

export const postMapa = async (req, res) => {
    try {
        const { nombre, descripcion, latitud, longitud, cultivo_id, usuario_id } = req.body;

        const sql = `
            INSERT INTO mapa_puntomapa (nombre, descripcion, latitud, longitud, cultivo_id, usuario_id)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;

        const values = [
            nombre,
            descripcion,
            latitud,
            longitud,
            cultivo_id || null,
            usuario_id || null
        ];

        const result = await pool.query(sql, values);

        if (result.rowCount > 0) {
            return res.status(200).json({ message: "Mapa registrado correctamente" });
        } else {
            return res.status(404).json({ message: "No se pudo registrar el mapa" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
};


export const getMapa = async (req, res) => {
    try {
        const sql = `
            SELECT 
                mp.id,
                mp.nombre,
                mp.descripcion,
                mp.latitud,
                mp.longitud,
                c.nombre AS cultivo_nombre,
                u.nombre AS usuario_nombre
            FROM mapa_puntomapa mp
            LEFT JOIN cultivos_cultivo c ON mp.cultivo_id = c.id
            LEFT JOIN usuarios_usuarios u ON mp.usuario_id = u.id
        `;
        const result = await pool.query(sql);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
};

export const getMapaById = async (req, res) => {
    const { id } = req.params;
    try {
        const sql = `
            SELECT 
                mp.id,
                mp.nombre,
                mp.descripcion,
                mp.latitud,
                mp.longitud,
                c.nombre AS cultivo_nombre,
                u.nombre AS usuario_nombre
            FROM mapa_puntomapa mp
            LEFT JOIN cultivos_cultivo c ON mp.cultivo_id = c.id
            LEFT JOIN usuarios_usuarios u ON mp.usuario_id = u.id
            WHERE mp.id = $1
        `;
        const result = await pool.query(sql, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Punto no encontrado" });
        }
        return res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
};

export const updateMapa = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, latitud, longitud, cultivo_id, usuario_id } = req.body;
    try {
        const sql = `
            UPDATE mapa_puntomapa
            SET nombre = $1,
                descripcion = $2,
                latitud = $3,
                longitud = $4,
                cultivo_id = $5,
                usuario_id = $6
            WHERE id = $7
            RETURNING *
        `;
        const values = [nombre, descripcion, latitud, longitud, cultivo_id, usuario_id, id];
        const result = await pool.query(sql, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Punto no encontrado" });
        }

        return res.status(200).json({ message: "Punto actualizado", punto: result.rows[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
};

export const deleteMapa = async (req, res) => {
    const { id } = req.params;
    try {
        const sql = `DELETE FROM mapa_puntomapa WHERE id = $1 RETURNING *`;
        const result = await pool.query(sql, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Punto no encontrado" });
        }

        return res.status(200).json({ message: "Punto eliminado", punto: result.rows[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
};


