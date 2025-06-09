import pool from "../../usuarios/database/Conexion.js";

export const postPlagas = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    let { fk_tipo_plaga_id } = req.body;

    if (!nombre) {
      return res.status(400).json({ message: "El nombre de la plaga es requerido" });
    }

    // Validación de tipo_plaga obligatorio
    if (!fk_tipo_plaga_id) {
      return res.status(400).json({ message: "El tipo de plaga es requerido" });
    }

    fk_tipo_plaga_id = parseInt(fk_tipo_plaga_id);

    if (isNaN(fk_tipo_plaga_id)) {
      return res.status(400).json({ message: "El tipo de plaga debe ser un número válido" });
    }

    // Obtener la ruta de la imagen si fue subida
    let rutaImagen = null;
    if (req.file) {
      rutaImagen = req.file.path.replace(/\\/g, '/');
      const uploadIndex = rutaImagen.indexOf('uploads');
      if (uploadIndex !== -1) {
        rutaImagen = rutaImagen.slice(uploadIndex);
      }
    }

    const sql = `
      INSERT INTO plagas_plaga (nombre, descripcion, img, fk_tipo_plaga_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `;

    const result = await pool.query(sql, [nombre, descripcion, rutaImagen, fk_tipo_plaga_id]);

    if (result.rows.length > 0) {
      return res.status(201).json({
        message: "Plaga registrada correctamente",
        id: result.rows[0].id
      });
    }

    return res.status(400).json({ message: "No se pudo registrar la plaga" });
  } catch (error) {
    console.error('Error en postPlagas:', error);
    return res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};

export const getPlagas = async (req, res) => {
  try {
    const sql = `
      SELECT 
        p.*, 
        tp.nombre AS tipo_plaga_nombre
      FROM 
        plagas_plaga p
      JOIN 
        tipo_plaga_tipoplaga tp 
      ON 
        p.fk_tipo_plaga_id = tp.id;
    `;
    const result = await pool.query(sql);
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error en getPlagas:', error);
    return res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};

export const getIdPlagas = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "SELECT * FROM plagas_plaga WHERE id = $1";
        const result = await pool.query(sql, [id]);
        if (result.rows.length > 0) {
            return res.status(200).json(result.rows[0]);
        } else {
            return res.status(404).json({ "message": "Plaga no encontrada" });
        }
    } catch (error) {
        console.error('Error en getIdPlagas:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};

export const updatePlagas = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, img, fk_tipo_plaga_id } = req.body;
        if (!nombre) {
            return res.status(400).json({ "message": "El nombre de la plaga es requerido" });
        }
        const sql = "UPDATE plagas_plaga SET nombre = $1, descripcion = $2, img = $3, fk_tipo_plaga_id = $4 WHERE id = $5";
        const result = await pool.query(sql, [nombre, descripcion, img, fk_tipo_plaga_id, id]);
        if (result.rowCount > 0) {
            return res.status(200).json({ "message": "Plaga actualizada correctamente" });
        }
        return res.status(404).json({ "message": "No se pudo actualizar la plaga" });
    } catch (error) {
        console.error('Error en updatePlagas:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};

export const deletePlagas = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "DELETE FROM plagas_plaga WHERE id = $1";
        const result = await pool.query(sql, [id]);
        if (result.rowCount > 0) {
            return res.status(200).json({ "message": "Plaga eliminada correctamente" });
        }
        return res.status(404).json({ "message": "No se pudo eliminar la plaga" });
    } catch (error) {
        console.error('Error en deletePlagas:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};
