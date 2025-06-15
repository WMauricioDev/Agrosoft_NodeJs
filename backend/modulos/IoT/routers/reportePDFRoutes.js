import { Router } from 'express';
import verificarToken from '../../usuarios/middlewares/verificarToken.js';
import {
  generarReporteMeteorologico,
  generarReportePDFMeteorologico,
} from '../controller/reportePDFController.js';

const rutaReportes = Router();

/**
 * @swagger
 * tags:
 *   name: Reportes
 *   description: Endpoints para generar reportes meteorológicos
 */

/**
 * @swagger
 * /reportes/meteorologico:
 *   get:
 *     summary: Generar un reporte de datos meteorológicos
 *     tags: [Reportes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fecha_inicio
 *         schema:
 *           type: string
 *         description: Fecha de inicio (YYYY-MM-DD)
 *       - in: query
 *         name: fecha_fin
 *         schema:
 *           type: string
 *         description: Fecha de fin (YYYY-MM-DD)
 *       - in: query
 *         name: fk_bancal_id
 *         schema:
 *           type: integer
 *         description: ID del bancal
 *     responses:
 *       200:
 *         description: Reporte generado con éxito
 */
rutaReportes.get('/reportes/meteorologico', verificarToken, generarReporteMeteorologico);

/**
 * @swagger
 * /reportes/meteorologico/pdf:
 *   get:
 *     summary: Generar un reporte PDF de datos meteorológicos
 *     tags: [Reportes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fecha_inicio
 *         schema:
 *           type: string
 *         description: Fecha de inicio (YYYY-MM-DD)
 *       - in: query
 *         name: fecha_fin
 *         schema:
 *           type: string
 *         description: Fecha de fin (YYYY-MM-DD)
 *       - in: query
 *         name: fk_bancal_id
 *         schema:
 *           type: integer
 *         description: ID del bancal
 *     responses:
 *       200:
 *         description: Reporte PDF generado con éxito
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */
rutaReportes.get('/reportes/meteorologico/pdf', verificarToken, generarReportePDFMeteorologico);

export default rutaReportes;