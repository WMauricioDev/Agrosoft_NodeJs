import pool from "../../usuarios/database/Conexion.js";

export const registrarPrecioProducto = async (req, res) => {
  try {
    console.log("Request body:", JSON.stringify(req.body, null, 2));
    const { precio, fecha_registro, Producto_id, cosecha, fecha_caducidad, stock, unidad_medida_id } = req.body;

    // Mapear cosecha a Producto_id si está presente
    const finalProductoId = Producto_id || cosecha;

    // Validación de campos requeridos
    if (!precio || precio <= 0) {
      return res.status(400).json({ 
        message: "El precio es requerido y debe ser mayor a 0",
        code: "INVALID_PRICE"
      });
    }
    if (!fecha_registro) {
      return res.status(400).json({ 
        message: "La fecha de registro es requerida",
        code: "MISSING_REGISTRATION_DATE"
      });
    }
    if (!unidad_medida_id) {
      return res.status(400).json({ 
        message: "La unidad de medida es requerida",
        code: "MISSING_UNIT"
      });
    }
    if (!finalProductoId) {
      return res.status(400).json({ 
        message: "La cosecha es requerida",
        code: "MISSING_HARVEST"
      });
    }

    // Validar formato de fecha_registro y fecha_caducidad
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(fecha_registro)) {
      return res.status(400).json({
        message: "La fecha de registro debe estar en formato YYYY-MM-DD",
        code: "INVALID_DATE_FORMAT"
      });
    }
    if (fecha_caducidad && !dateRegex.test(fecha_caducidad)) {
      return res.status(400).json({
        message: "La fecha de caducidad debe estar en formato YYYY-MM-DD",
        code: "INVALID_DATE_FORMAT"
      });
    }

    // Validar que finalProductoId exista en cosechas_cosecha
    const cosechaCheck = await pool.query('SELECT id FROM cosechas_cosecha WHERE id = $1', [finalProductoId]);
    if (cosechaCheck.rows.length === 0) {
      return res.status(400).json({ 
        message: "La cosecha seleccionada no existe",
        code: "INVALID_HARVEST"
      });
    }

    // Validar que unidad_medida_id exista
    const unidadCheck = await pool.query('SELECT id FROM unidad_medida_unidadmedida WHERE id = $1', [unidad_medida_id]);
    if (unidadCheck.rows.length === 0) {
      return res.status(400).json({ 
        message: "La unidad de medida seleccionada no existe",
        code: "INVALID_UNIT"
      });
    }

    const sql = `
      INSERT INTO precios_productos_precio_producto (
        precio, fecha_registro, "Producto_id", fecha_caducidad, stock, unidad_medida_id
      ) VALUES ($1, $2::DATE, $3, $4::DATE, $5, $6) RETURNING id
    `;

    const values = [
      precio,
      fecha_registro, 
      finalProductoId,
      fecha_caducidad || null, 
      stock || 0,
      unidad_medida_id,
    ];

    const { rows } = await pool.query(sql, values);
    res.status(201).json({ 
      message: "Precio producto registrado", 
      id: rows[0].id,
      Producto_id: finalProductoId
    });
  } catch (error) {
    console.error("Error completo:", error);
    if (error.code === "23503") {
      return res.status(400).json({ 
        message: "Error de referencia: Verifique que la cosecha y unidad de medida existan",
        code: "FOREIGN_KEY_VIOLATION"
      });
    }
    res.status(500).json({ 
      message: "Error en el sistema", 
      error: error.message,
      code: "SYSTEM_ERROR"
    });
  }
};

export const listarPrecioProducto = async (req, res) => {
  try {
    const sql = `
      SELECT 
        pp.id, 
        pp.precio, 
        pp.fecha_registro, 
        pp."Producto_id", 
        pp.fecha_caducidad, 
        pp.stock, 
        pp.unidad_medida_id, 
        c.nombre AS nombre_producto,
        um.id AS unidad_medida_id,
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

    
    const transformedRows = rows.map((row) => ({
      id: row.id,
      precio: row.precio,
      fecha_registro: row.fecha_registro ? row.fecha_registro.toISOString().split('T')[0] : null,
      Producto_id: row.Producto_id,
      fecha_caducidad: row.fecha_caducidad ? row.fecha_caducidad.toISOString().split('T')[0] : null,
      stock: row.stock,
      unidad_medida: row.unidad_medida_id
        ? {
            id: row.unidad_medida_id,
            nombre: row.unidad_medida_nombre,
            descripcion: row.unidad_medida_descripcion,
            creada_por_usuario: row.unidad_medida_creada_por_usuario,
            fecha_creacion: row.unidad_medida_fecha_creacion,
          }
        : null,
      nombre_producto: row.nombre_producto,
    }));

    res.status(200).json(transformedRows);
  } catch (error) {
    console.error("Error in listarPrecioProducto:", error);
    res.status(500).json({ message: "Error en el sistema", error: error.message });
  }
};

export const eliminarPrecioProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const bodegaCheck = await pool.query(
      'SELECT id FROM bodega_precio_producto_bodegaprecioproducto WHERE producto_id = $1 LIMIT 1',
      [id]
    );
    if (bodegaCheck.rows.length > 0) {
      return res.status(400).json({
        message: "No se puede eliminar porque este precio está asociado a una bodega",
        code: "DEPENDENCY_EXISTS_BODEGA"
      });
    }

    const ventaCheck = await pool.query(
      'SELECT id FROM venta_detalleventa WHERE producto_id = $1 LIMIT 1',
      [id]
    );
    if (ventaCheck.rows.length > 0) {
      return res.status(400).json({
        message: "No se puede eliminar porque este precio está asociado a una venta",
        code: "DEPENDENCY_EXISTS_VENTA"
      });
    }

    const sql = `DELETE FROM precios_productos_precio_producto WHERE id = $1`;
    const { rowCount } = await pool.query(sql, [id]);

    if (rowCount > 0) {
      res.status(200).json({ message: "Precio producto eliminado" });
    } else {
      res.status(404).json({ message: "Precio producto no encontrado" });
    }
  } catch (error) {
    console.error("Error en eliminarPrecioProducto:", error);
    if (error.code === "23503") {
      return res.status(400).json({
        message: "No se puede eliminar debido a registros asociados",
        code: "FOREIGN_KEY_VIOLATION"
      });
    }
    res.status(500).json({
      message: "Error en el sistema",
      error: error.message,
      code: "SYSTEM_ERROR"
    });
  }
};

export const actualizarPrecioProducto = async (req, res) => {
  try {
    const { precio, fecha_registro, Producto_id, fecha_caducidad, stock, unidad_medida_id } = req.body;
    const { id } = req.params;

    
    if (!precio || precio <= 0) {
      return res.status(400).json({ message: "El precio es requerido y debe ser mayor a 0" });
    }
    if (!fecha_registro) {
      return res.status(400).json({ message: "La fecha de registro es requerida" });
    }
    if (!Producto_id) {
      return res.status(400).json({ message: "El ID del producto (cosecha) es requerido" });
    }
    if (!unidad_medida_id) {
      return res.status(400).json({ message: "El ID de la unidad de medida es requerido" });
    }

    
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(fecha_registro)) {
      return res.status(400).json({
        message: "La fecha de registro debe estar en formato YYYY-MM-DD",
        code: "INVALID_DATE_FORMAT"
      });
    }
    if (fecha_caducidad && !dateRegex.test(fecha_caducidad)) {
      return res.status(400).json({
        message: "La fecha de caducidad debe estar en formato YYYY-MM-DD",
        code: "INVALID_DATE_FORMAT"
      });
    }

    const sql = `
      UPDATE precios_productos_precio_producto 
      SET precio = $1, fecha_registro = $2::DATE, "Producto_id" = $3, fecha_caducidad = $4::DATE, stock = $5, unidad_medida_id = $6
      WHERE id = $7
    `;
    const values = [
      precio,
      fecha_registro, 
      Producto_id,
      fecha_caducidad || null,
      stock || 0,
      unidad_medida_id,
      id,
    ];

    const { rowCount } = await pool.query(sql, values);

    if (rowCount > 0) {
      res.status(200).json({ message: "Precio producto actualizado" });
    } else {
      res.status(404).json({ message: "Precio producto no encontrado" });
    }
  } catch (error) {
    if (error.code === "23503") {
      res.status(400).json({ message: "El Producto_id o unidad_medida_id no existe en la base de datos" });
    } else {
      console.error("Error in actualizarPrecioProducto:", error);
      res.status(500).json({ message: "Error en el sistema", error: error.message });
    }
  }
};


export const obtenerUnidadesMedida = async (req, res) => {
  try {
    const sql = `
      SELECT id, nombre, descripcion, creada_por_usuario, fecha_creacion
      FROM unidad_medida_unidadmedida
    `;
    const { rows } = await pool.query(sql);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error in obtenerUnidadesMedida:", error);
    res.status(500).json({ message: "Error al obtener las unidades de medida", error: error.message });
  }
};

export const obtenerCosechas = async (req, res) => {
  try {
    const sql = `
      SELECT 
        ch.id, 
        ch.id_cultivo_id,
        COALESCE(c.nombre, 'Cultivo Desconocido ' || ch.id) AS cultivo_nombre,
        ch.cantidad,
        ch.fecha,
        ch.unidades_de_medida_id,
        um.nombre AS unidad_medida_nombre,
        c."Bancal_id",
        b.nombre AS bancal_nombre
      FROM cosechas_cosecha ch
      INNER JOIN cultivos_cultivo c ON ch.id_cultivo_id = c.id
      LEFT JOIN unidad_medida_unidadmedida um ON ch.unidades_de_medida_id = um.id
      LEFT JOIN bancal_bancal b ON c."Bancal_id" = b.id
      ORDER BY ch.fecha DESC
    `;
    const { rows } = await pool.query(sql);

    console.log("Datos crudos de cosechas:", rows);

    const transformedRows = rows.map((row) => ({
      id: row.id,
      id_cultivo_id: row.id_cultivo_id,
      cultivo_nombre: row.cultivo_nombre || 'Cultivo Desconocido',
      cantidad: row.cantidad,
      fecha: row.fecha ? row.fecha.toISOString().split('T')[0] : 'Sin fecha',
      unidades_de_medida_id: row.unidades_de_medida_id,
      unidad_medida_nombre: row.unidad_medida_nombre || "Sin unidad",
      bancal_nombre: row.bancal_nombre || "Sin bancal"
    }));

    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.status(200).json(transformedRows);
  } catch (error) {
    console.error("Error al obtener cosechas:", error);
    res.status(500).json({ 
      message: "Error al obtener las cosechas", 
      error: error.message 
    });
  }
};


export const crearUnidadMedida = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    
    if (!nombre) {
      return res.status(400).json({ message: "El nombre de la unidad de medida es requerido" });
    }

    const sql = `
      INSERT INTO unidad_medida_unidadmedida (
        nombre, descripcion, creada_por_usuario, fecha_creacion
      ) VALUES ($1, $2, $3, NOW()) RETURNING id, nombre, descripcion, creada_por_usuario, fecha_creacion
    `;

    const values = [
      nombre,
      descripcion || null,
      true, 
    ];

    const { rows } = await pool.query(sql, values);
    res.status(201).json({
      message: "Unidad de medida creada",
      unidad: rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      res.status(400).json({ message: "El nombre de la unidad de medida ya existe" });
    } else {
      console.error("Error in crearUnidadMedida:", error);
      res.status(500).json({ message: "Error en el sistema", error: error.message });
    }
  }
};

export const crearCosecha = async (req, res) => {
  try {
    const { cantidad, unidades_de_medida_id, fecha, id_cultivo_id } = req.body;

    // Validaciones
    if (!cantidad || cantidad <= 0) {
      return res.status(400).json({ message: "La cantidad debe ser mayor a 0" });
    }
    if (!unidades_de_medida_id) {
      return res.status(400).json({ message: "Se requiere una unidad de medida" });
    }
    if (!fecha) {
      return res.status(400).json({ message: "La fecha es requerida" });
    }
    if (!id_cultivo_id) {
      return res.status(400).json({ message: "Debe seleccionar un cultivo" });
    }

  
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(fecha)) {
      return res.status(400).json({
        message: "La fecha debe estar en formato YYYY-MM-DD",
        code: "INVALID_DATE_FORMAT"
      });
    }

    const sql = `
      INSERT INTO cosechas_cosecha (
        cantidad, unidades_de_medida_id, fecha, id_cultivo_id
      ) VALUES ($1, $2, $3::DATE, $4)
      RETURNING id, cantidad, unidades_de_medida_id, fecha, id_cultivo_id
    `;

    const values = [
      cantidad,
      unidades_de_medida_id,
      fecha, 
      id_cultivo_id
    ];

    const { rows } = await pool.query(sql, values);
    
    res.status(201).json({
      message: "Cosecha creada exitosamente",
      cosecha: {
        id: rows[0].id,
        cantidad: rows[0].cantidad,
        unidades_de_medida_id: rows[0].unidades_de_medida_id,
        fecha: rows[0].fecha ? rows[0].fecha.toISOString().split('T')[0] : null,
        id_cultivo_id: rows[0].id_cultivo_id
      }
    });
  } catch (error) {
    console.error("Error al crear cosecha:", error);
    if (error.code === "23503") {
      res.status(400).json({ 
        message: "Error de referencia: Verifique que el cultivo y unidad de medida existan",
        code: "FOREIGN_KEY_VIOLATION"
      });
    } else {
      res.status(500).json({ 
        message: "Error al crear la cosecha", 
        error: error.message 
      });
    }
  }
};