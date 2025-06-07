import jwt from 'jsonwebtoken';
const secretKey = 'estoesmuysecreto';

const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.userId = decoded.id; // Puedes usar esto en tus controladores si lo necesitas
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

export default verificarToken;
