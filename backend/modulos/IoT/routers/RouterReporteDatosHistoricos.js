import { Router } from "express";
import verificarToken from "../../usuarios/middlewares/verificarToken.js";
import { generarReporteDatosHistoricos } from "../controller/reporteDatosHistoricos.js";

const RouterReporteDatosHistoricos = Router();

/**
 * @swagger
 * tags:
 *   name: Reporte Datos Históricos
 *   description: Endpoints para la generación de reportes de datos históricos de sensores
 */

/**
 * @swagger
 * /api/iot/reporteDatosHistoricos/pdf:
 *   post:
 *     summary: Genera un reporte PDF de datos históricos de sensores
 *     tags: [Reporte Datos Históricos]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Reporte PDF generado correctamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: No autorizado
 *       404:
 *         description: No se encontraron datos históricos
 *       500:
 *         description: Error en el servidor
 */
RouterReporteDatosHistoricos.post("/sensores/pdf", verificarToken, generarReporteDatosHistoricos);

export default RouterReporteDatosHistoricos;