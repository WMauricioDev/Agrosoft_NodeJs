import { Router } from 'express';
import verificarToken from '../../usuarios/middlewares/verificarToken.js';
import { generarReporteInsumosPDF } from '../controller/controllerReporteInsumo.js';

const RouterInsumosPDF = Router();

RouterInsumosPDF.get('/Insumo/reporte_pdf/', verificarToken, generarReporteInsumosPDF);

export default RouterInsumosPDF;