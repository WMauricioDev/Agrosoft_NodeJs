import pool from "../../usuarios/database/Conexion.js";

export const registrarVenta = async (req, res) => {
  try {
    const { fecha, cambio, monto_entregado } = req.body;
    const sql = `INSERT INTO venta_venta (fecha, cambio, monto_entregado) 
                 VALUES ($1, $2, $3)`;
    const { rowCount } = await pool.query(sql, [fecha, cambio, monto_entregado]);

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
export const registrarDetalleVenta = async (req, res) => {
  try {
    const { cantidad, total, producto_id, unidades_de_medida_id, venta_id } = req.body;
    const sql = `INSERT INTO venta_detalleventa (cantidad, total, producto_id, unidades_de_medida_id, venta_id ) 
                 VALUES ($1, $2, $3, $4, $5)`;
    const { rowCount } = await pool.query(sql, [cantidad, total, producto_id, unidades_de_medida_id, venta_id ]);

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
export const listarDetalleVentas = async (req, res) => {
  try {
    const sql = 'SELECT * FROM venta_detalleventa';
    const { rows } = await pool.query(sql);

    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(404).json({ message: 'No hay registros de detalle de venta' });
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
    const { fecha, cambio, monto_entregado } = req.body;
    const id = req.params.id;
    const sql = `UPDATE venta_venta 
                 SET fecha = $1, cambio = $2, monto_entregado = $3
                 WHERE id = $6`;
    const { rowCount } = await pool.query(sql, [fecha, cambio, monto_entregado, id]);

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
