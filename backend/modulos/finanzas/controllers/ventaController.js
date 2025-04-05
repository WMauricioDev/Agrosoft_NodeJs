import pool from "../../usuarios/database/Conexion.js";

export const registrarVenta = async (req, res) => {
  try {
    const { fk_cosecha, precio_unitario, producto_vendido, cantidad, fecha_venta } = req.body;
    const sql = `INSERT INTO Venta (fk_cosecha, precio_unitario, producto_vendido, cantidad, fecha_venta) 
                 VALUES ($1, $2, $3, $4, $5)`;
    const { rowCount } = await pool.query(sql, [fk_cosecha, precio_unitario, producto_vendido, cantidad, fecha_venta]);

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
    const sql = 'SELECT * FROM Venta';
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
    const sql = 'DELETE FROM Venta WHERE id = $1';
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
    const { fk_cosecha, precio_unitario, producto_vendido, cantidad, fecha_venta } = req.body;
    const id = req.params.id;
    const sql = `UPDATE Venta 
                 SET fk_cosecha = $1, precio_unitario = $2, producto_vendido = $3, cantidad = $4, fecha_venta = $5 
                 WHERE id = $6`;
    const { rowCount } = await pool.query(sql, [fk_cosecha, precio_unitario, producto_vendido, cantidad, fecha_venta, id]);

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
