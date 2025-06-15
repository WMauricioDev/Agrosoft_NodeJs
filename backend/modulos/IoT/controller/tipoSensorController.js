import pool from '../../usuarios/database/Conexion.js';

export const registrarTipoSensor = async (req, res) => {
  try {
    const { nombre, unidad_medida, medida_minima, medida_maxima, descripcion } = req.body;
    const sql = `
      INSERT INTO sensores_tiposensor (nombre, unidad_medida, medida_minima, medida_maxima, descripcion)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const { rows, rowCount } = await pool.query(sql, [nombre, unidad_medida, medida_minima, medida_maxima, descripcion]);

    if (rowCount > 0) {
      res.status(201).json({ message: 'Tipo de sensor registrado', data: rows[0] });
    } else {
      res.status(400).json({ message: 'Tipo de sensor no registrado' });
    }
  } catch (error) {
    console.error('Error al registrar tipo de sensor:', error);
    res.status(500).json({ message: 'Error en el sistema' });
  }
};

export const listarTiposSensor = async (req, res) => {
  try {
    const sql = 'SELECT * FROM sensores_tiposensor';
    const { rows } = await pool.query(sql);

    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(404).json({ message: 'No hay registros de tipos de sensores' });
    }
  } catch (error) {
    console.error('Error al listar tipos de sensores:', error);
    res.status(500).json({ message: 'Error en el sistema' });
  }
};

export const eliminarTipoSensor = async (req, res) => {
  try {
    const id = req.params.id;
    const sql = 'DELETE FROM sensores_tiposensor WHERE id = $1 RETURNING *';
    const { rowCount } = await pool.query(sql, [id]);

    if (rowCount > 0) {
      res.status(200).json({ message: 'Tipo de sensor eliminado' });
    } else {
      res.status(404).json({ message: 'Tipo de sensor no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar tipo de sensor:', error);
    res.status(500).json({ message: 'Error en el sistema' });
  }
};

export const actualizarTipoSensor = async (req, res) => {
  try {
    const { nombre, unidad_medida, medida_minima, medida_maxima, descripcion } = req.body;
    const id = req.params.id;
    const sql = `
      UPDATE sensores_tiposensor 
      SET nombre = $1, unidad_medida = $2, medida_minima = $3, medida_maxima = $4, descripcion = $5 
      WHERE id = $6
      RETURNING *
    `;
    const { rows, rowCount } = await pool.query(sql, [nombre, unidad_medida, medida_minima, medida_maxima, descripcion, id]);

    if (rowCount > 0) {
      res.status(200).json({ message: 'Tipo de sensor actualizado', data: rows[0] });
    } else {
      res.status(404).json({ message: 'Tipo de sensor no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar tipo de sensor:', error);
    res.status(500).json({ message: 'Error en el sistema' });
  }
};

export const obtenerTipoSensor = async (req, res) => {
  try {
    const id = req.params.id;
    const sql = 'SELECT * FROM sensores_tiposensor WHERE id = $1';
    const { rows } = await pool.query(sql, [id]);

    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ message: 'Tipo de sensor no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener tipo de sensor:', error);
    res.status(500).json({ message: 'Error en el sistema' });
  }
};