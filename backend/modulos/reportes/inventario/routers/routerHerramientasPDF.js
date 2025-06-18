import { Router } from 'express';
import verificarToken from '../../../usuarios/middlewares/verificarToken.js';
import { generarReporteHerramientasPDF } from '../controller/controllerReporteHerramienta.js';

const RouterHerramientasPDF = Router();

RouterHerramientasPDF.get('/herramientas/reporte_pdf/', verificarToken, generarReporteHerramientasPDF);

export default RouterHerramientasPDF;