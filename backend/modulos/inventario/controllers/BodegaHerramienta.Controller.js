import pool from "../../usuarios/database/Conexion.js"

export const registrarBodegaHerramienta = async (req, res) => {
  try {
    const { id_bodega, id_herramienta, cantidad_disponible } = req.body
    const sql = `
      INSERT INTO bodega_herramienta (id_bodega, id_herramienta, cantidad_disponible) 
      VALUES ($1, $2, $3)
    `
    const { rowCount } = await pool.query(sql, [id_bodega, id_herramienta, cantidad_disponible])

    if (rowCount > 0) {
      res.status(201).json({ message: 'Bodega-Herramienta registrado' })
    } else {
      res.status(400).json({ message: 'Bodega-Herramienta no registrado' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error en el sistema' })
  }
};

export const listarBodegaHerramienta = async (req, res) => {
  try {
    const sql = `
      SELECT 
        bh.id_bodega_herramienta, 
        b.nombre AS nombre_bodega, 
        b.ubicacion, 
        b.tipo_bodega, 
        h.nombre AS nombre_herramienta, 
        h.descripcion, 
        h.unidades, 
        bh.cantidad_disponible
      FROM bodega_herramienta bh
      JOIN bodega b ON bh.id_bodega = b.id_bodega
      JOIN herramientas h ON bh.id_herramienta = h.id
      WHERE b.tipo_bodega = Herramientas
      ORDER BY b.nombre, h.nombre;
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
    const id = req.params.id
    const sql = 'DELETE FROM bodega_herramienta WHERE id_bodega_herramienta = $1'
    const { rowCount } = await pool.query(sql, [id])

    if (rowCount > 0) {
      res.status(200).json({ message: 'Bodega-Herramienta eliminado' })
    } else {
      res.status(404).json({ message: 'Bodega-Herramienta no encontrado' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error en el sistema' })
  }
};

export const actualizarBodegaHerramienta = async (req, res) => {
  try {
    const { id_bodega, id_herramienta, cantidad_disponible } = req.body
    const id = req.params.id
    const sql = `
      UPDATE bodega_herramienta 
      SET id_bodega = $1, id_herramienta = $2, cantidad_disponible = $3 
      WHERE id_bodega_herramienta = $4
    `
    const { rowCount } = await pool.query(sql, [id_bodega, id_herramienta, cantidad_disponible, id])

    if (rowCount > 0) {
      res.status(200).json({ message: 'Bodega-Herramienta actualizado' })
    } else {
      res.status(404).json({ message: 'Bodega-Herramienta no encontrado' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error en el sistema' })
  }
};
