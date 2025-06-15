import pool from "../../usuarios/database/Conexion.js";

export const registrarBodega = async (req, res) => {
  try {
    const { nombre, ubicacion, telefono, activo, capacidad } = req.body;

    if (!nombre || !capacidad || capacidad <= 0) {
      return res.status(400).json({
        status: "error",
        message: "Nombre y capacidad (positiva) son requeridos"
      });
    }

    const checkNombre = await pool.query('SELECT id FROM bodegas_bodega WHERE nombre = $1', [nombre]);
    if (checkNombre.rowCount > 0) {
      return res.status(400).json({
        status: "error",
        message: "Ya existe una bodega con ese nombre"
      });
    }

    const sql = `
      INSERT INTO bodegas_bodega (nombre, ubicacion, telefono, activo, capacidad)
      VALUES ($1, $2, $3, $4, $5) RETURNING id
    `;
    const { rows } = await pool.query(sql, [
      nombre,
      ubicacion || null,
      telefono || null,
      activo !== undefined ? activo : true,
      capacidad
    ]);

    res.status(201).json({
      status: "success",
      message: "Bodega registrada correctamente",
      data: { id: rows[0].id }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error en el sistema"
    });
  }
};

export const listarBodega = async (req, res) => {
  try {
    const sql = `
      SELECT id, nombre, ubicacion, telefono, activo, capacidad
      FROM bodegas_bodega
    `;
    const { rows } = await pool.query(sql);

    if (rows.length > 0) {
      res.status(200).json({
        status: "success",
        message: "Bodegas obtenidas correctamente",
        data: rows
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "No hay registros de bodega"
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error en el sistema"
    });
  }
};

export const eliminarBodega = async (req, res) => {
  try {
    const { id } = req.params;

    const checkBodega = await pool.query('SELECT id FROM bodegas_bodega WHERE id = $1', [id]);
    if (checkBodega.rowCount === 0) {
      return res.status(404).json({
        status: "error",
        message: "Bodega no encontrada"
      });
    }

    const checkReferences = await pool.query(`
      SELECT 1 FROM bodega_insumo_bodegainsumo WHERE bodega_id = $1
      UNION
      SELECT 1 FROM bodega_herramienta_bodegaherramienta WHERE bodega_id = $1
      LIMIT 1
    `, [id]);
    if (checkReferences.rowCount > 0) {
      return res.status(400).json({
        status: "error",
        message: "No se puede eliminar la bodega porque está referenciada en otros registros"
      });
    }

    const sql = 'DELETE FROM bodegas_bodega WHERE id = $1';
    const { rowCount } = await pool.query(sql, [id]);

    if (rowCount > 0) {
      res.status(200).json({
        status: "success",
        message: "Bodega eliminada correctamente"
      });
    } else {
      res.status(400).json({
        status: "error",
        message: "No se pudo eliminar la bodega"
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error en el sistema"
    });
  }
};

export const actualizarBodega = async (req, res) => {
  try {
    const { nombre, ubicacion, telefono, activo, capacidad } = req.body;
    const { id } = req.params;

    if (!nombre || !capacidad || capacidad <= 0) {
      return res.status(400).json({
        status: "error",
        message: "Nombre y capacidad (positiva) son requeridos"
      });
    }

    const checkBodega = await pool.query('SELECT id FROM bodegas_bodega WHERE id = $1', [id]);
    if (checkBodega.rowCount === 0) {
      return res.status(404).json({
        status: "error",
        message: "Bodega no encontrada"
      });
    }

    const checkNombre = await pool.query('SELECT id FROM bodegas_bodega WHERE nombre = $1 AND id != $2', [nombre, id]);
    if (checkNombre.rowCount > 0) {
      return res.status(400).json({
        status: "error",
        message: "Ya existe otra bodega con ese nombre"
      });
    }

    const sql = `
      UPDATE bodegas_bodega
      SET nombre = $1, ubicacion = $2, telefono = $3, activo = $4, capacidad = $5
      WHERE id = $6
    `;
    const { rowCount } = await pool.query(sql, [
      nombre,
      ubicacion || null,
      telefono || null,
      activo !== undefined ? activo : true,
      capacidad,
      id
    ]);

    if (rowCount > 0) {
      res.status(200).json({
        status: "success",
        message: "Bodega actualizada correctamente"
      });
    } else {
      res.status(400).json({
        status: "error",
        message: "No se pudo actualizar la bodega"
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error en el sistema"
    });
  }
};