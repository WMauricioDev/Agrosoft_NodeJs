import pool from "../../usuarios/database/Conexion.js";

export const postBancal = async (req, res) => {
    try {
        const { nombre, tam_x, tam_y, latitud, longitud, lote_id } = req.body;
        const sql = `
            INSERT INTO bancal_bancal (nombre, tam_x, tam_y, latitud, longitud, lote_id)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;
        const result = await pool.query(sql, [nombre, tam_x, tam_y, latitud, longitud, lote_id]);
        if (result.rowCount > 0) {
            return res.status(200).json({ message: "Bancal registrado correctamente" });
        }
        return res.status(404).json({ message: "No se pudo registrar el bancal" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
};

export const getBancal = async (req, res) => {
  try {
    console.log("Buscando todos los bancales...");
    const sql = `SELECT * FROM bancal_bancal`;
    const result = await pool.query(sql);

    if (result.rows.length > 0) {
      return res.status(200).json(result.rows);
    }

    return res.status(404).json({ msg: "No hay bancales registrados" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error en el servidor" });
  }
};


export const IdBancal = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Buscando bancal por ID ", id);
        const sql = `
            SELECT
                b.id,
                b.nombre,
                b.tam_x,
                b.tam_y,
                b.latitud,
                b.longitud,
                b.lote_id,
                l.nombre AS lote_nombre,
                l.descripcion,
                l.activo,
                l.tam_x AS lote_tam_x,
                l.tam_y AS lote_tam_y,
                l.latitud AS lote_latitud,
                l.longitud AS lote_longitud
            FROM bancal_bancal b
            JOIN lotes_lote l ON b.lote_id = l.id
            WHERE b.id = $1
        `;
        const result = await pool.query(sql, [id]);
        if (result.rows.length > 0) {
            const bancales = result.rows.map(b => ({
                id: b.id,
                nombre: b.nombre,
                tam_x: b.tam_x,
                tam_y: b.tam_y,
                latitud: b.latitud,
                longitud: b.longitud,
                lote: {
                    id: b.lote_id,
                    nombre: b.lote_nombre,
                    descripcion: b.descripcion,
                    activo: b.activo,
                    tam_x: b.lote_tam_x,
                    tam_y: b.lote_tam_y,
                    latitud: b.lote_latitud,
                    longitud: b.lote_longitud
                }
            }));
            return res.status(200).json({ bancales });
        }
        return res.status(404).json({ msg: "No se encontró el bancal" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
};

export const actualizarBancal = async (req, res) => {
    try {
        const { nombre, tam_x, tam_y, latitud, longitud, lote_id } = req.body;
        const { id } = req.params;
        const sql = `
            UPDATE bancal_bancal
            SET nombre = $1, tam_x = $2, tam_y = $3, latitud = $4, longitud = $5, lote_id = $6
            WHERE id = $7
        `;
        const { rowCount } = await pool.query(sql, [nombre, tam_x, tam_y, latitud, longitud, lote_id, id]);
        if (rowCount > 0) {
            return res.status(200).json({ message: "Bancal editado correctamente" });
        }
        return res.status(404).json({ message: "No se pudo editar el bancal" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
};

export const deleteBancal = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = `DELETE FROM bancal_bancal WHERE id = $1`;
        const { rowCount } = await pool.query(sql, [id]);
        if (rowCount > 0) {
            return res.status(200).json({ message: "Bancal eliminado correctamente" });
        }
        return res.status(404).json({ message: "No se encontró el bancal para eliminar" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
};