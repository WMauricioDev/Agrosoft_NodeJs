import express from 'express';
import { generarReporteInsumos } from '../controllers/reporteInsumo.js';

const router = express.Router();

router.post('/insumos/:formato', generarReporteInsumos);

export default router;