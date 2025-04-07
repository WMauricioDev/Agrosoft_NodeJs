import express from 'express';
import { generarReporteIngresosTotales } from '../controllers/reporteIngresosController.js';

const router = express.Router();

router.post('/ingresos/:formato', generarReporteIngresosTotales);

export default router;