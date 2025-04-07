import express from 'express';
import { obtenerUsuariosPorRol } from '../controllers/graficas.User.controller.js';
import { obtenerCosechasPorCultivo } from '../controllers/graficas.Cosechas.controller.js';

const router = express.Router();

router.get('/usuarios_rol', obtenerUsuariosPorRol);
router.get('/cosechas_por_cultivo', obtenerCosechasPorCultivo);

export default router;

