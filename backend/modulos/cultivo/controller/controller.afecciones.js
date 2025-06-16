import pool from "../../usuarios/database/Conexion.js";

export const postAfecciones = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      fecha_deteccion,
      plaga_id,
      bancal_id,
      cultivo_id,
      gravedad,
      reporte_id
    } = req.body;

    const estado = 'AC'; 

    const sqlBase = `
      INSERT INTO afecciones_afeccion 
      (nombre, descripcion, fecha_deteccion, plaga_id, bancal_id, cultivo_id, gravedad, estado${reporte_id ? ', reporte_id' : ''})
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8${reporte_id ? ', $9' : ''})
      RETURNING id
    `;

    const valores = reporte_id
      ? [nombre, descripcion, fecha_deteccion, plaga_id, bancal_id, cultivo_id, gravedad, estado, reporte_id]
      : [nombre, descripcion, fecha_deteccion, plaga_id, bancal_id, cultivo_id, gravedad, estado];

    const result = await pool.query(sqlBase, valores);

    if (result.rows.length > 0) {
      return res.status(201).json({
        message: "Afección registrada correctamente",
        id: result.rows[0].id
      });
    }

    return res.status(400).json({ message: "No se pudo registrar la afección" });
  } catch (error) {
    console.error('Error in postAfecciones:', error.message);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const getAfecciones = async (req, res) => {
    try {
        const sql = `
SELECT 
  a.id,
  a.nombre,
  a.descripcion,
  a.fecha_deteccion,
  a.estado,
  a.gravedad,

  -- Objeto plaga
  json_build_object(
    'id', p.id,
    'nombre', p.nombre,
    'descripcion', p.descripcion
  ) AS plaga,

  -- Objeto bancal
  json_build_object(
    'id', b.id,
    'nombre', b.nombre,
    'ubicacion', b.latitud
  ) AS bancal,

  -- Objeto cultivo
  json_build_object(
    'id', c.id,
    'nombre', c.nombre
  ) AS cultivo,

  -- Objeto reporte (puede ser null)
  CASE
    WHEN r.id IS NOT NULL THEN json_build_object(
      'id', r.id,
      'usuario', u.nombre
    )
    ELSE NULL
  END AS reporte

FROM afecciones_afeccion a
LEFT JOIN plagas_plaga p ON a.plaga_id = p.id
LEFT JOIN bancal_bancal b ON a.bancal_id = b.id
LEFT JOIN cultivos_cultivo c ON a.cultivo_id = c.id
LEFT JOIN "ReportePlaga_reporteplaga" r ON a.reporte_id = r.id
LEFT JOIN usuarios_usuarios u ON r.usuario_id = u.id;
`;

        const result = await pool.query(sql);
        
        if (result.rows.length > 0) {
            return res.status(200).json(result.rows);
        } else {
            return res.status(404).json({ message: "No hay registros de afecciones" });
        }
    } catch (error) {
        console.error('Error in getAfecciones:', error.message);
        return res.status(500).json({ message: "Error en el servidor" });
    }
};

export const getIdAfecciones = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "SELECT * FROM afecciones_afeccion WHERE id = $1";
        const result = await pool.query(sql, [id]);
        
        if (result.rows.length > 0) {
            return res.status(200).json(result.rows[0]);
        } else {
            return res.status(404).json({ message: "Afección no encontrada" });
        }
    } catch (error) {
        console.error('Error in getIdAfecciones:', error.message);
        return res.status(500).json({ message: "Error en el servidor" });
    }
};

export const updateAfecciones = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      descripcion,
      fecha_deteccion,
      plaga_id,
      bancal_id,
      cultivo_id,
      gravedad,
      reporte_id,
      estado = 'AC'  
    } = req.body;

    const sql = `
      UPDATE afecciones_afeccion
      SET 
        nombre = $1,
        descripcion = $2,
        fecha_deteccion = $3,
        plaga_id = $4,
        bancal_id = $5,
        cultivo_id = $6,
        gravedad = $7,
        reporte_id = $8,
        estado = $9
      WHERE id = $10
    `;

    const valores = [
      nombre,
      descripcion,
      fecha_deteccion,
      plaga_id,
      bancal_id,
      cultivo_id,
      gravedad,
      reporte_id || null,
      estado,
      id
    ];

    const result = await pool.query(sql, valores);

    return res.status(200).json({ message: "Afección actualizada correctamente" });
  } catch (error) {
    console.error('Error in updateAfecciones:', error.message);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

export const deleteAfecciones = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "DELETE FROM afecciones_afeccion WHERE id = $1";
        const result = await pool.query(sql, [id]);
        
        if (result.rowCount > 0) {
            return res.status(200).json({ message: "Afección eliminada correctamente" });
        }
        return res.status(404).json({ message: "No se pudo eliminar la afección" });
    } catch (error) {
        console.error('Error in deleteAfecciones:', error.message);
        return res.status(500).json({ message: "Error en el servidor" });
    }
};



export const cambiarEstadoAfeccion = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const estadosValidos = ['AC', 'ST', 'EC', 'EL'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ message: 'Estado no válido' });
    }

    const sql = `
      UPDATE afecciones_afeccion
      SET estado = $1
      WHERE id = $2
      RETURNING id, estado
    `;

    const result = await pool.query(sql, [estado, id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Afección no encontrada' });
    }

    return res.status(200).json({
      message: 'Estado actualizado correctamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al cambiar el estado de la afección:', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};
