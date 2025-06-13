import pool from "../../usuarios/database/Conexion.js";

export const postMapa = async (req, res) => {
    try {
        const { nombre, descripcion, latitud, longitud } = req.body;
        const sql = `
            INSERT INTO mapa_puntomapa (nombre, descripcion,  latitud, longitud)
            VALUES($1, $2, $3, $4)
        `;
        const rows = await pool.query(sql, [nombre, descripcion,latitud, longitud]);

        if (rows.rowCount > 0) {
            return res.status(200).json({ message: "mapa registrado correctamente" });
        } else {
            return res.status(404).json({ message: "No se pudo registrar el mapa" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
};

