import jwt from 'jsonwebtoken';
import pool from '../database/Conexion.js';

const secretKey = 'estoesmuysecreto';

const verificarToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.userId = decoded.id;

    const query = `
      SELECT r.nombre_rol
      FROM usuario_rol ur
      JOIN roles r ON ur.fk_rol = r.id
      WHERE ur.fk_usuario = $1
    `;
    const result = await pool.query(query, [req.userId]);

    const isSuperuser = result.rows.some(row => row.nombre_rol === 'superuser');
    if (!isSuperuser) {
      return res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

export default verificarToken;