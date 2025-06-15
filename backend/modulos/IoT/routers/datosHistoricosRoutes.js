import { Router } from 'express';
import verificarToken from '../../usuarios/middlewares/verificarToken.js';
import {
  registrarDatosHistoricos,
  listarDatosHistoricos,
} from '../controller/datosHistoricosController.js';

const rutaDatosHistoricos = Router();

/**
 * @swagger
 * tags:
 *   name: Datos Históricos
 *   description: Endpoints para gestionar datos históricos meteorológicos
 */

/**
 * @swagger
 * /datoshistoricos:
 *   post:
 *     summary: Registrar datos históricos
 *     tags: [Datos Históricos]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               device_code:
 *                 type: string
 *                 example: "SENSOR123"
 *               fk_bancal_id:
 *                 type: integer
 *                 example: 1
 *               temperatura:
 *                 type: number
 *                 example: 25.5
 *               humedad_ambiente:
 *                 type: number
 *                 example: 60
 *               luminosidad:
 *                 type: number
 *                 example: 1000
 *               lluvia:
 *                 type: number
 *                 example: 0
 *               velocidad_viento:
 *                 type: number
 *                 example: 5
 *               direccion_viento:
 *                 type: number
 *                 example: 180
 *               humedad_suelo:
 *                 type: number
 *                 example: 50
 *               ph_suelo:
 *                 type: number
 *                 example: 6.5
 *               fecha_promedio:
 *                 type: string
 *                 example: "2025-06-01T00:00:00Z"
 *               cantidad_mediciones:
 *                 type: integer
 *                 example: 24
 *     responses:
 *       201:
 *         description: Datos históricos registrados correctamente
 */
rutaDatosHistoricos.post('/datoshistoricos', verificarToken, registrarDatosHistoricos);

/**
 * @swagger
 * /datoshistoricos:
 *   get:
 *     summary: Obtener datos históricos
 *     tags: [Datos Históricos]
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
 *         description: Lista de datos históricos obtenida con éxito
 */
rutaDatosHistoricos.get('/datoshistoricos', verificarToken, listarDatosHistoricos);

export default rutaDatosHistoricos;