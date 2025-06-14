import { Router } from 'express';
import verificarToken from '../../usuarios/middlewares/verificarToken.js';
import { registrarTipoSensor, listarTiposSensor, actualizarTipoSensor, eliminarTipoSensor, obtenerTipoSensor } from '../controller/tipoSensorController.js';

const rutaTipoSensor = Router();

/**
 * @swagger
 * tags:
 *   name: Tipos de Sensores
 *   description: Endpoints para gestionar tipos de sensores IoT
 */

/**
 * @swagger
 * /tiposensor:
 *   post:
 *     summary: Registrar un nuevo tipo de sensor
 *     tags: [Tipos de Sensores]
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
 *                 example: "Temperatura"
 *               unidad_medida:
 *                 type: string
 *                 example: "°C"
 *               medida_minima:
 *                 type: number
 *                 example: -10
 *               medida_maxima:
 *                 type: number
 *                 example: 50
 *               descripcion:
 *                 type: string
 *                 example: "Sensor para medir temperatura ambiente"
 *     responses:
 *       201:
 *         description: Tipo de sensor registrado correctamente
 */
rutaTipoSensor.post('/tiposensor', verificarToken, registrarTipoSensor);

/**
 * @swagger
 * /tiposensor:
 *   get:
 *     summary: Obtener todos los tipos de sensores
 *     tags: [Tipos de Sensores]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tipos de sensores obtenida con éxito
 */
rutaTipoSensor.get('/tiposensor', verificarToken, listarTiposSensor);

/**
 * @swagger
 * /tiposensor/{id}:
 *   get:
 *     summary: Obtener un tipo de sensor por ID
 *     tags: [Tipos de Sensores]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tipo de sensor
 *     responses:
 *       200:
 *         description: Tipo de sensor obtenido con éxito
 */
rutaTipoSensor.get('/tiposensor/:id', verificarToken, obtenerTipoSensor);

/**
 * @swagger
 * /tiposensor/{id}:
 *   put:
 *     summary: Actualizar un tipo de sensor por ID
 *     tags: [Tipos de Sensores]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tipo de sensor a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Temperatura Modificado"
 *               unidad_medida:
 *                 type: string
 *                 example: "°C"
 *               medida_minima:
 *                 type: number
 *                 example: -10
 *               medida_maxima:
 *                 type: number
 *                 example: 50
 *               descripcion:
 *                 type: string
 *                 example: "Sensor para medir temperatura ambiente actualizado"
 *     responses:
 *       200:
 *         description: Tipo de sensor actualizado correctamente
 */
rutaTipoSensor.put('/tiposensor/:id', verificarToken, actualizarTipoSensor);

/**
 * @swagger
 * /tiposensor/{id}:
 *   delete:
 *     summary: Eliminar un tipo de sensor por ID
 *     tags: [Tipos de Sensores]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tipo de sensor a eliminar
 *     responses:
 *       200:
 *         description: Tipo de sensor eliminado correctamente
 */
rutaTipoSensor.delete('/tiposensor/:id', verificarToken, eliminarTipoSensor);

export default rutaTipoSensor;