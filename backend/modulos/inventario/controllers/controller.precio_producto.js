import pool from "../../usuarios/database/Conexion.js";

export const registrarPrecioProducto = async (req, res) => {
  try {
    const { precio, fecha_registro  , Producto_id, fecha_caducidad, stock, unidad_medida_id } = req.body;
    const sql = `INSERT INTO precios_productos_precio_producto (precio, fecha_registro  , "Producto_id", fecha_caducidad, stock, "unidad_medida_id") VALUES ($1, $2, $3, $4, $5, $6)`;
    const { rowCount } = await pool.query(sql, [precio, fecha_registro  , Producto_id, fecha_caducidad, stock, unidad_medida_id]);

    if (rowCount > 0) {
      res.status(201).json({ message: 'Precio producto registrado' });
    } else {
      res.status(400).json({ message: 'Precio producto no registrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el sistema' });
  }
};

export const listarPrecioProducto = async (req, res) => {
  try {
    const sql = 'SELECT * FROM  precios_productos_precio_producto';
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

export const eliminarPrecioProducto = async (req, res) => {
  try {
    const id = req.params.id;
    const sql = 'DELETE FROM precios_productos_precio_producto WHERE id = $1';
    const { rowCount } = await pool.query(sql, [id]);

    if (rowCount > 0) {
      res.status(200).json({ message: 'Precio producto eliminado' });
    } else {
      res.status(404).json({ message: 'Precio producto no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el sistema' });
  }
};

export const actualizarPrecioProducto = async (req, res) => {
  try {
    const { precio, fecha_registro  , Producto_id, fecha_caducidad, stock, unidad_medida_id } = req.body;
    const id = req.params.id;
    const sql = `
      UPDATE precios_productos_precio_producto 
      SET precio = $1, fecha_registro = $2, Producto_id = $3, fecha_caducidad = $4, stock = $5, unidad_medida_id = $6
      WHERE id = $7
    `;
    const { rowCount } = await pool.query(sql, [precio, fecha_registro  , Producto_id, fecha_caducidad, stock, unidad_medida_id, id]);

    if (rowCount > 0) {
      res.status(200).json({ message: 'Precio producto actualizado' });
    } else {
      res.status(404).json({ message: 'Precio producto no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el sistema' });
  }
};