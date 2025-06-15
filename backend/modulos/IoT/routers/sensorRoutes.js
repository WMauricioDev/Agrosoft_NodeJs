import { Router } from 'express';
import verificarToken from '../../usuarios/middlewares/verificarToken.js';
import {
  registrarSensor,
  listarSensores,
  eliminarSensor,
  actualizarSensor,
  obtenerSensor,
} from '../controller/sensorController.js';

const rutaSensores = Router();

/**
 * @swagger
 * tags:
 *   name: Sensores
 *   description: Endpoints para gestionar sensores IoT
 */

/**
 * @swagger
 * /sensores:
 *   post:
 *     summary: Registrar un nuevo sensor
 *     tags: [Sensores]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Sensor Temp 1"
 *               tipo_sensor_id:
 *                 type: integer
 *                 example: 1
 *               descripcion:
 *                 type: string
 *                 example: "Sensor de temperatura"
 *               bancal_id:
 *                 type: integer
 *                 example: 1
 *               medida_minima:
 *                 type: number
 *                 example: 0
 *               medida_maxima:
 *                 type: number
 *                 example: 50
 *               estado:
 *                 type: string
 *                 example: "activo"
 *               device_code:
 *                 type: string
 *                 example: "SENSOR123"
 *     responses:
 *       201:
 *         description: Sensor registrado con éxito
 */
rutaSensores.post('/sensores', verificarToken, registrarSensor);

/**
 * @swagger
 * /sensores:
 *   get:
 *     summary: Obtener todos los sensores
 *     tags: [Sensores]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de sensores obtenida con éxito
 */
rutaSensores.get('/sensores', verificarToken, listarSensores);

/**
 * @swagger
 * /sensores/{id}:
 *   get:
 *     summary: Obtener un sensor por ID
 *     tags: [Sensores]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del sensor
 *     responses:
 *       200:
 *         description: Sensor obtenido con éxito
 */
rutaSensores.get('/sensores/:id', verificarToken, obtenerSensor);

/**
 * @swagger
 * /sensores/{id}:
 *   put:
 *     summary: Actualizar un sensor
 *     tags: [Sensores]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del sensor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Sensor Temp Actualizado"
 *               tipo_sensor_id:
 *                 type: integer
 *                 example: 1
 *               descripcion:
 *                 type: string
 *                 example: "Sensor actualizado"
 *               bancal_id:
 *                 type: integer
 *                 example: 1
 *               medida_minima:
 *                 type: number
 *                 example: 0
 *               medida_maxima:
 *                 type: number
 *                 example: 50
 *               estado:
 *                 type: string
 *                 example: "activo"
 *               device_code:
 *                 type: string
 *                 example: "SENSOR123"
 *     responses:
 *       200:
 *         description: Sensor actualizado con éxito
 */
rutaSensores.put('/sensores/:id', verificarToken, actualizarSensor);

/**
 * @swagger
 * /sensores/{id}:
 *   delete:
 *     summary: Eliminar un sensor
 *     tags: [Sensores]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del sensor
 *     responses:
 *       200:
 *         description: Sensor eliminado con éxito
 */
rutaSensores.delete('/sensores/:id', verificarToken, eliminarSensor);

export default rutaSensores;