import { Router } from 'express';
import verificarToken from "../../../usuarios/middlewares/verificarToken.js";
import { generarReporteInsumosPDF } from '../controller/controllerReporteInventario.js';

const RouterInsumosPDF = Router();

RouterInsumosPDF.get('/insumo/reporte_pdf/', verificarToken, generarReporteInsumosPDF);

export default RouterInsumosPDF;