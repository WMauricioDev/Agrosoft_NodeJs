import pool from "../../usuarios/database/Conexion.js";
async function validateStock(insumos = [], herramientas = []) {
  const errors = [];
  const insumosArray = Array.isArray(insumos) ? insumos : [];
  const herramientasArray = Array.isArray(herramientas) ? herramientas : [];

  for (const insumo of insumosArray) {
    try {
      if (!insumo || typeof insumo !== 'object' || !insumo.insumo_id || !insumo.cantidad_usada) {
        errors.push(`Insumo inválido: ${JSON.stringify(insumo)}`);
        continue;
      }

      const queryResult = await pool.query(
        'SELECT cantidad FROM insumos_insumo WHERE id = $1', 
        [insumo.insumo_id]
      );
      
      if (queryResult.rows.length === 0 || queryResult.rows[0].cantidad < insumo.cantidad_usada) {
        errors.push(`Insumo ${insumo.insumo_id} no tiene suficiente stock`);
      }
    } catch (error) {
      console.error(`Error validando insumo ${insumo?.insumo_id}:`, error);
      errors.push(`Error validando insumo ${insumo?.insumo_id}`);
    }
  }

  for (const herramienta of herramientasArray) {
    try {
      if (!herramienta || typeof herramienta !== 'object' || !herramienta.herramienta_id || !herramienta.cantidad_entregada) {
        errors.push(`Herramienta inválida: ${JSON.stringify(herramienta)}`);
        continue;
      }

      const queryResult = await pool.query(
        'SELECT cantidad FROM bodega_herramienta_bodegaherramienta WHERE herramienta_id = $1', 
        [herramienta.herramienta_id]
      );
      
      if (queryResult.rows.length === 0 || queryResult.rows[0].cantidad < herramienta.cantidad_entregada) {
        errors.push(`Herramienta ${herramienta.herramienta_id} no tiene suficiente stock`);
      }
    } catch (error) {
      console.error(`Error validando herramienta ${herramienta?.herramienta_id}:`, error);
      errors.push(`Error validando herramienta ${herramienta?.herramienta_id}`);
    }
  }

  return errors;
}
export const actividadController = {
async getAll(req, res) {
  try {
    // Consulta principal de actividades
    const actividadesResult = await pool.query(`
      SELECT a.*, 
             t.nombre as tipo_actividad_nombre, 
             c.nombre as cultivo_nombre,
             json_agg(u.nombre) as usuarios_data
      FROM actividades_actividad a
      LEFT JOIN tipo_actividad_tipoactividad t ON a.tipo_actividad_id = t.id
      LEFT JOIN cultivos_cultivo c ON a.cultivo_id = c.id
      LEFT JOIN actividades_actividad_usuarios au ON a.id = au.actividad_id
      LEFT JOIN usuarios_usuarios u ON au.usuarios_id = u.id
      GROUP BY a.id, t.nombre, c.nombre
      ORDER BY a.fecha_fin DESC
    `);
    
    const actividades = actividadesResult.rows;

    for (const actividad of actividades) {
      const insumosResult = await pool.query(`
        SELECT pi.*, i.nombre as insumo_nombre
        FROM actividades_prestamoinsumo pi
        LEFT JOIN insumos_insumo i ON pi.insumo_id = i.id
        WHERE pi.actividad_id = $1
      `, [actividad.id]);

      const herramientasResult = await pool.query(`
        SELECT ph.*, h.nombre as herramienta_nombre, bh.cantidad as bodega_herramienta_cantidad
        FROM actividades_prestamoherramienta ph
        LEFT JOIN herramientas_herramienta h ON ph.herramienta_id = h.id
        LEFT JOIN bodega_herramienta_bodegaherramienta bh ON ph.bodega_herramienta_id = bh.id
        WHERE ph.actividad_id = $1
      `, [actividad.id]);

      actividad.prestamos_insumos = insumosResult.rows;
      actividad.prestamos_herramientas = herramientasResult.rows;
    }

    res.status(200).json(actividades);
  } catch (error) {
    console.error('Error in getAll:', error);
    res.status(500).json({ 
      error: 'Error al obtener las actividades',
      details: error.message 
    });
  }
}
,

 async create(req, res) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    console.log('Payload recibido en create:', req.body);

    const {
      descripcion, fecha_inicio, fecha_fin, tipo_actividad_id, cultivo_id,
      estado = 'PENDIENTE', prioridad = 'MEDIA', instrucciones_adicionales,
      usuarios, insumos, herramientas
    } = req.body;

    console.log('Desestructurado - Usuarios:', usuarios);
    console.log('Desestructurado - Insumos:', insumos);
    console.log('Desestructurado - Herramientas:', herramientas);

    if (!Array.isArray(usuarios)) {
      throw new Error('Usuarios debe ser un array');
    }
    if (!Array.isArray(insumos)) {
      throw new Error('Insumos debe ser un array');
    }
    if (!Array.isArray(herramientas)) {
      throw new Error('Herramientas debe ser un array');
    }

    console.log('Antes de validateStock - Insumos:', insumos);
    console.log('Antes de validateStock - Herramientas:', herramientas);
    const stockErrors = await validateStock(insumos, herramientas);
    if (stockErrors.length > 0) {
      return res.status(400).json({ errors: stockErrors });
    }

    const result = await client.query(`
      INSERT INTO actividades_actividad (
        descripcion, fecha_inicio, fecha_fin, tipo_actividad_id, cultivo_id,
        estado, prioridad, instrucciones_adicionales
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      descripcion, fecha_inicio, fecha_fin, tipo_actividad_id, cultivo_id,
      estado, prioridad, instrucciones_adicionales || null
    ]);

    const actividad = result.rows[0];
    console.log('Actividad creada:', actividad);

    if (!actividad?.id) {
      throw new Error('No se pudo crear la actividad');
    }

    console.log('Antes de procesar usuarios - Usuarios:', usuarios);
    for (const usuarioId of usuarios) {
      await client.query(`
        INSERT INTO actividades_actividad_usuarios (actividad_id, usuarios_id)
        VALUES ($1, $2)
      `, [actividad.id, usuarioId]);
    }

    console.log('Antes de procesar insumos - Insumos:', insumos);
    if (insumos.length > 0) {
      for (const insumo of insumos) {
        console.log('Procesando insumo:', insumo);
        await client.query(`
          UPDATE insumos_insumo SET cantidad = cantidad - $1 WHERE id = $2
        `, [insumo.cantidad_usada, insumo.insumo_id]);

        await client.query(`
          INSERT INTO actividades_prestamoinsumo (
            actividad_id, insumo_id, cantidad_usada, cantidad_devuelta, unidad_medida_id
          ) VALUES ($1, $2, $3, $4, $5)
        `, [actividad.id, insumo.insumo_id, insumo.cantidad_usada, 0, insumo.unidad_medida_id || null]);
      }
    } else {
      console.log('No hay insumos para procesar');
    }

    console.log('Antes de procesar herramientas - Herramientas:', herramientas);
    if (herramientas.length > 0) {
      for (const herramienta of herramientas) {
        console.log('Procesando herramienta:', herramienta);
        const bodegaResult = await client.query(`
          UPDATE bodega_herramienta_bodegaherramienta 
          SET cantidad = cantidad - $1, cantidad_prestada = cantidad_prestada + $1
          WHERE herramienta_id = $2
          RETURNING id
        `, [herramienta.cantidad_entregada, herramienta.herramienta_id]);

        const bodega = bodegaResult.rows[0];

        await client.query(`
          INSERT INTO actividades_prestamoherramienta (
            actividad_id, herramienta_id, bodega_herramienta_id, 
            cantidad_entregada, cantidad_devuelta, entregada, devuelta
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
          actividad.id, herramienta.herramienta_id, bodega?.id || null,
          herramienta.cantidad_entregada, 0, true, false
        ]);
      }
    } else {
      console.log('No hay herramientas para procesar');
    }

    await client.query('COMMIT');
    res.status(201).json({ message: 'Actividad creada correctamente', actividad });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error in create:', error);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
},

async finalizar(req, res) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const actividadResult = await client.query(
      'SELECT * FROM actividades_actividad WHERE id = $1', 
      [req.params.id]
    );
    
    if (actividadResult.rows.length === 0) {
      return res.status(404).json({ error: 'Actividad no encontrada' });
    }

    const actividad = actividadResult.rows[0];

    if (actividad.estado === 'COMPLETADA') {
      return res.status(400).json({ error: 'Esta actividad ya está completada' });
    }

    if (!req.body.fecha_fin) {
      return res.status(400).json({ error: 'La fecha de finalización es requerida' });
    }

    await client.query(
      `UPDATE actividades_actividad 
       SET estado = 'COMPLETADA', fecha_fin = $1
       WHERE id = $2`,
      [req.body.fecha_fin, req.params.id]
    );

    await client.query(
      `UPDATE actividades_prestamoinsumo 
       SET cantidad_devuelta = cantidad_usada, fecha_devolucion = $1
       WHERE actividad_id = $2`,
      [req.body.fecha_fin, req.params.id]
    );

    const herramientasResult = await client.query(
      `SELECT * FROM actividades_prestamoherramienta 
       WHERE actividad_id = $1 AND devuelta = false`,
      [req.params.id]
    );

    const herramientas = herramientasResult.rows;

    for (const herramienta of herramientas) {
      const cantidad_devuelta = herramienta.cantidad_entregada - herramienta.cantidad_devuelta;
      
      await client.query(
        `UPDATE bodega_herramienta_bodegaherramienta 
         SET cantidad = cantidad + $1, cantidad_prestada = cantidad_prestada - $1
         WHERE id = $2`,
        [cantidad_devuelta, herramienta.bodega_herramienta_id]
      );

      await client.query(
        `UPDATE actividades_prestamoherramienta 
         SET cantidad_devuelta = cantidad_entregada, devuelta = true, fecha_devolucion = $1
         WHERE id = $2`,
        [req.body.fecha_fin, herramienta.id]
      );
    }

    await client.query('COMMIT');
    
    const insumosCountResult = await client.query(
      'SELECT COUNT(*) FROM actividades_prestamoinsumo WHERE actividad_id = $1',
      [req.params.id]
    );

    res.status(200).json({
      message: 'Actividad finalizada correctamente',
      insumos_devueltos: insumosCountResult.rows[0].count,
      herramientas_devueltas: herramientas.length
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error in finalizar:', error);
    res.status(500).json({ 
      error: 'Error al finalizar la actividad',
      details: error.message 
    });
  } finally {
    client.release();
  }
},

 async delete(req, res) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const insumosResult = await client.query(
      'SELECT * FROM actividades_prestamoinsumo WHERE actividad_id = $1', 
      [req.params.id]
    );
    
    for (const insumo of insumosResult.rows) {
      await client.query(
        'UPDATE insumos_insumo SET cantidad = cantidad + $1 WHERE id = $2', 
        [insumo.cantidad_usada, insumo.insumo_id]
      );
    }

    const herramientasResult = await client.query(
      'SELECT * FROM actividades_prestamoherramienta WHERE actividad_id = $1 AND devuelta = false', 
      [req.params.id]
    );
    
    for (const herramienta of herramientasResult.rows) {
      await client.query(
        `UPDATE bodega_herramienta_bodegaherramienta 
         SET cantidad = cantidad + $1, cantidad_prestada = cantidad_prestada - $1
         WHERE id = $2`,
        [herramienta.cantidad_entregada, herramienta.bodega_herramienta_id]
      );
    }

    await client.query(
      'DELETE FROM actividades_prestamoinsumo WHERE actividad_id = $1', 
      [req.params.id]
    );
    
    await client.query(
      'DELETE FROM actividades_prestamoherramienta WHERE actividad_id = $1', 
      [req.params.id]
    );
    
    await client.query(
      'DELETE FROM actividades_actividad_usuarios WHERE actividad_id = $1', 
      [req.params.id]
    );
    
    const deleteResult = await client.query(
      'DELETE FROM actividades_actividad WHERE id = $1 RETURNING id', 
      [req.params.id]
    );

    if (deleteResult.rows.length === 0) {
      return res.status(404).json({ error: 'Actividad no encontrada' });
    }

    await client.query('COMMIT');
    res.status(200).json({ 
      message: 'Actividad eliminada correctamente',
      id: deleteResult.rows[0].id
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error in delete:', error);
    res.status(500).json({ 
      error: 'Error al eliminar la actividad',
      details: error.message 
    });
  } finally {
    client.release();
  }
}
}