import pool from "../../usuarios/database/Conexion.js";

export const registrarTipoInsumo = async (req, res) => {
  try {
    const { nombre, descripcion, creada_por_usuario } = req.body;

    if (!nombre || nombre.length > 50) {
      return res.status(400).json({
        status: "error",
        message: "El nombre es requerido y debe tener máximo 50 caracteres",
      });
    }

    const checkNombre = await pool.query('SELECT id FROM insumos_tiposinsumo WHERE nombre = $1', [nombre]);
    if (checkNombre.rowCount > 0) {
      return res.status(400).json({
        status: "error",
        message: "El nombre del tipo de insumo ya existe",
      });
    }

    const sql = `
      INSERT INTO insumos_tiposinsumo (nombre, descripcion, creada_por_usuario, fecha_creacion)
      VALUES ($1, $2, $3, $4) RETURNING id
    `;
    const values = [
      nombre,
      descripcion || null,
      creada_por_usuario !== undefined ? creada_por_usuario : false,
      new Date().toISOString(),
    ];

    const { rows } = await pool.query(sql, values);
    res.status(201).json({
      status: "success",
      message: "Tipo de insumo registrado correctamente",
      data: { id: rows[0].id },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error en el sistema",
    });
  }
};

export const obtenerTiposInsumo = async (req, res) => {
  try {
    const sql = `SELECT id, nombre, descripcion, creada_por_usuario, fecha_creacion FROM insumos_tiposinsumo ORDER BY nombre ASC`;
    const { rows } = await pool.query(sql);

    if (rows.length > 0) {
      res.status(200).json({
        status: "success",
        message: "Tipos de insumo obtenidos correctamente",
        data: rows,
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "No hay tipos de insumo registrados",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error en el sistema",
    });
  }
};

export const registrarInsumo = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      cantidad,
      unidad_medida_id,
      tipo_insumo_id,
      activo,
      tipo_empacado,
      fecha_caducidad,
      precio_insumo,
    } = req.body;

    if (!nombre || !descripcion || nombre.length > 255) {
      return res.status(400).json({
        status: "error",
        message: "Nombre (máximo 255 caracteres) y descripción son requeridos",
      });
    }

    if (cantidad <= 0) {
      return res.status(400).json({
        status: "error",
        message: "La cantidad debe ser mayor que 0",
      });
    }

    if (precio_insumo < 0) {
      return res.status(400).json({
        status: "error",
        message: "El precio del insumo no puede ser negativo",
      });
    }

    if (tipo_empacado && tipo_empacado.length > 100) {
      return res.status(400).json({
        status: "error",
        message: "El tipo de empaque debe tener máximo 100 caracteres",
      });
    }

    if (fecha_caducidad && isNaN(new Date(fecha_caducidad).getTime())) {
      return res.status(400).json({
        status: "error",
        message: "Fecha de caducidad inválida",
      });
    }

    if (unidad_medida_id) {
      const checkUnidad = await pool.query('SELECT id FROM insumos_unidadmedida WHERE id = $1', [unidad_medida_id]);
      if (checkUnidad.rowCount === 0) {
        return res.status(400).json({
          status: "error",
          message: "Unidad de medida no encontrada",
        });
      }
    }

    if (tipo_insumo_id) {
      const checkTipo = await pool.query('SELECT id FROM insumos_tiposinsumo WHERE id = $1', [tipo_insumo_id]);
      if (checkTipo.rowCount === 0) {
        return res.status(400).json({
          status: "error",
          message: "Tipo de insumo no encontrado",
        });
      }
    }

    const checkNombre = await pool.query('SELECT id FROM insumos_insumo WHERE nombre = $1', [nombre]);
    if (checkNombre.rowCount > 0) {
      return res.status(400).json({
        status: "error",
        message: "El nombre del insumo ya existe",
      });
    }

    const sql = `
      INSERT INTO insumos_insumo (
        nombre, descripcion, cantidad, unidad_medida_id, tipo_insumo_id,
        activo, tipo_empacado, fecha_registro, fecha_caducidad, precio_insumo
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id
    `;
    const values = [
      nombre,
      descripcion,
      cantidad,
      unidad_medida_id || null,
      tipo_insumo_id || null,
      activo !== undefined ? activo : true,
      tipo_empacado || null,
      new Date().toISOString(),
      fecha_caducidad || null,
      precio_insumo || 0.00,
    ];

    const { rows } = await pool.query(sql, values);
    res.status(201).json({
      status: "success",
      message: "Insumo registrado correctamente",
      data: { id: rows[0].id },
    });
  } catch (error) {
    console.error(error);
    if (error.code === '23503') {
      res.status(400).json({
        status: "error",
        message: "Clave foránea inválida",
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "Error en el sistema",
      });
    }
  }
};

export const listarInsumos = async (req, res) => {
  try {
    const sql = `
      SELECT 
        i.id, i.nombre, i.descripcion, i.cantidad, i.activo, i.tipo_empacado,
        i.fecha_registro, i.fecha_caducidad, i.precio_insumo,
        json_build_object(
          'id', u.id,
          'nombre', u.nombre,
          'descripcion', u.descripcion,
          'creada_por_usuario', u.creada_por_usuario,
          'fecha_creacion', u.fecha_creacion
        ) as unidad_medida,
        json_build_object(
          'id', t.id,
          'nombre', t.nombre,
          'descripcion', t.descripcion,
          'creada_por_usuario', t.creada_por_usuario,
          'fecha_creacion', t.fecha_creacion
        ) as tipo_insumo
      FROM insumos_insumo i
      LEFT JOIN insumos_unidadmedida u ON i.unidad_medida_id = u.id
      LEFT JOIN insumos_tiposinsumo t ON i.tipo_insumo_id = t.id
      ORDER BY i.nombre ASC
    `;
    const { rows } = await pool.query(sql);

    if (rows.length > 0) {
      res.status(200).json({
        status: "success",
        message: "Insumos obtenidos correctamente",
        data: rows,
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "No hay insumos registrados",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error en el sistema",
    });
  }
};

export const eliminarInsumo = async (req, res) => {
  try {
    const { id } = req.params;

    const checkInsumo = await pool.query('SELECT id FROM insumos_insumo WHERE id = $1', [id]);
    if (checkInsumo.rowCount === 0) {
      return res.status(404).json({
        status: "error",
        message: "Insumo no encontrado",
      });
    }

    const checkReferences = await pool.query('SELECT 1 FROM insumos_actividadinsumo WHERE insumo_id = $1 LIMIT 1', [id]);
    if (checkReferences.rowCount > 0) {
      return res.status(400).json({
        status: "error",
        message: "No se puede eliminar el insumo porque está referenciado en actividades",
      });
    }

    const sql = 'DELETE FROM insumos_insumo WHERE id = $1';
    const { rowCount } = await pool.query(sql, [id]);

    if (rowCount > 0) {
      res.status(200).json({
        status: "success",
        message: "Insumo eliminado correctamente",
      });
    } else {
      res.status(400).json({
        status: "error",
        message: "No se pudo eliminar el insumo",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error en el sistema",
    });
  }
};

export const actualizarInsumo = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      cantidad,
      unidad_medida_id,
      tipo_insumo_id,
      activo,
      tipo_empacado,
      fecha_caducidad,
      precio_insumo,
    } = req.body;
    const { id } = req.params;

    if (!nombre || !descripcion || nombre.length > 255) {
      return res.status(400).json({
        status: "error",
        message: "Nombre (máximo 255 caracteres) y descripción son requeridos",
      });
    }

    if (cantidad <= 0) {
      return res.status(400).json({
        status: "error",
        message: "La cantidad debe ser mayor que 0",
      });
    }

    if (precio_insumo < 0) {
      return res.status(400).json({
        status: "error",
        message: "El precio del insumo no puede ser negativo",
      });
    }

    if (tipo_empacado && tipo_empacado.length > 100) {
      return res.status(400).json({
        status: "error",
        message: "El tipo de empaque debe tener máximo 100 caracteres",
      });
    }

    if (fecha_caducidad && isNaN(new Date(fecha_caducidad).getTime())) {
      return res.status(400).json({
        status: "error",
        message: "Fecha de caducidad inválida",
      });
    }

    const checkInsumo = await pool.query('SELECT id FROM insumos_insumo WHERE id = $1', [id]);
    if (checkInsumo.rowCount === 0) {
      return res.status(404).json({
        status: "error",
        message: "Insumo no encontrado",
      });
    }

    if (unidad_medida_id) {
      const checkUnidad = await pool.query('SELECT id FROM insumos_unidadmedida WHERE id = $1', [unidad_medida_id]);
      if (checkUnidad.rowCount === 0) {
        return res.status(400).json({
          status: "error",
          message: "Unidad de medida no encontrada",
        });
      }
    }

    if (tipo_insumo_id) {
      const checkTipo = await pool.query('SELECT id FROM insumos_tiposinsumo WHERE id = $1', [tipo_insumo_id]);
      if (checkTipo.rowCount === 0) {
        return res.status(400).json({
          status: "error",
          message: "Tipo de insumo no encontrado",
        });
      }
    }

    const checkNombre = await pool.query('SELECT id FROM insumos_insumo WHERE nombre = $1 AND id != $2', [nombre, id]);
    if (checkNombre.rowCount > 0) {
      return res.status(400).json({
        status: "error",
        message: "El nombre del insumo ya existe",
      });
    }

    const sql = `
      UPDATE insumos_insumo
      SET nombre = $1, descripcion = $2, cantidad = $3, unidad_medida_id = $4,
          tipo_insumo_id = $5, activo = $6, tipo_empacado = $7, fecha_caducidad = $8,
          precio_insumo = $9
      WHERE id = $10
    `;
    const values = [
      nombre,
      descripcion,
      cantidad,
      unidad_medida_id || null,
      tipo_insumo_id || null,
      activo !== undefined ? activo : true,
      tipo_empacado || null,
      fecha_caducidad || null,
      precio_insumo || 0.00,
      id,
    ];

    const { rowCount } = await pool.query(sql, values);
    if (rowCount > 0) {
      res.status(200).json({
        status: "success",
        message: "Insumo actualizado correctamente",
      });
    } else {
      res.status(400).json({
        status: "error",
        message: "No se pudo actualizar el insumo",
      });
    }
  } catch (error) {
    console.error(error);
    if (error.code === '23503') {
      res.status(400).json({
        status: "error",
        message: "Clave foránea inválida",
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "Error en el sistema",
      });
    }
  }
};