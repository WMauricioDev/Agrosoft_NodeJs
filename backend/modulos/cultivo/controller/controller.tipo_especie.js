import pool from "../../usuarios/database/Conexion.js";

export const postTipo_especie = async (req, res) => {
  try {
    console.log("Datos recibidos en el backend:", { body: req.body, file: req.file });
    const { nombre, descripcion } = req.body;
    const img = req.file ? `modulos/uploads/${req.file.filename}` : null;

    if (!nombre) {
      return res.status(400).json({ message: "El nombre es un campo requerido" });
    }

    const sql = "INSERT INTO tipo_especies_tipoespecie (nombre, descripcion, img) VALUES ($1, $2, $3) RETURNING id";
    const result = await pool.query(sql, [nombre, descripcion, img]);

    if (result.rows.length > 0) {
      return res.status(201).json({
        message: "Tipo de especie registrado correctamente",
        id: result.rows[0].id,
      });
    }
    return res.status(400).json({ message: "No se pudo registrar el tipo de especie" });
  } catch (error) {
    console.error('Error en postTipo_especie:', error);
    if (error.message === 'El archivo debe ser una imagen') {
      return res.status(400).json({ message: error.message });
    }
    if (error.code === '23505') { // Violación de unicidad en PostgreSQL
      return res.status(400).json({ message: "El nombre ya existe en la base de datos" });
    }
    return res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};

export const getTipo_especie = async (req, res) => {
    try {
        const sql = "SELECT * FROM tipo_especies_tipoespecie ORDER BY nombre";
        const result = await pool.query(sql);
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error en getTipo_especie:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};

export const getIdTipo_especie = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "SELECT * FROM tipo_especies_tipoespecie WHERE id = $1";
        const result = await pool.query(sql, [id]);
        if (result.rows.length > 0) {
            return res.status(200).json(result.rows[0]);
        } else {
            return res.status(404).json({ "message": "Tipo de especie no encontrado" });
        }
    } catch (error) {
        console.error('Error en getIdTipo_especie:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};

export const updateTipo_especie = async (req, res) => {
  try {
    console.log("Datos recibidos en updateTipo_especie:", { body: req.body, file: req.file });
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    const img = req.file ? `modulos/uploads/${req.file.filename}` : req.body.img;

    if (!nombre) {
      return res.status(400).json({ message: "El nombre es un campo requerido" });
    }

    const sql = "UPDATE tipo_especies_tipoespecie SET nombre = $1, descripcion = $2, img = $3 WHERE id = $4";
    const result = await pool.query(sql, [nombre, descripcion, img, id]);

    if (result.rowCount > 0) {
      return res.status(200).json({ message: "Tipo de especie actualizado correctamente" });
    }
    return res.status(404).json({ message: "No se pudo actualizar el tipo de especie" });
  } catch (error) {
    console.error('Error en updateTipo_especie:', error);
    if (error.message === 'El archivo debe ser una imagen') {
      return res.status(400).json({ message: error.message });
    }
    if (error.code === '23505') {
      return res.status(400).json({ message: "El nombre ya existe en la base de datos" });
    }
    return res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};

export const deleteTipo_especie = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "DELETE FROM tipo_especies_tipoespecie WHERE id = $1";
        const result = await pool.query(sql, [id]);
        if (result.rowCount > 0) {
            return res.status(200).json({ "message": "Tipo de especie eliminado correctamente" });
        }
        return res.status(404).json({ "message": "No se pudo eliminar el tipo de especie" });
    } catch (error) {
        console.error('Error en deleteTipo_especie:', error);
        return res.status(500).json({ "message": "Error en el servidor", "error": error.message });
    }
};

