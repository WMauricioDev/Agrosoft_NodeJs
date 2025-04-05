import pool from "../../usuarios/database/Conexion.js";

export const registrarInventarioProducto = async (req, res) => {
  try {
    const { fk_cosecha, fk_venta, nombre, cantidad_disponible, costo_unitario } = req.body;
    const sql = `INSERT INTO Inventario_producto (fk_cosecha, fk_venta, nombre, cantidad_disponible, costo_unitario) VALUES ($1, $2, $3, $4, $5)`;
    const { rowCount } = await pool.query(sql, [fk_cosecha, fk_venta, nombre, cantidad_disponible, costo_unitario]);

    if (rowCount > 0) {
      res.status(201).json({ message: 'Inventario de producto registrado' });
    } else {
      res.status(400).json({ message: 'Inventario de producto no registrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el sistema' });
  }
};

export const listarInventarioProducto = async (req, res) => {
  try {
    const sql = 'SELECT * FROM Inventario_producto';
    const { rows } = await pool.query(sql);

    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(404).json({ message: 'No hay registros de inventario de productos' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el sistema' });
  }
};

export const eliminarInventarioProducto = async (req, res) => {
  try {
    const id = req.params.id;
    const sql = 'DELETE FROM Inventario_producto WHERE id = $1';
    const { rowCount } = await pool.query(sql, [id]);

    if (rowCount > 0) {
      res.status(200).json({ message: 'Inventario de producto eliminado' });
    } else {
      res.status(404).json({ message: 'Inventario de producto no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el sistema' });
  }
};

export const actualizarInventarioProducto = async (req, res) => {
  try {
    const { fk_cosecha, fk_venta, nombre, cantidad_disponible, costo_unitario } = req.body;
    const id = req.params.id;
    const sql = `
      UPDATE Inventario_producto 
      SET fk_cosecha = $1, fk_venta = $2, nombre = $3, cantidad_disponible = $4, costo_unitario = $5 
      WHERE id = $6
    `;
    const { rowCount } = await pool.query(sql, [fk_cosecha, fk_venta, nombre, cantidad_disponible, costo_unitario, id]);

    if (rowCount > 0) {
      res.status(200).json({ message: 'Inventario de producto actualizado' });
    } else {
      res.status(404).json({ message: 'Inventario de producto no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el sistema' });
  }
};
