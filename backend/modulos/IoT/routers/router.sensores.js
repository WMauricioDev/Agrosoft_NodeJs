import verificarToken from "../../usuarios/middlewares/verificarToken.js";
import { Router } from "express";
import { postSensores, getSensores, IdSensor, actualizarSensor } from "../controller/controller.sensores.js";
const RouterSensor = Router();

/**
 * @swagger
 * tags:
 *   name: Sensor
 *   description: Endpoints para gestionar los sensores
 */

/**
 * @swagger
 * /sensor:
 *   post:
 *     summary: Registrar un nuevo sensor
 *     tags: [Sensor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Sensor de temperatura"
 *               tipo_sensor:
 *                 type: integer
 *                 example: 1
 *               unidad_medida:
 *                 type: string
 *                 example: "Celsius"
 *               medida_min:
 *                 type: integer
 *                 example: -10
 *               medida_max:
 *                 type: integer
 *                 example: 50
 *     responses:
 *       201:
 *         description: Sensor registrado correctamente
 */
RouterSensor.post("/sensor", verificarToken, postSensores);

/**
 * @swagger
 * /sensor:
 *   get:
 *     summary: Obtener la lista de sensores
 *     tags: [Sensor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de sensores obtenida correctamente
 */
RouterSensor.get("/sensor", verificarToken, getSensores);

/**
 * @swagger
 * /sensor/{id}:
 *   get:
 *     summary: Obtener un sensor por ID
 *     tags: [Sensor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del sensor a obtener
 *     responses:
 *       200:
 *         description: Sensor obtenido correctamente
 */
RouterSensor.get("/sensor/:id", verificarToken, IdSensor);

/**
 * @swagger
 * /sensor/{id_sensor}:
 *   put:
 *     summary: Actualizar un sensor
 *     tags: [Sensor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_sensor
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
 *                 example: "Sensor de humedad"
 *               tipo_sensor:
 *                 type: integer
 *                 example: 2
 *               unidad_medida:
 *                 type: string
 *                 example: "%"
 *               medida_min:
 *                 type: integer
 *                 example: 0
 *               medida_max:
 *                 type: integer
 *                 example: 100
 *     responses:
 *       200:
 *         description: Sensor actualizado correctamente
 */
RouterSensor.put("/sensor/:id_sensor", verificarToken, actualizarSensor);

export default RouterSensor;
