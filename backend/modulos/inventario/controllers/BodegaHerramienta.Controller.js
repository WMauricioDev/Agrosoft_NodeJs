import pool from "../../usuarios/database/Conexion.js";

export const registrarBodegaHerramienta = async (req, res) => {
  try {
    const { bodega_id, herramienta_id, cantidad, creador_id, costo_total, cantidad_prestada } = req.body;

    if (!bodega_id || !herramienta_id || !cantidad || cantidad <= 0) {
      return res.status(400).json({
        status: "error",
        message: "Faltan campos obligatorios o cantidad inválida"
      });
    }

    if (cantidad_prestada > cantidad) {
      return res.status(400).json({
        status: "error",
        message: "La cantidad prestada no puede exceder la cantidad total"
      });
    }

    const checkBodega = await pool.query('SELECT id FROM bodegas_bodega WHERE id = $1', [bodega_id]);
    if (checkBodega.rowCount === 0) {
      return res.status(400).json({
        status: "error",
        message: "La bodega especificada no existe"
      });
    }

    const checkHerramienta = await pool.query('SELECT id FROM herramientas_herramienta WHERE id = $1', [herramienta_id]);
    if (checkHerramienta.rowCount === 0) {
      return res.status(400).json({
        status: "error",
        message: "La herramienta especificada no existe"
      });
    }

    if (creador_id) {
      const checkCreador = await pool.query('SELECT id FROM auth_user WHERE id = $1', [creador_id]);
      if (checkCreador.rowCount === 0) {
        return res.status(400).json({
          status: "error",
          message: "El creador especificado no existe"
        });
      }
    }

    const sql = `
      INSERT INTO bodega_herramienta_bodegaherramienta 
      (bodega_id, herramienta_id, cantidad, creador_id, costo_total, cantidad_prestada) 
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING id
    `;
    const { rows } = await pool.query(sql, [
      bodega_id,
      herramienta_id,
      cantidad,
      creador_id || null,
      costo_total || null,
      cantidad_prestada || 0
    ]);

    if (rows.length > 0) {
      res.status(201).json({
        status: "success",
        message: "Bodega-Herramienta registrado correctamente",
        data: { id: rows[0].id }
      });
    } else {
      res.status(400).json({
        status: "error",
        message: "No se pudo registrar la Bodega-Herramienta"
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

export const listarBodegaHerramienta = async (req, res) => {
  try {
    const sql = `
      SELECT 
        bh.id,
        bh.bodega_id,
        b.nombre AS nombre_bodega,
        bh.herramienta_id,
        h.nombre AS nombre_herramienta,
        bh.cantidad,
        bh.creador_id,
        bh.costo_total,
        bh.cantidad_prestada
      FROM bodega_herramienta_bodegaherramienta bh
      LEFT JOIN bodegas_bodega b ON bh.bodega_id = b.id
      LEFT JOIN herramientas_herramienta h ON bh.herramienta_id = h.id
    `;
    const { rows } = await pool.query(sql);

    if (rows.length > 0) {
      const formattedData = rows.map(row => ({
        id: row.id,
        bodega_id: row.bodega_id,
        nombre_bodega: row.nombre_bodega || "Sin nombre",
        herramienta_id: row.herramienta_id,
        nombre_herramienta: row.nombre_herramienta || "Sin nombre",
        cantidad: parseInt(row.cantidad, 10),
        creador_id: row.creador_id || null,
        costo_total: row.costo_total ? parseFloat(row.costo_total) : null,
        cantidad_prestada: parseInt(row.cantidad_prestada, 10)
      }));

      res.status(200).json({
        status: "success",
        message: "Bodega-Herramientas obtenidos correctamente",
        data: formattedData
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "No hay registros en Bodega-Herramienta"
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

export const actualizarBodegaHerramienta = async (req, res) => {
  try {
    const { bodega_id, herramienta_id, cantidad, creador_id, costo_total, cantidad_prestada } = req.body;
    const { id } = req.params;

    if (!bodega_id || !herramienta_id || !cantidad || cantidad <= 0) {
      return res.status(400).json({
        status: "error",
        message: "Faltan campos obligatorios o cantidad inválida"
      });
    }

    if (cantidad_prestada > cantidad) {
      return res.status(400).json({
        status: "error",
        message: "La cantidad prestada no puede exceder la cantidad total"
      });
    }

    const checkRegistro = await pool.query('SELECT id FROM bodega_herramienta_bodegaherramienta WHERE id = $1', [id]);
    if (checkRegistro.rowCount === 0) {
      return res.status(404).json({
        status: "error",
        message: "Bodega-Herramienta no encontrado"
      });
    }

    const checkBodega = await pool.query('SELECT id FROM bodegas_bodega WHERE id = $1', [bodega_id]);
    if (checkBodega.rowCount === 0) {
      return res.status(400).json({
        status: "error",
        message: "La bodega especificada no existe"
      });
    }

    const checkHerramienta = await pool.query('SELECT id FROM herramientas_herramienta WHERE id = $1', [herramienta_id]);
    if (checkHerramienta.rowCount === 0) {
      return res.status(400).json({
        status: "error",
        message: "La herramienta especificada no existe"
      });
    }

    if (creador_id) {
      const checkCreador = await pool.query('SELECT id FROM auth_user WHERE id = $1', [creador_id]);
      if (checkCreador.rowCount === 0) {
        return res.status(400).json({
          status: "error",
          message: "El creador especificado no existe"
        });
      }
    }

    const sql = `
      UPDATE bodega_herramienta_bodegaherramienta 
      SET bodega_id = $1, herramienta_id = $2, cantidad = $3, creador_id = $4, costo_total = $5, cantidad_prestada = $6 
      WHERE id = $7
    `;
    const { rowCount } = await pool.query(sql, [
      bodega_id,
      herramienta_id,
      cantidad,
      creador_id || null,
      costo_total || null,
      cantidad_prestada || 0,
      id
    ]);

    if (rowCount > 0) {
      res.status(200).json({
        status: "success",
        message: "Bodega-Herramienta actualizado correctamente"
      });
    } else {
      res.status(400).json({
        status: "error",
        message: "No se pudo actualizar la Bodega-Herramienta"
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

export const eliminarBodegaHerramienta = async (req, res) => {
  try {
    const { id } = req.params;

    const checkRegistro = await pool.query('SELECT id FROM bodega_herramienta_bodegaherramienta WHERE id = $1', [id]);
    if (checkRegistro.rowCount === 0) {
      return res.status(404).json({
        status: "error",
        message: "Bodega-Herramienta no encontrado"
      });
    }

    const sql = 'DELETE FROM bodega_herramienta_bodegaherramienta WHERE id = $1';
    const { rowCount } = await pool.query(sql, [id]);

    if (rowCount > 0) {
      res.status(200).json({
        status: "success",
        message: "Bodega-Herramienta eliminado correctamente"
      });
    } else {
      res.status(400).json({
        status: "error",
        message: "No se pudo eliminar la Bodega-Herramienta"
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