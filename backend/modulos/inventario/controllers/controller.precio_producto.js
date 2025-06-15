import pool from "../../usuarios/database/Conexion.js";

export const listarPrecioProducto = async (req, res) => {
  try {
    const sql = `
      SELECT 
        pp.id,
        pp.precio,
        pp.fecha_registro,
        pp.fecha_caducidad,
        pp.stock,
        pp.unidad_medida_id,
        pp."Producto_id" AS cosecha_id,
        c.nombre AS nombre_cultivo,
        um.nombre AS unidad_medida_nombre,
        um.descripcion AS unidad_medida_descripcion,
        um.creada_por_usuario AS unidad_medida_creada_por_usuario,
        um.fecha_creacion AS unidad_medida_fecha_creacion
      FROM precios_productos_precio_producto pp
      LEFT JOIN cosechas_cosecha ch ON pp."Producto_id" = ch.id
      LEFT JOIN cultivos_cultivo c ON ch.id_cultivo_id = c.id
      LEFT JOIN unidad_medida_unidadmedida um ON pp.unidad_medida_id = um.id
    `;
    const { rows } = await pool.query(sql);

    if (rows.length > 0) {
      const formattedData = rows.map(row => ({
        id: row.id,
        precio: parseFloat(row.precio),
        fecha_registro: row.fecha_registro,
        fecha_caducidad: row.fecha_caducidad,
        stock: parseInt(row.stock, 10),
        cosecha_id: row.cosecha_id,
        nombre_cultivo: row.nombre_cultivo || "Sin nombre",
        unidad_medida_id: row.unidad_medida_id ? {
          id: row.unidad_medida_id,
          nombre: row.unidad_medida_nombre,
          descripcion: row.unidad_medida_descripcion,
          creada_por_usuario: row.unidad_medida_creada_por_usuario,
          fecha_creacion: row.unidad_medida_fecha_creacion
        } : null
      }));

      res.status(200).json({
        status: "success",
        message: "Precios de productos obtenidos correctamente",
        data: formattedData
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "No hay precios de productos registrados"
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

export const registrarPrecioProducto = async (req, res) => {
  try {
    const { precio, fecha_registro, Producto_id, fecha_caducidad, stock, unidad_medida_id } = req.body;

    if (!precio || !fecha_registro || !unidad_medida_id || !stock) {
      return res.status(400).json({
        status: "error",
        message: "Faltan campos obligatorios: precio, fecha_registro, unidad_medida_id, stock"
      });
    }

    if (Producto_id) {
      const checkCosecha = await pool.query('SELECT id FROM cosechas_cosecha WHERE id = $1', [Producto_id]);
      if (checkCosecha.rowCount === 0) {
        return res.status(400).json({
          status: "error",
          message: "La cosecha especificada no existe"
        });
      }
    }

    const checkUnidad = await pool.query('SELECT id FROM unidad_medida_unidadmedida WHERE id = $1', [unidad_medida_id]);
    if (checkUnidad.rowCount === 0) {
      return res.status(400).json({
        status: "error",
        message: "La unidad de medida especificada no existe"
      });
    }

    const sql = `
      INSERT INTO precios_productos_precio_producto 
      (precio, fecha_registro, "Producto_id", fecha_caducidad, stock, unidad_medida_id) 
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING id
    `;
    const { rows } = await pool.query(sql, [
      precio,
      fecha_registro,
      Producto_id || null,
      fecha_caducidad || null,
      stock,
      unidad_medida_id
    ]);

    if (rows.length > 0) {
      res.status(201).json({
        status: "success",
        message: "Precio de producto registrado correctamente",
        data: { id: rows[0].id }
      });
    } else {
      res.status(400).json({
        status: "error",
        message: "No se pudo registrar el precio de producto"
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

export const actualizarPrecioProducto = async (req, res) => {
  try {
    const { precio, fecha_registro, Producto_id, fecha_caducidad, stock, unidad_medida_id } = req.body;
    const { id } = req.params;

    if (!precio || !fecha_registro || !unidad_medida_id || !stock) {
      return res.status(400).json({
        status: "error",
        message: "Faltan campos obligatorios: precio, fecha_registro, unidad_medida_id, stock"
      });
    }

    const checkPrecio = await pool.query('SELECT id FROM precios_productos_precio_producto WHERE id = $1', [id]);
    if (checkPrecio.rowCount === 0) {
      return res.status(404).json({
        status: "error",
        message: "Precio de producto no encontrado"
      });
    }

    if (Producto_id) {
      const checkCosecha = await pool.query('SELECT id FROM cosechas_cosecha WHERE id = $1', [Producto_id]);
      if (checkCosecha.rowCount === 0) {
        return res.status(400).json({
          status: "error",
          message: "La cosecha especificada no existe"
        });
      }
    }

    const checkUnidad = await pool.query('SELECT id FROM unidad_medida_unidadmedida WHERE id = $1', [unidad_medida_id]);
    if (checkUnidad.rowCount === 0) {
      return res.status(400).json({
        status: "error",
        message: "La unidad de medida especificada no existe"
      });
    }

    const sql = `
      UPDATE precios_productos_precio_producto 
      SET precio = $1, fecha_registro = $2, "Producto_id" = $3, fecha_caducidad = $4, stock = $5, unidad_medida_id = $6
      WHERE id = $7
    `;
    const { rowCount } = await pool.query(sql, [
      precio,
      fecha_registro,
      Producto_id || null,
      fecha_caducidad || null,
      stock,
      unidad_medida_id,
      id
    ]);

    if (rowCount > 0) {
      res.status(200).json({
        status: "success",
        message: "Precio de producto actualizado correctamente"
      });
    } else {
      res.status(400).json({
        status: "error",
        message: "No se pudo actualizar el precio de producto"
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

export const eliminarPrecioProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const checkPrecio = await pool.query('SELECT id FROM precios_productos_precio_producto WHERE id = $1', [id]);
    if (checkPrecio.rowCount === 0) {
      return res.status(404).json({
        status: "error",
        message: "Precio de producto no encontrado"
      });
    }

    const sql = 'DELETE FROM precios_productos_precio_producto WHERE id = $1';
    const { rowCount } = await pool.query(sql, [id]);

    if (rowCount > 0) {
      res.status(200).json({
        status: "success",
        message: "Precio de producto eliminado correctamente"
      });
    } else {
      res.status(400).json({
        status: "error",
        message: "No se pudo eliminar el precio de producto"
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

export const listarUnidadesMedida = async (req, res) => {
  try {
    const sql = `
      SELECT id, nombre, descripcion, creada_por_usuario, fecha_creacion 
      FROM unidad_medida_unidadmedida
    `;
    const { rows } = await pool.query(sql);

    if (rows.length > 0) {
      res.status(200).json({
        status: "success",
        message: "Unidades de medida obtenidas correctamente",
        data: rows
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "No hay unidades de medida registradas"
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

export const crearUnidadMedida = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre) {
      return res.status(400).json({
        status: "error",
        message: "El nombre de la unidad de medida es obligatorio"
      });
    }

    const checkNombre = await pool.query('SELECT id FROM unidad_medida_unidadmedida WHERE nombre = $1', [nombre]);
    if (checkNombre.rowCount > 0) {
      return res.status(400).json({
        status: "error",
        message: "Ya existe una unidad de medida con ese nombre"
      });
    }

    const sql = `
      INSERT INTO unidad_medida_unidadmedida 
      (nombre, descripcion, creada_por_usuario, fecha_creacion) 
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING id, nombre, descripcion, creada_por_usuario, fecha_creacion
    `;
    const { rows } = await pool.query(sql, [nombre, descripcion || null, true]);

    if (rows.length > 0) {
      res.status(201).json({
        status: "success",
        message: "Unidad de medida creada correctamente",
        data: rows[0]
      });
    } else {
      res.status(400).json({
        status: "error",
        message: "No se pudo crear la unidad de medida"
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