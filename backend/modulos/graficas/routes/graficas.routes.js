import express from 'express';
import { obtenerUsuariosPorRol } from '../controllers/graficas.User.controller.js';
import { obtenerInsumosProximosAVencer } from '../controllers/graficas.Insumos.Controller.js';
import { obtenerHerramientasPorNombre } from '../controllers/graficas.Herramientas.Controller.js';

const router = express.Router();

router.get('/usuarios_rol', obtenerUsuariosPorRol);
router.get('/insumosc', obtenerInsumosProximosAVencer);
router.get('/herramientas', obtenerHerramientasPorNombre);


export default router;
