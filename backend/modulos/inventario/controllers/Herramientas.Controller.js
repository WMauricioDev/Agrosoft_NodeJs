import pool from "../../usuarios/database/Conexion.js";

export const registrarHerramienta = async (req, res) => {
  try {
    const { nombre, descripcion, cantidad, estado, activo, fecha_registro, precio } = req.body;

    if (!nombre || !cantidad || !estado || !precio || cantidad <= 0 || precio < 0) {
      return res.status(400).json({
        status: "error",
        message: "Nombre, cantidad (positiva), estado y precio (no negativo) son requeridos"
      });
    }

    const validEstados = ["Disponible", "En uso", "Dañado"];
    if (!validEstados.includes(estado)) {
      return res.status(400).json({
        status: "error",
        message: "Estado debe ser uno de: Disponible, En uso, Dañado"
      });
    }

    const checkNombre = await pool.query('SELECT id FROM herramientas_herramienta WHERE nombre = $1', [nombre]);
    if (checkNombre.rowCount > 0) {
      return res.status(400).json({
        status: "error",
        message: "Ya existe una herramienta con ese nombre"
      });
    }

    const fechaRegistro = fecha_registro ? new Date(fecha_registro) : new Date();
    if (isNaN(fechaRegistro.getTime())) {
      return res.status(400).json({
        status: "error",
        message: "Fecha de registro inválida"
      });
    }

    const sql = `
      INSERT INTO herramientas_herramienta (nombre, descripcion, cantidad, estado, activo, fecha_registro, precio)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id
    `;
    const { rows } = await pool.query(sql, [
      nombre,
      descripcion || null,
      cantidad,
      estado,
      activo !== undefined ? activo : true,
      fechaRegistro.toISOString(),
      precio
    ]);

    res.status(201).json({
      status: "success",
      message: "Herramienta registrada correctamente",
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

export const listarHerramientas = async (req, res) => {
  try {
    const sql = `
      SELECT 
        h.id, 
        h.nombre, 
        h.descripcion, 
        h.cantidad, 
        h.estado, 
        h.activo, 
        h.fecha_registro, 
        h.precio,
        COALESCE(h.cantidad - SUM(bh.cantidad_prestada), h.cantidad) as cantidad_disponible
      FROM herramientas_herramienta h
      LEFT JOIN bodega_herramienta_bodegaherramienta bh ON h.id = bh.herramienta_id
      GROUP BY h.id
      ORDER BY h.nombre ASC
    `;
    const { rows } = await pool.query(sql);

    if (rows.length > 0) {
      res.status(200).json({
        status: "success",
        message: "Herramientas obtenidas correctamente",
        data: rows
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "No hay registros de herramientas"
      });
    }
  } catch (error) {
    console.error("Error al listar herramientas:", error);
    res.status(500).json({
      status: "error",
      message: "Error en el sistema"
    });
  }
};

export const eliminarHerramienta = async (req, res) => {
  try {
    const { id } = req.params;

    const checkHerramienta = await pool.query('SELECT id FROM herramientas_herramienta WHERE id = $1', [id]);
    if (checkHerramienta.rowCount === 0) {
      return res.status(404).json({
        status: "error",
        message: "Herramienta no encontrada"
      });
    }

    const checkReferences = await pool.query(`
      SELECT 1 FROM bodega_herramienta_bodegaherramienta WHERE herramienta_id = $1
      UNION
      SELECT 1 FROM actividades_prestamoherramienta WHERE herramienta_id = $1
      LIMIT 1
    `, [id]);
    if (checkReferences.rowCount > 0) {
      return res.status(400).json({
        status: "error",
        message: "No se puede eliminar la herramienta porque está referenciada en otros registros"
      });
    }

    const sql = 'DELETE FROM herramientas_herramienta WHERE id = $1';
    const { rowCount } = await pool.query(sql, [id]);

    if (rowCount > 0) {
      res.status(200).json({
        status: "success",
        message: "Herramienta eliminada correctamente"
      });
    } else {
      res.status(400).json({
        status: "error",
        message: "No se pudo eliminar la herramienta"
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

export const actualizarHerramienta = async (req, res) => {
  try {
    const { nombre, descripcion, cantidad, estado, activo, fecha_registro, precio } = req.body;
    const { id } = req.params;

    if (!nombre || !cantidad || !estado || !precio || cantidad <= 0 || precio < 0) {
      return res.status(400).json({
        status: "error",
        message: "Nombre, cantidad (positiva), estado y precio (no negativo) son requeridos"
      });
    }

    const validEstados = ["Disponible", "En uso", "Dañado"];
    if (!validEstados.includes(estado)) {
      return res.status(400).json({
        status: "error",
        message: "Estado debe ser uno de: Disponible, En uso, Dañado"
      });
    }

    const checkHerramienta = await pool.query('SELECT id FROM herramientas_herramienta WHERE id = $1', [id]);
    if (checkHerramienta.rowCount === 0) {
      return res.status(404).json({
        status: "error",
        message: "Herramienta no encontrada"
      });
    }

    const checkNombre = await pool.query('SELECT id FROM herramientas_herramienta WHERE nombre = $1 AND id != $2', [nombre, id]);
    if (checkNombre.rowCount > 0) {
      return res.status(400).json({
        status: "error",
        message: "Ya existe otra herramienta con ese nombre"
      });
    }

    const fechaRegistro = fecha_registro ? new Date(fecha_registro) : new Date();
    if (isNaN(fechaRegistro.getTime())) {
      return res.status(400).json({
        status: "error",
        message: "Fecha de registro inválida"
      });
    }

    const sql = `
      UPDATE herramientas_herramienta
      SET nombre = $1, descripcion = $2, cantidad = $3, estado = $4, activo = $5, fecha_registro = $6, precio = $7
      WHERE id = $8
    `;
    const { rowCount } = await pool.query(sql, [
      nombre,
      descripcion || null,
      cantidad,
      estado,
      activo !== undefined ? activo : true,
      fechaRegistro.toISOString(),
      precio,
      id
    ]);

    if (rowCount > 0) {
      res.status(200).json({
        status: "success",
        message: "Herramienta actualizada correctamente"
      });
    } else {
      res.status(400).json({
        status: "error",
        message: "No se pudo actualizar la herramienta"
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