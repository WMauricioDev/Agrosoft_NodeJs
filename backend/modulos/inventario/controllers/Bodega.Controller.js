import pool from "../../usuarios/database/Conexion.js";

// Registrar una bodega
export const registrarBodega = async (req, res) => {
  try {
    const {
      nombre,
      direccion,
      telefono,
      activo,
      capacidad,
      ubicacion
    } = req.body;

    const sql = `
      INSERT INTO bodega_bodega (
        nombre,
        direccion,
        telefono,
        activo,
        capacidad,
        ubicacion
      ) VALUES ($1, $2, $3, $4, $5, $6)
    `;

    const { rowCount } = await pool.query(sql, [
      nombre,
      direccion,
      telefono,
      activo,
      capacidad,
      ubicacion
    ]);

    if (rowCount > 0) {
      res.status(201).json({ message: 'Bodega registrada' });
    } else {
      res.status(400).json({ message: 'Bodega no registrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el sistema', error: error.message });
  }
};

// Listar todas las bodegas
export const listarBodega = async (req, res) => {
  try {
    const sql = 'SELECT * FROM bodega_bodega';
    const { rows } = await pool.query(sql);

    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(404).json({ message: 'No hay registros de bodega' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el sistema' });
  }
};

// Eliminar una bodega
export const eliminarBodega = async (req, res) => {
  try {
    const id = req.params.id_bodega;
    const sql = 'DELETE FROM bodega_bodega WHERE id_bodega = $1';
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
    const {
      nombre,
      direccion,
      telefono,
      activo,
      capacidad,
      ubicacion
    } = req.body;

    const id = req.params.id_bodega;

    const sql = `
      UPDATE bodega_bodega
      SET nombre = $1, direccion = $2, telefono = $3,
          activo = $4, capacidad = $5, ubicacion = $6
      WHERE id_bodega = $7
    `;

    const { rowCount } = await pool.query(sql, [
      nombre,
      direccion,
      telefono,
      activo,
      capacidad,
      ubicacion,
      id
    ]);

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
