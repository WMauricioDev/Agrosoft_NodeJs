import { Router } from 'express';
import {
    generarReporteUsuarios,
 
} from '../controllers/reporteUsuarios.js';

const router = Router();
router.post('/usuarios/:formato',generarReporteUsuarios)

export default router;