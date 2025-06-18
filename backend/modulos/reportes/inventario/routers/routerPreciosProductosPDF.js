import { Router } from 'express';
import verificarToken from '../../../usuarios/middlewares/verificarToken.js';
import { generarReportePreciosProductosPDF } from '../controller/controllerReportePrecioProducto.js';

const RouterPreciosProductosPDF = Router();

RouterPreciosProductosPDF.get('/precios_productos/reporte_pdf/', verificarToken, generarReportePreciosProductosPDF);

export default RouterPreciosProductosPDF;