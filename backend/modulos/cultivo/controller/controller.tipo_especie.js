import pool from "../../usuarios/database/Conexion.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configuración de multer para almacenar imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/tipo_especies/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

export const postTipo_especie = async (req, res) => {
  try {
    upload.single("img")(req, res, async (err) => {
      if (err) {
        console.error('Error en multer:', err);
        return res.status(500).json({ message: "Error al subir la imagen" });
      }

      const { nombre, descripcion } = req.body;
      const img = req.file ? `/uploads/tipo_especies/${req.file.filename}` : null;

      if (!nombre) {
        return res.status(400).json({ message: "El nombre es un campo requerido" });
      }

      const sql = "INSERT INTO tipo_especie (nombre, descripcion, img) VALUES ($1, $2, $3) RETURNING id";
      const values = [nombre, descripcion, img];
      const result = await pool.query(sql, values);

      if (result.rows.length > 0) {
        return res.status(201).json({ 
          message: "Tipo de especie registrado correctamente",
          id: result.rows[0].id
        });
      }
      return res.status(400).json({ message: "No se pudo registrar el tipo de especie" });
    });
  } catch (error) {
    console.error('Error en postTipo_especie:', error);
    return res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};

export const getTipo_especie = async (req, res) => {
  try {
    const sql = "SELECT id, nombre, descripcion, img FROM tipo_especie ORDER BY nombre";
    const result = await pool.query(sql);
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error en getTipo_especie:', error);
    return res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};

export const getIdTipo_especie = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "SELECT id, nombre, descripcion, img FROM tipo_especie WHERE id = $1";
    const result = await pool.query(sql, [id]);
    if (result.rows.length > 0) {
      return res.status(200).json(result.rows[0]);
    } else {
      return res.status(404).json({ message: "Tipo de especie no encontrado" });
    }
  } catch (error) {
    console.error('Error en getIdTipo_especie:', error);
    return res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};

export const updateTipo_especie = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, img } = req.body;

    if (!nombre) {
      return res.status(400).json({ message: "El nombre es un campo requerido" });
    }

    const sql = "UPDATE tipo_especie SET nombre = $1, descripcion = $2, img = $3 WHERE id = $4";
    const values = [nombre, descripcion, img, id];
    const result = await pool.query(sql, values);

    if (result.rowCount > 0) {
      return res.status(200).json({ message: "Tipo de especie actualizado correctamente" });
    }
    return res.status(404).json({ message: "No se pudo actualizar el tipo de especie" });
  } catch (error) {
    console.error('Error en updateTipo_especie:', error);
    return res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};

export const deleteTipo_especie = async (req, res) => {
  try {
    const { id } = req.params;

    // Opcional: Eliminar la imagen del servidor si existe
    const sqlSelect = "SELECT img FROM tipo_especie WHERE id = $1";
    const imgResult = await pool.query(sqlSelect, [id]);
    if (imgResult.rows.length > 0 && imgResult.rows[0].img) {
      const imgPath = path.join(process.cwd(), imgResult.rows[0].img);
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    }

    const sql = "DELETE FROM tipo_especie WHERE id = $1";
    const result = await pool.query(sql, [id]);

    if (result.rowCount > 0) {
      return res.status(200).json({ message: "Tipo de especie eliminado correctamente" });
    }
    return res.status(404).json({ message: "No se pudo eliminar el tipo de especie" });
  } catch (error) {
    console.error('Error en deleteTipo_especie:', error);
    return res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};