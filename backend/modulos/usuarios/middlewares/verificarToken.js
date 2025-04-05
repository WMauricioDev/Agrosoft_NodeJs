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
    console.log('Token decodificado:', decoded); // 👈 verifica qué trae
  
    req.userId = decoded.id;
  
    const query = `
      SELECT rol_id FROM usuarios_usuarios WHERE id = $1
    `;
    const result = await pool.query(query, [req.userId]);
  
    console.log('Resultado SQL:', result.rows); // 👈 verifica si llega bien
  
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
  
  
    const { rol_id } = result.rows[0];

    if (parseInt(rol_id) !== 4) {
      return res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
    }
      
    next();
  } catch (error) {
    console.error('Error al verificar token:', error);
    return res.status(401).json({ message: 'Token inválido' });
  }
  };

export default verificarToken;
