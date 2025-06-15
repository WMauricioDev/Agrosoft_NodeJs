import { Router } from 'express';
import verificarToken from '../../usuarios/middlewares/verificarToken.js';
import { registrarSensor, listarSensores, actualizarSensor, eliminarSensor, obtenerSensor } from '../controller/sensorController.js';

const rutaSensor = Router();

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
 *                 example: "Sensor de temperatura para bancal 1"
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
 *                 example: "TEMP001"
 *     responses:
 *       201:
 *         description: Sensor registrado correctamente
 */
rutaSensor.post('/sensores', verificarToken, registrarSensor);

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
rutaSensor.get('/sensores', verificarToken, listarSensores);

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
rutaSensor.get('/sensores/:id', verificarToken, obtenerSensor);

/**
 * @swagger
 * /sensores/{id}:
 *   put:
 *     summary: Actualizar un sensor por ID
 *     tags: [Sensores]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del sensor a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Sensor Temp 1 Modificado"
 *               tipo_sensor_id:
 *                 type: integer
 *                 example: 1
 *               descripcion:
 *                 type: string
 *                 example: "Sensor de temperatura modificado"
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
 *                 example: "TEMP001"
 *     responses:
 *       200:
 *         description: Sensor actualizado correctamente
 */
rutaSensor.put('/sensores/:id', verificarToken, actualizarSensor);

/**
 * @swagger
 * /sensores/{id}:
 *   delete:
 *     summary: Eliminar un sensor por ID
 *     tags: [Sensores]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del sensor a eliminar
 *     responses:
 *       200:
 *         description: Sensor eliminado correctamente
 */
rutaSensor.delete('/sensores/:id', verificarToken, eliminarSensor);

export default rutaSensor;