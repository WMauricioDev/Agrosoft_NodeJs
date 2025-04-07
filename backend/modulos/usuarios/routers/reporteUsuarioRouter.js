import { Router } from 'express';
import {
    generarReporteUsuarios,
 
} from '../controllers/reporteUsuarios.js';

const router = Router();
router.get('/usuarios/reporte',generarReporteUsuarios)

export default router;