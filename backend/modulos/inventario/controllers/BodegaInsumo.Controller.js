import pool from "../../usuarios/database/Conexion.js";

export const registrarBodegaInsumo = async (req, res) => {
  try {
    const { bodega_id, insumo_id, cantidad } = req.body;

    if (!bodega_id || !insumo_id || !cantidad || cantidad < 1) {
      return res.status(400).json({
        status: "error",
        message: "bodega_id, insumo_id y cantidad (entero positivo) son requeridos"
      });
    }

    const checkBodega = await pool.query('SELECT id FROM bodegas_bodega WHERE id = $1', [bodega_id]);
    if (checkBodega.rowCount === 0) {
      return res.status(400).json({
        status: "error",
        message: "La bodega especificada no existe"
      });
    }

    const checkInsumo = await pool.query('SELECT id FROM insumos_insumo WHERE id = $1', [insumo_id]);
    if (checkInsumo.rowCount === 0) {
      return res.status(400).json({
        status: "error",
        message: "El insumo especificado no existe"
      });
    }

    const sql = `
      INSERT INTO bodega_insumo_bodegainsumo (bodega_id, insumo_id, cantidad)
      VALUES ($1, $2, $3) RETURNING id
    `;
    const { rows } = await pool.query(sql, [bodega_id, insumo_id, cantidad]);

    res.status(201).json({
      status: "success",
      message: "Bodega-Insumo registrado correctamente",
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

export const listarBodegaInsumo = async (req, res) => {
  try {
    const sql = `
      SELECT 
        bi.id,
        bi.bodega_id,
        b.nombre AS nombre_bodega,
        bi.insumo_id,
        i.nombre AS nombre_insumo,
        bi.cantidad
      FROM bodega_insumo_bodegainsumo bi
      LEFT JOIN bodegas_bodega b ON bi.bodega_id = b.id
      LEFT JOIN insumos_insumo i ON bi.insumo_id = i.id
    `;
    const { rows } = await pool.query(sql);

    if (rows.length > 0) {
      const formattedData = rows.map(row => ({
        id: row.id,
        bodega_id: row.bodega_id,
        nombre_bodega: row.nombre_bodega || "Sin nombre",
        insumo_id: row.insumo_id,
        nombre_insumo: row.nombre_insumo || "Sin nombre",
        cantidad: parseInt(row.cantidad, 10)
      }));

      res.status(200).json({
        status: "success",
        message: "Bodega-Insumos obtenidos correctamente",
        data: formattedData
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "No hay registros en Bodega-Insumo"
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

export const eliminarBodegaInsumo = async (req, res) => {
  try {
    const { id } = req.params;

    const checkRegistro = await pool.query('SELECT id FROM bodega_insumo_bodegainsumo WHERE id = $1', [id]);
    if (checkRegistro.rowCount === 0) {
      return res.status(404).json({
        status: "error",
        message: "Bodega-Insumo no encontrado"
      });
    }

    const sql = 'DELETE FROM bodega_insumo_bodegainsumo WHERE id = $1';
    const { rowCount } = await pool.query(sql, [id]);

    if (rowCount > 0) {
      res.status(200).json({
        status: "success",
        message: "Bodega-Insumo eliminado correctamente"
      });
    } else {
      res.status(400).json({
        status: "error",
        message: "No se pudo eliminar el Bodega-Insumo"
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

export const actualizarBodegaInsumo = async (req, res) => {
  try {
    const { bodega_id, insumo_id, cantidad } = req.body;
    const { id } = req.params;

    if (!bodega_id || !insumo_id || !cantidad || cantidad < 1) {
      return res.status(400).json({
        status: "error",
        message: "bodega_id, insumo_id y cantidad (entero positivo) son requeridos"
      });
    }

    const checkRegistro = await pool.query('SELECT id FROM bodega_insumo_bodegainsumo WHERE id = $1', [id]);
    if (checkRegistro.rowCount === 0) {
      return res.status(404).json({
        status: "error",
        message: "Bodega-Insumo no encontrado"
      });
    }

    const checkBodega = await pool.query('SELECT id FROM bodegas_bodega WHERE id = $1', [bodega_id]);
    if (checkBodega.rowCount === 0) {
      return res.status(400).json({
        status: "error",
        message: "La bodega especificada no existe"
      });
    }

    const checkInsumo = await pool.query('SELECT id FROM insumos_insumo WHERE id = $1', [insumo_id]);
    if (checkInsumo.rowCount === 0) {
      return res.status(400).json({
        status: "error",
        message: "El insumo especificado no existe"
      });
    }

    const sql = `
      UPDATE bodega_insumo_bodegainsumo
      SET bodega_id = $1, insumo_id = $2, cantidad = $3
      WHERE id = $4
    `;
    const { rowCount } = await pool.query(sql, [bodega_id, insumo_id, cantidad, id]);

    if (rowCount > 0) {
      res.status(200).json({
        status: "success",
        message: "Bodega-Insumo actualizado correctamente"
      });
    } else {
      res.status(400).json({
        status: "error",
        message: "No se pudo actualizar el Bodega-Insumo"
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