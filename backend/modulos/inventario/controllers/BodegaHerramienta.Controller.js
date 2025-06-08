import pool from "../../usuarios/database/Conexion.js";

export const registrarBodegaHerramienta = async (req, res) => {
  try {
    const { bodega_id, herramienta_id, cantidad, creador_id, costo_total, cantidad_prestada } = req.body;
    const sql = `
      INSERT INTO bodega_herramienta_bodegaherramienta (bodega_id, herramienta_id, cantidad, creador_id, costo_total, cantidad_prestada) 
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    const { rowCount } = await pool.query(sql, [bodega_id, herramienta_id, cantidad, creador_id, costo_total, cantidad_prestada]);

    if (rowCount > 0) {
      res.status(201).json({ message: 'Bodega-Herramienta registrado' });
    } else {
      res.status(400).json({ message: 'Bodega-Herramienta no registrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el sistema' });
  }
};

export const listarBodegaHerramienta = async (req, res) => {
  try {
    const sql = `
      SELECT 
      *
      FROM bodega_herramienta_bodegaherramienta
    `;
    const { rows } = await pool.query(sql);

    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(404).json({ message: 'No hay registros en Bodega_Herramienta' });
    }
  } catch (error) {
    console.error('Error al listar bodega herramienta:', error);
    res.status(500).json({ message: 'Error al obtener datos', error: error.message });
  }
};

export const eliminarBodegaHerramienta = async (req, res) => {
  try {
    const id = req.params.id;
    const sql = 'DELETE FROM bodega_herramienta_bodegaherramienta WHERE id = $1';
    const { rowCount } = await pool.query(sql, [id]);

    if (rowCount > 0) {
      res.status(200).json({ message: 'Bodega-Herramienta eliminado' });
    } else {
      res.status(404).json({ message: 'Bodega-Herramienta no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el sistema' });
  }
};

export const actualizarBodegaHerramienta = async (req, res) => {
  try {
    const { bodega_id, herramienta_id, cantidad, creador_id, costo_total, cantidad_prestada } = req.body;
    const id = req.params.id;
    const sql = `
      UPDATE bodega_herramienta_bodegaherramienta 
      SET bodega_id = $1, herramienta_id = $2, cantidad = $3, creador_id = $4, costo_total = $5, cantidad_prestada = $6 
      WHERE id = $7
    `;
    const { rowCount } = await pool.query(sql, [bodega_id, herramienta_id, cantidad, creador_id, costo_total, cantidad_prestada, id]);

    if (rowCount > 0) {
      res.status(200).json({ message: 'Bodega-Herramienta actualizado' });
    } else {
      res.status(404).json({ message: 'Bodega-Herramienta no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el sistema' });
  }
};