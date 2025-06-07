import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pool from '../database/Conexion.js';

const secretKey = 'estoesmuysecreto';
const tokenExpiry = '12h';

const CrearToken = async (req, res) => {
  const { numero_documento, password } = req.body;

  if (!numero_documento || !password) {
    return res.status(400).json({ message: 'Número de documento y contraseña son obligatorios' });
  }

  try {
    const sql = `
      SELECT id, numero_documento, nombre, apellido, email, password 
      FROM usuarios_usuarios 
      WHERE numero_documento = $1
    `;
    const { rows } = await pool.query(sql, [numero_documento]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const user = rows[0];

    const passwordValida = await bcrypt.compare(password, user.password);
    if (!passwordValida) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        numero_documento: user.numero_documento,
        nombre: user.nombre,
      },
      secretKey,
      { expiresIn: tokenExpiry }
    );

    return res.status(200).json({ message: 'Autenticación exitosa', user, token });
  } catch (error) {
    console.error('Error en la autenticación:', error);
    return res.status(500).json({ message: 'Error en el sistema' });
  }
};

export default CrearToken;
