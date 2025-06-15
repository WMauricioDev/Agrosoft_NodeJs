import { Router } from 'express';
import verificarToken from '../../usuarios/middlewares/verificarToken.js';
import { registrarDatosMeteorologicos, listarDatosMeteorologicos, obtenerDatosMeteorologicos, generarReporteMeteorologico } from '../controller/datosMeteorologicosController.js';

const rutaDatosMeteorologicos = Router();

/**
 * @swagger
 * tags:
 *   name: Datos Meteorológicos
 *   description: Endpoints para gestionar datos meteorológicos IoT
 */

/**
 * @swagger
 * /datosmeteorologicos:
 *   post:
 *     summary: Registrar nuevos datos meteorológicos
 *     tags: [Datos Meteorológicos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fk_sensor_id:
 *                 type: integer
 *                 example: 1
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
 *               humedad_suelo:
 *                 type: number
 *                 example: 40
 *               lluvia:
 *                 type: number
 *                 example: 0
 *               ph_suelo:
 *                 type: number
 *                 example: 6.5
 *               direccion_viento:
 *                 type: number
 *                 example: 180
 *               velocidad_viento:
 *                 type: number
 *                 example: 5
 *               fecha_medicion:
 *                 type: string
 *                 example: "2025-06-13T20:54:00Z"
 *     responses:
 *       201:
 *         description: Datos meteorológicos registrados correctamente
 */
rutaDatosMeteorologicos.post('/datosmeteorologicos', registrarDatosMeteorologicos);

/**
 * @swagger
 * /datosmeteorologicos:
 *   get:
 *     summary: Obtener todos los datos meteorológicos
 *     tags: [Datos Meteorológicos]
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
 *         description: Lista de datos meteorológicos obtenida con éxito
 */
rutaDatosMeteorologicos.get('/datosmeteorologicos', verificarToken, listarDatosMeteorologicos);

/**
 * @swagger
 * /datosmeteorologicos/{id}:
 *   get:
 *     summary: Obtener un dato meteorológico por ID
 *     tags: [Datos Meteorológicos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del dato meteorológico
 *     responses:
 *       200:
 *         description: Dato meteorológico obtenido con éxito
 */
rutaDatosMeteorologicos.get('/datosmeteorologicos/:id', verificarToken, obtenerDatosMeteorologicos);

/**
 * @swagger
 * /datosmeteorologicos/reporte:
 *   get:
 *     summary: Generar un reporte de datos meteorológicos
 *     tags: [Datos Meteorológicos]
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
rutaDatosMeteorologicos.get('/datosmeteorologicos/reporte', verificarToken, generarReporteMeteorologico);

export default rutaDatosMeteorologicos;