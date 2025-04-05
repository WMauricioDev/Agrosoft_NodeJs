import verificarToken from "../../usuarios/middlewares/verificarToken.js";
import { Router } from "express";
import { postSensorBancal, getSensorBancal, IdSensorBancal, actualizarSensorBancal } from "../controller/controller.sensor_bancal.js"; 
const RouterSensorBancal = Router();

/**
 * @swagger
 * tags:
 *   name: SensorBancal
 *   description: Endpoints para gestionar la relación entre sensores y bancales
 */

/**
 * @swagger
 * /sensorbancal:
 *   post:
 *     summary: Registrar un nuevo sensor en un bancal
 *     tags: [SensorBancal]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fk_sensor:
 *                 type: integer
 *                 example: 1
 *               fk_bancal:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Sensor registrado correctamente en el bancal
 */
RouterSensorBancal.post("/sensorbancal", verificarToken, postSensorBancal);

/**
 * @swagger
 * /sensorbancal:
 *   get:
 *     summary: Obtener la lista de sensores y sus bancales asociados
 *     tags: [SensorBancal]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de sensores y bancales obtenida correctamente
 */
RouterSensorBancal.get("/sensorbancal", verificarToken, getSensorBancal);

/**
 * @swagger
 * /sensorbancal/{id}:
 *   get:
 *     summary: Obtener la relación de un sensor con un bancal por ID
 *     tags: [SensorBancal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la relación sensor-bancal a obtener
 *     responses:
 *       200:
 *         description: Relación obtenida correctamente
 */
RouterSensorBancal.get("/sensorbancal/:id", verificarToken, IdSensorBancal);

/**
 * @swagger
 * /sensorbancal/{id}:
 *   put:
 *     summary: Actualizar la relación de un sensor con un bancal
 *     tags: [SensorBancal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la relación a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fk_sensor:
 *                 type: integer
 *                 example: 3
 *               fk_bancal:
 *                 type: integer
 *                 example: 4
 *     responses:
 *       200:
 *         description: Relación actualizada correctamente
 */
RouterSensorBancal.put("/sensorbancal/:id", verificarToken, actualizarSensorBancal);

export default RouterSensorBancal;
