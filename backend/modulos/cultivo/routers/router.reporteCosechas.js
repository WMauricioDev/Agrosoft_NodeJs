import { Router } from "express";
import verificarToken from "../../usuarios/middlewares/verificarToken.js";
import { generarReporteCosechas } from "../controller/reporteCosechas.js";

const RouterReporteCosechas = Router();

/**
 * @swagger
 * tags:
 *   name: Reporte Cosechas
 *   description: Endpoints para la generación de reportes de cosechas
 */

/**
 * @swagger
 * /api/cultivo/reporteCosechas/pdf:
 *   post:
 *     summary: Genera un reporte PDF de cosechas
 *     tags: [Reporte Cosechas]
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
 *       500:
 *         description: Error en el servidor
 */
RouterReporteCosechas.post("/reporteCosechas/pdf", verificarToken, generarReporteCosechas);

export default RouterReporteCosechas;