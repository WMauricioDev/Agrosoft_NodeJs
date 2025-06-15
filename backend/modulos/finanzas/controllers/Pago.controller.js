import pool from "../../usuarios/database/Conexion.js";

export const postPago = async (req, res) => {
  try {
    const { usuario_id, fecha_inicio, fecha_fin } = req.body;
    console.log("Datos recibidos en postPago:", { usuario_id, fecha_inicio, fecha_fin });

    if (!usuario_id || !fecha_inicio || !fecha_fin) {
      return res.status(400).json({ message: "Usuario, fecha de inicio y fecha de fin son requeridos" });
    }

    if (new Date(fecha_inicio) > new Date(fecha_fin)) {
      return res.status(400).json({ message: "La fecha de inicio no puede ser mayor que la fecha fin" });
    }

    const usuarioQuery = "SELECT * FROM usuarios_usuarios WHERE id = $1";
    const usuarioResult = await pool.query(usuarioQuery, [usuario_id]);
    console.log("Usuario encontrado:", usuarioResult.rows[0]);
    if (usuarioResult.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    const usuario = usuarioResult.rows[0];
    if (!usuario.rol_id) {
      return res.status(400).json({ message: "El usuario no tiene un rol asignado" });
    }

    const sql = `
      INSERT INTO pagos_pago (usuario_id, fecha_inicio, fecha_fin, horas_trabajadas, jornales, total_pago, fecha_calculo)
      VALUES ($1, $2, $3, 0, 0, 0, NOW())
      RETURNING *`;
    const result = await pool.query(sql, [usuario_id, fecha_inicio, fecha_fin]);
    console.log("Pago creado:", result.rows[0]);

    if (result.rows.length > 0) {
      const pagoCompletoQuery = `
        SELECT p.*, u.nombre AS usuario_nombre, r.nombre AS usuario_rol
        FROM pagos_pago p
        JOIN usuarios_usuarios u ON p.usuario_id = u.id
        JOIN roles_roles r ON u.rol_id = r.id
        WHERE p.id = $1`;
      const pagoCompletoResult = await pool.query(pagoCompletoQuery, [result.rows[0].id]);
      console.log("Pago completo:", pagoCompletoResult.rows[0]);

      return res.status(201).json({
        message: "Pago creado correctamente",
        pago: pagoCompletoResult.rows[0],
      });
    }

    return res.status(400).json({ message: "No se pudo crear el pago" });
  } catch (error) {
    console.error("Error en postPago:", error);
    return res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};

export const calcularPago = async (req, res) => {
  try {
    const { usuario_id, fecha_inicio, fecha_fin } = req.body;
    console.log("Datos recibidos:", { usuario_id, fecha_inicio, fecha_fin });

    if (!usuario_id || !fecha_inicio || !fecha_fin) {
      return res.status(400).json({ message: "Usuario, fecha de inicio y fecha de fin son requeridos" });
    }

    if (new Date(fecha_inicio) > new Date(fecha_fin)) {
      return res.status(400).json({ message: "La fecha de inicio no puede ser mayor que la fecha fin" });
    }

    const usuarioQuery = "SELECT * FROM usuarios_usuarios WHERE id = $1";
    const usuarioResult = await pool.query(usuarioQuery, [usuario_id]);
    console.log("Usuario encontrado:", usuarioResult.rows[0]);
    if (usuarioResult.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    const usuario = usuarioResult.rows[0];
    if (!usuario.rol_id) {
      return res.status(400).json({ message: "El usuario no tiene un rol asignado" });
    }

    const actividadesQuery = `
      SELECT a.* 
      FROM actividades_actividad a
      JOIN actividades_actividad_usuarios au ON a.id = au.actividad_id
      WHERE au.usuarios_id = $1
      AND a.estado = 'COMPLETADA'
      AND DATE(a.fecha_fin) >= $2
      AND DATE(a.fecha_fin) <= $3`;
    const actividadesResult = await pool.query(actividadesQuery, [usuario_id, fecha_inicio, fecha_fin]);
    console.log("Actividades encontradas:", actividadesResult.rows.length);

    if (actividadesResult.rows.length === 0) {
      return res.status(400).json({ message: "No hay actividades completadas en el rango especificado" });
    }

    const totalSegundos = actividadesResult.rows.reduce((total, actividad) => {
      if (!actividad.fecha_inicio || !actividad.fecha_fin) {
        console.warn(`Actividad ${actividad.id} tiene fechas inválidas`);
        return total;
      }
      const inicio = new Date(actividad.fecha_inicio);
      const fin = new Date(actividad.fecha_fin);
      if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
        console.warn(`Actividad ${actividad.id} tiene fechas no válidas`);
        return total;
      }
      return total + (fin - inicio) / 1000;
    }, 0);
    const horasTrabajadas = totalSegundos / 3600;
    console.log("Horas trabajadas:", horasTrabajadas);

    const salarioQuery = `
      SELECT * FROM salario_salario
      WHERE rol_id = $1
      AND activo = TRUE
      AND fecha_de_implementacion <= $2
      ORDER BY fecha_de_implementacion DESC LIMIT 1`;
    const salarioResult = await pool.query(salarioQuery, [usuario.rol_id, fecha_fin]);
    console.log("Salario encontrado:", salarioResult.rows[0]);
    if (salarioResult.rows.length === 0) {
      return res.status(400).json({ message: `No existe un salario configurado para el rol ${usuario.rol_id}` });
    }
    const salario = salarioResult.rows[0];

    if (!salario.valorJornal || isNaN(parseFloat(salario.valorJornal))) {
      console.log("Valor jornal inválido:", salario.valorJornal);
      return res.status(400).json({ message: "El salario no tiene un valor de jornal válido" });
    }

    const jornales = horasTrabajadas / 8; 
    const totalPago = jornales * parseFloat(salario.valorJornal);
    console.log("Cálculo:", { horasTrabajadas, jornales, totalPago });

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const pagoQuery = `
        INSERT INTO pagos_pago (usuario_id, salario_id, fecha_inicio, fecha_fin, horas_trabajadas, jornales, total_pago, fecha_calculo)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        RETURNING *`;
      const valores = [
        usuario_id,
        salario.id,
        fecha_inicio,
        fecha_fin,
        Math.round(horasTrabajadas * 100) / 100,
        Math.round(jornales * 100) / 100,
        Math.round(totalPago * 100) / 100,
      ];
      console.log("Valores para INSERT:", valores);
      const pagoResult = await client.query(pagoQuery, valores);

      const pago = pagoResult.rows[0];

      const actividadesInsertQuery = `
        INSERT INTO pagos_pago_actividades (pago_id, actividad_id)
        VALUES ($1, $2)`;
      for (const actividad of actividadesResult.rows) {
        console.log(`Insertando relación para actividad: ${actividad.id}`);
        await client.query(actividadesInsertQuery, [pago.id, actividad.id]);
      }

      await client.query("COMMIT");

      const pagoCompletoQuery = `
        SELECT p.*, u.nombre AS usuario_nombre, r.nombre AS usuario_rol,
               ARRAY_AGG(pa.actividad_id) AS actividades
        FROM pagos_pago p
        JOIN usuarios_usuarios u ON p.usuario_id = u.id
        JOIN roles_roles r ON u.rol_id = r.id
        LEFT JOIN pagos_pago_actividades pa ON p.id = pa.pago_id
        WHERE p.id = $1
        GROUP BY p.id, u.nombre, r.nombre`;
      const pagoCompletoResult = await pool.query(pagoCompletoQuery, [pago.id]);
      console.log("Pago completo:", pagoCompletoResult.rows[0]);

      return res.status(201).json(pagoCompletoResult.rows[0]);
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("Error en transacción:", err);
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error en calcularPago:", error);
    return res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};

export const getPagos = async (req, res) => {
  try {
    const sql = `
      SELECT p.*, u.nombre AS usuario_nombre, r.nombre AS usuario_rol,
             ARRAY_AGG(pa.actividad_id) AS actividades
      FROM pagos_pago p
      JOIN usuarios_usuarios u ON p.usuario_id = u.id
      JOIN roles_roles r ON u.rol_id = r.id
      LEFT JOIN pagos_pago_actividades pa ON p.id = pa.pago_id
      GROUP BY p.id, u.nombre, r.nombre
      ORDER BY p.fecha_calculo DESC`;
    const result = await pool.query(sql);
    console.log("Pagos recuperados:", result.rows.length);
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error en getPagos:", error);
    return res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};

export const getIdPago = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `
      SELECT p.*, u.nombre AS usuario_nombre, r.nombre AS usuario_rol,
             ARRAY_AGG(pa.actividad_id) AS actividades
      FROM pagos_pago p
      JOIN usuarios_usuarios u ON p.usuario_id = u.id
      JOIN roles_roles r ON u.rol_id = r.id
      LEFT JOIN pagos_pago_actividades pa ON p.id = pa.pago_id
      WHERE p.id = $1
      GROUP BY p.id, u.nombre, r.nombre`;
    const result = await pool.query(sql, [id]);
    console.log("Pago encontrado:", result.rows[0]);

    if (result.rows.length > 0) {
      return res.status(200).json(result.rows[0]);
    } else {
      return res.status(404).json({ message: "Pago no encontrado" });
    }
  } catch (error) {
    console.error("Error en getIdPago:", error);
    return res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};

export const updatePago = async (req, res) => {
  try {
    const { id } = req.params;
    const { usuario_id, fecha_inicio, fecha_fin } = req.body;
    console.log("Datos recibidos en updatePago:", { id, usuario_id, fecha_inicio, fecha_fin });

    if (!usuario_id || !fecha_inicio || !fecha_fin) {
      return res.status(400).json({ message: "Usuario, fecha de inicio y fecha de fin son requeridos" });
    }

    if (new Date(fecha_inicio) > new Date(fecha_fin)) {
      return res.status(400).json({ message: "La fecha de inicio no puede ser mayor que la fecha fin" });
    }

    const usuarioQuery = "SELECT * FROM usuarios_usuarios WHERE id = $1";
    const usuarioResult = await pool.query(usuarioQuery, [usuario_id]);
    console.log("Usuario encontrado:", usuarioResult.rows[0]);
    if (usuarioResult.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    const usuario = usuarioResult.rows[0];
    if (!usuario.rol_id) {
      return res.status(400).json({ message: "El usuario no tiene un rol asignado" });
    }

    const pagoQuery = "SELECT * FROM pagos_pago WHERE id = $1";
    const pagoResult = await pool.query(pagoQuery, [id]);
    if (pagoResult.rows.length === 0) {
      return res.status(404).json({ message: "Pago no encontrado" });
    }

    const sql = `
      UPDATE pagos_pago
      SET usuario_id = $1, fecha_inicio = $2, fecha_fin = $3
      WHERE id = $4
      RETURNING *`;
    const result = await pool.query(sql, [usuario_id, fecha_inicio, fecha_fin, id]);
    console.log("Pago actualizado:", result.rows[0]);

    if (result.rowCount > 0) {
      const pagoCompletoQuery = `
        SELECT p.*, u.nombre AS usuario_nombre, r.nombre AS usuario_rol,
               ARRAY_AGG(pa.actividad_id) AS actividades
        FROM pagos_pago p
        JOIN usuarios_usuarios u ON p.usuario_id = u.id
        JOIN roles_roles r ON u.rol_id = r.id
        LEFT JOIN pagos_pago_actividades pa ON p.id = pa.pago_id
        WHERE p.id = $1
        GROUP BY p.id, u.nombre, r.nombre`;
      const pagoCompletoResult = await pool.query(pagoCompletoQuery, [id]);
      console.log("Pago completo:", pagoCompletoResult.rows[0]);

      return res.status(200).json({
        message: "Pago actualizado correctamente",
        pago: pagoCompletoResult.rows[0],
      });
    }
    return res.status(400).json({ message: "No se pudo actualizar el pago" });
  } catch (error) {
    console.error("Error en updatePago:", error);
    return res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};

export const deletePago = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Eliminando pago con ID:", id);

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const deleteActividadesQuery = "DELETE FROM pagos_pago_actividades WHERE pago_id = $1";
      await client.query(deleteActividadesQuery, [id]);
      console.log("Relaciones de actividades eliminadas para pago:", id);

      const sql = "DELETE FROM pagos_pago WHERE id = $1 RETURNING *";
      const result = await client.query(sql, [id]);
      console.log("Pago eliminado:", result.rows[0]);

      if (result.rowCount > 0) {
        await client.query("COMMIT");
        return res.status(200).json({ message: "Pago eliminado correctamente" });
      }
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Pago no encontrado" });
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error en transacción de deletePago:", error);
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error en deletePago:", error);
    return res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};