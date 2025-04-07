import pool from "../../usuarios/database/Conexion.js";

export const registrarVenta = async (req, res) => {
  try {
    const { cantidad, total, fecha, precio, producto_id } = req.body;
    const sql = `INSERT INTO venta_venta (cantidad, total, fecha, precio, producto_id) 
                 VALUES ($1, $2, $3, $4, $5)`;
    const { rowCount } = await pool.query(sql, [cantidad, total, fecha, precio, producto_id]);

    if (rowCount > 0) {
      res.status(201).json({ message: 'Venta registrada' });
    } else {
      res.status(400).json({ message: 'Venta no registrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el sistema' });
  }
};

export const listarVentas = async (req, res) => {
  try {
    const sql = 'SELECT * FROM venta_venta';
    const { rows } = await pool.query(sql);

    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(404).json({ message: 'No hay registros de ventas' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el sistema' });
  }
};

export const eliminarVenta = async (req, res) => {
  try {
    const id = req.params.id;
    const sql = 'DELETE FROM venta_venta WHERE id = $1';
    const { rowCount } = await pool.query(sql, [id]);

    if (rowCount > 0) {
      res.status(200).json({ message: 'Venta eliminada' });
    } else {
      res.status(404).json({ message: 'Venta no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el sistema' });
  }
};

export const actualizarVenta = async (req, res) => {
  try {
    const { cantidad, total, fecha, precio, producto_id } = req.body;
    const id = req.params.id;
    const sql = `UPDATE venta_venta 
                 SET cantidad = $1, total = $2, fecha = $3, precio = $4, producto_id = $5 
                 WHERE id = $6`;
    const { rowCount } = await pool.query(sql, [cantidad, total, fecha, precio, producto_id, id]);

    if (rowCount > 0) {
      res.status(200).json({ message: 'Venta actualizada' });
    } else {
      res.status(404).json({ message: 'Venta no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el sistema' });
  }
};
