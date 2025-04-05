import pool from '../database/Conexion.js';

export const RegistrarUsuarios = async (req, res) => {
  try {
    const { identificacion, nombre, apellido, fecha_nacimiento, telefono, email, password, area_desarrollo, cargo } = req.body;
    
    if (!identificacion || !password || !nombre || !apellido || !email) {
      return res.status(400).json({ message: 'Identificación, nombre, apellido, email y contraseña son obligatorios' });
    }

    const sql = `
      INSERT INTO usuarios (identificacion, nombre, apellido, fecha_nacimiento, telefono, email, password, area_desarrollo, cargo) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;
    const result = await pool.query(sql, [
      identificacion, nombre, apellido, fecha_nacimiento, telefono, email, password, area_desarrollo, cargo
    ]);

    if (result.rowCount > 0) {
      return res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } else {
      return res.status(404).json({ message: 'Usuario no registrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el usuario' });
  }
};

export const listarUsuarios = async (req, res) => {
  try {
    const sql = 'SELECT * FROM usuarios';
    const result = await pool.query(sql);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al listar los usuarios' });
  }
};

export const ActualizarUsuarios = async (req, res) => {
  try {
    const { identificacion, nombre, apellido, fecha_nacimiento, telefono, email, password, area_desarrollo, cargo } = req.body;
    const id = req.params.id;

    const sql = `
      UPDATE usuarios 
      SET identificacion=$1, nombre=$2, apellido=$3, fecha_nacimiento=$4, telefono=$5, email=$6, password=$7, area_desarrollo=$8, cargo=$9 
      WHERE id=$10
    `;
    const result = await pool.query(sql, [
      identificacion, nombre, apellido, fecha_nacimiento, telefono, email, password, area_desarrollo, cargo, id
    ]);

    if (result.rowCount > 0) {
      return res.status(200).json({ message: 'Usuario actualizado exitosamente' });
    } else {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el usuario' });
  }
};

export const EliminarUsuarios = async (req, res) => {
  try {
    const id = req.params.id;
    const sql = 'DELETE FROM usuarios WHERE id=$1';
    const result = await pool.query(sql, [id]);

    if (result.rowCount > 0) {
      return res.status(200).json({ message: 'Usuario eliminado exitosamente' });
    } else {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
};

export const BuscarUsuarios = async (req, res) => {
  try {
    const identificacion = req.params.identificacion;
    const sql = 'SELECT * FROM usuarios WHERE identificacion=$1';
    const result = await pool.query(sql, [identificacion]);

    if (result.rows.length > 0) {
      return res.status(200).json({ message: 'Usuario encontrado', usuario: result.rows[0] });
    } else {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al buscar el usuario' });
  }
};