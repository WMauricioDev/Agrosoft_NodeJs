import express from 'express';
import { obtenerUsuariosPorRol } from '../controllers/graficas.User.controller.js';

const router = express.Router();

router.get('/usuarios_rol', obtenerUsuariosPorRol);

export default router;
