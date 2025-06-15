import pool from "../../usuarios/database/Conexion.js";

export const registrarHerramienta = async (req, res) => {
  try {
    const { nombre, descripcion, cantidad, estado, activo, fecha_registro, precio } = req.body;
    const sql = `
      INSERT INTO herramientas_herramienta (nombre, descripcion, cantidad, estado, activo, fecha_registro, precio) 
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    const { rowCount } = await pool.query(sql, [nombre, descripcion, cantidad, estado, activo, fecha_registro, precio]);

    if (rowCount > 0) {
      res.status(201).json({ message: "Herramienta registrada" });
    } else {
      res.status(400).json({ message: "No se pudo registrar la herramienta" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const listarHerramientas = async (req, res) => {
  try {
    const sql = `
      SELECT 
        id, 
        nombre, 
        descripcion, 
        cantidad, 
        estado, 
        activo, 
        fecha_registro, 
        precio 
      FROM herramientas_herramienta 
      ORDER BY nombre ASC
    `;
    const { rows } = await pool.query(sql);

    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(404).json({ message: "No hay registros de herramientas" });
    }
  } catch (error) {
    console.error("Error al listar herramientas:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const eliminarHerramienta = async (req, res) => {
  try {
    const id = req.params.id;
    const sql = `DELETE FROM herramientas_herramienta WHERE id = $1`;
    const { rowCount } = await pool.query(sql, [id]);

    if (rowCount > 0) {
      res.status(200).json({ message: "Herramienta eliminada" });
    } else {
      res.status(404).json({ message: "Herramienta no encontrada" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const actualizarHerramienta = async (req, res) => {
  try {
    const { nombre, descripcion, cantidad, estado, activo, fecha_registro, precio } = req.body;
    const id = req.params.id;
    const sql = `
      UPDATE herramientas_herramienta 
      SET nombre = $1, descripcion = $2, cantidad = $3, estado = $4, activo = $5, fecha_registro = $6, precio = $7 
      WHERE id = $8
    `;
    const { rowCount } = await pool.query(sql, [nombre, descripcion, cantidad, estado, activo, fecha_registro, precio, id]);

    if (rowCount > 0) {
      res.status(200).json({ message: "Herramienta actualizada" });
    } else {
      res.status(404).json({ message: "Herramienta no encontrada" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};