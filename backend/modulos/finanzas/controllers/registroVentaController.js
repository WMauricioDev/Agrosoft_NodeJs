import pool from "../../usuarios/database/Conexion.js";


export const registrarRegistroVenta = async (req, res) => {
  try {
    const { fk_venta, cantidad_vendida, precio_unitario, ingresos_venta, fecha_venta } = req.body;
    const sql = `INSERT INTO Registro_venta (fk_venta, cantidad_vendida, precio_unitario, ingresos_venta, fecha_venta) 
                 VALUES ($1, $2, $3, $4, $5)`;
    const { rowCount } = await pool.query(sql, [fk_venta, cantidad_vendida, precio_unitario, ingresos_venta, fecha_venta]);

    if (rowCount > 0) {
      res.status(201).json({ message: 'Registro de venta agregado' });
    } else {
      res.status(400).json({ message: 'No se pudo agregar el registro de venta' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el sistema' });
  }
};


export const listarRegistroVenta = async (req, res) => {
  try {
    const sql = 'SELECT * FROM Registro_venta';
    const { rows } = await pool.query(sql);

    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(404).json({ message: 'No hay registros de venta' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el sistema' });
  }
};


export const eliminarRegistroVenta = async (req, res) => {
  try {
    const id = req.params.id;
    const sql = 'DELETE FROM Registro_venta WHERE id = $1';
    const { rowCount } = await pool.query(sql, [id]);

    if (rowCount > 0) {
      res.status(200).json({ message: 'Registro de venta eliminado' });
    } else {
      res.status(404).json({ message: 'Registro de venta no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el sistema' });
  }
};


export const actualizarRegistroVenta = async (req, res) => {
  try {
    const { fk_venta, cantidad_vendida, precio_unitario, ingresos_venta, fecha_venta } = req.body;
    const id = req.params.id;
    const sql = `UPDATE Registro_venta SET fk_venta = $1, cantidad_vendida = $2, precio_unitario = $3, ingresos_venta = $4, fecha_venta = $5 
                 WHERE id = $6`;
    const { rowCount } = await pool.query(sql, [fk_venta, cantidad_vendida, precio_unitario, ingresos_venta, fecha_venta, id]);

    if (rowCount > 0) {
      res.status(200).json({ message: 'Registro de venta actualizado' });
    } else {
      res.status(404).json({ message: 'Registro de venta no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el sistema' });
  }
};
