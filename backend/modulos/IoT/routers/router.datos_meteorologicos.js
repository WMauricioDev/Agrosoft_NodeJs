import verificarToken from "../../usuarios/middlewares/verificarToken.js";
import { Router } from "express";
import { postDatoMeteorologico, getDatosMeteorologicos, IdDatoMeteorologico, actualizarDatoMeteorologico } from "../controller/controller.datos_meteorologicos.js";

const RouterDatosMeteorologicos = Router();

/**
 * @swagger
 * tags:
 *   name: Datos Meteorologicos
 *   description: Endpoints para gestionar datos meteorológicos
 */

/**
 * @swagger
 * /datosmeteorologicos:
 *   post:
 *     summary: Registrar un nuevo dato meteorológico
 *     tags: [Datos Meteorologicos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha_hora:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-02-22T14:00:00Z"
 *               tipo_dato:
 *                 type: string
 *                 example: "temperatura"
 *               valor:
 *                 type: number
 *                 example: 25.5
 *               fk_sensor_bancal:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Dato meteorológico registrado correctamente
 */
RouterDatosMeteorologicos.post("/datosmeteorologicos", verificarToken, postDatoMeteorologico);

/**
 * @swagger
 * /datosmeteorologicos:
 *   get:
 *     summary: Obtener la lista de datos meteorológicos
 *     tags: [Datos Meteorologicos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de datos meteorológicos obtenida correctamente
 */
RouterDatosMeteorologicos.get("/datosmeteorologicos", verificarToken, getDatosMeteorologicos);

/**
 * @swagger
 * /datosmeteorologicos/{id_dato_meteorologico}:
 *   get:
 *     summary: Obtener un dato meteorológico por ID
 *     tags: [Datos Meteorologicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_dato_meteorologico
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del dato meteorológico a obtener
 *     responses:
 *       200:
 *         description: Dato meteorológico obtenido correctamente
 */
RouterDatosMeteorologicos.get("/datosmeteorologicos/:id_dato_meteorologico", verificarToken, IdDatoMeteorologico);

/**
 * @swagger
 * /datosmeteorologicos/{id_dato_meteorologico}:
 *   put:
 *     summary: Actualizar un dato meteorológico
 *     tags: [Datos Meteorologicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_dato_meteorologico
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del dato meteorológico a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha_hora:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-02-22T15:30:00Z"
 *               tipo_dato:
 *                 type: string
 *                 example: "humedad"
 *               valor:
 *                 type: number
 *                 example: 60.2
 *               fk_sensor_bancal:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Dato meteorológico actualizado correctamente
 */
RouterDatosMeteorologicos.put("/datosmeteorologicos/:id_dato_meteorologico", verificarToken, actualizarDatoMeteorologico);

export default RouterDatosMeteorologicos;
