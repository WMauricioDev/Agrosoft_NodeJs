import pool from "../../usuarios/database/Conexion.js";
import multer from "multer";
import path from "path";
import fs from "fs";


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/especies/";
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

export const postEspecies = async (req, res) => {
  try {
    upload.single("img")(req, res, async (err) => {
      if (err) {
        console.error('Error en multer:', err);
        return res.status(500).json({ message: "Error al subir la imagen" });
      }

      const { nombre, descripcion, largoCrecimiento, fk_tipo_especie } = req.body;
      const img = req.file ? `/uploads/especies/${req.file.filename}` : null;

      if (!nombre || !fk_tipo_especie) {
        return res.status(400).json({ message: "El nombre y el tipo de especie son requeridos" });
      }

      const sql = `
        INSERT INTO especies_especie (nombre, descripcion, img, "largoCrecimiento", fk_tipo_especie_id) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING id
      `;
      const values = [nombre, descripcion, img, largoCrecimiento, fk_tipo_especie];
      const result = await pool.query(sql, values);

      if (result.rows.length > 0) {
        return res.status(201).json({ 
          message: "Especie registrada correctamente",
          id: result.rows[0].id
        });
      }
      return res.status(400).json({ message: "No se pudo registrar la especie" });
    });
  } catch (error) {
    console.error('Error en postEspecies:', error);
    return res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};

export const getEspecies = async (req, res) => {
  try {
    const sql = `SELECT id, nombre, descripcion, img, "largoCrecimiento", fk_tipo_especie_id FROM especies_especie`;
    const result = await pool.query(sql);
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error en getEspecies:', error);
    return res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};

export const getIdEspecies = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `SELECT id, nombre, descripcion, img, "largoCrecimiento", fk_tipo_especie_id FROM especies_especie WHERE id = $1`;
    const result = await pool.query(sql, [id]);
    if (result.rows.length > 0) {
      return res.status(200).json(result.rows[0]);
    } else {
      return res.status(404).json({ message: "Especie no encontrada" });
    }
  } catch (error) {
    console.error('Error en getIdEspecies:', error);
    return res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};

export const updateEspecies = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, largoCrecimiento, fk_tipo_especie } = req.body;

    if (!nombre || !fk_tipo_especie) {
      return res.status(400).json({ message: "El nombre y el tipo de especie son requeridos" });
    }

    const sql = `
      UPDATE especies_especie 
      SET nombre = $1, descripcion = $2, "largoCrecimiento" = $3, fk_tipo_especie_id = $4 
      WHERE id = $5
    `;
    const values = [nombre, descripcion, largoCrecimiento, fk_tipo_especie, id];
    const result = await pool.query(sql, values);

    if (result.rowCount > 0) {
      return res.status(200).json({ message: "Especie actualizada correctamente" });
    }
    return res.status(404).json({ message: "No se pudo actualizar la especie" });
  } catch (error) {
    console.error('Error en updateEspecies:', error);
    return res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};

export const deleteEspecies = async (req, res) => {
  try {
    const { id } = req.params;

    const sqlSelect = `SELECT img FROM especies_especie WHERE id = $1`;
    const imgResult = await pool.query(sqlSelect, [id]);
    if (imgResult.rows.length > 0 && imgResult.rows[0].img) {
      const imgPath = path.join(process.cwd(), imgResult.rows[0].img);
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    }

    const sql = `DELETE FROM especies_especie WHERE id = $1`;
    const result = await pool.query(sql, [id]);

    if (result.rowCount > 0) {
      return res.status(200).json({ message: "Especie eliminada correctamente" });
    }
    return res.status(404).json({ message: "No se pudo eliminar la especie" });
  } catch (error) {
    console.error('Error en deleteEspecies:', error);
    return res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};