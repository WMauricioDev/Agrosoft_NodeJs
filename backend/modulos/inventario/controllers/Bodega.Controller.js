import pool from "../../usuarios/database/Conexion.js";

export const registrarBodega = async (req, res) => {
  try {
    const { nombre, ubicacion, telefono, activo, capacidad } = req.body;
    const sql = `INSERT INTO bodega_bodega (nombre, ubicacion, telefono, activo, capacidad) VALUES ($1, $2, $3, $4, $5)`;
    const { rowCount } = await pool.query(sql, [nombre, ubicacion, telefono, activo, capacidad]);

    if (rowCount > 0) {
      res.status(201).json({ message: 'Bodega registrada' });
    } else {
      res.status(400).json({ message: 'Bodega no registrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el sistema' });
  }
};

export const listarBodega = async (req, res) => {
  try {
    const sql = 'SELECT id, nombre, ubicacion, telefono, activo, capacidad FROM bodega_bodega';
    const { rows } = await pool.query(sql);

    // Siempre devolver 200 con los datos (puede ser un arreglo vacío)
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el sistema' });
  }
};

// Eliminar una bodega
export const eliminarBodega = async (req, res) => {
  try {
    const id = req.params.id;
    const sql = 'DELETE FROM bodega_bodega WHERE id = $1';
    const { rowCount } = await pool.query(sql, [id]);

    if (rowCount > 0) {
      res.status(200).json({ message: 'Bodega eliminada' });
    } else {
      res.status(404).json({ message: 'Bodega no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el sistema' });
  }
};

// Actualizar una bodega
export const actualizarBodega = async (req, res) => {
  try {
    const { nombre, ubicacion, telefono, activo, capacidad } = req.body;
    const id = req.params.id;
    const sql = `
      UPDATE bodega_bodega 
      SET nombre = $1, ubicacion = $2, telefono = $3, activo = $4, capacidad = $5 
      WHERE id = $6
    `;
    const { rowCount } = await pool.query(sql, [nombre, ubicacion, telefono, activo, capacidad, id]);

    if (rowCount > 0) {
      res.status(200).json({ message: 'Bodega actualizada' });
    } else {
      res.status(404).json({ message: 'Bodega no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el sistema' });
  }
};