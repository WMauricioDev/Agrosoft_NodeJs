import express from 'express';
import { obtenerUsuariosPorRol } from '../controllers/graficas.User.controller.js';
import { obtenerCosechasPorCultivo } from '../controllers/graficas.Cosechas.controller.js';
import { obtenerInsumosProximosAVencer } from '../controllers/graficas.Insumos.Controller.js';
import { obtenerHerramientasPorNombre } from '../controllers/graficas.Herramientas.Controller.js';
import { obtenerDatosGraficaIngresos } from '../controllers/grafica.Ingresos.Controller.js';

const router = express.Router();

router.get('/usuarios_rol', obtenerUsuariosPorRol);
router.get('/cosechas_por_cultivo', obtenerCosechasPorCultivo);
router.get('/insumosc', obtenerInsumosProximosAVencer);
router.get('/herramientas', obtenerHerramientasPorNombre);
router.get('/ingresos', obtenerDatosGraficaIngresos);


export default router;

