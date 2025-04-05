import verificarToken from "../../usuarios/middlewares/verificarToken.js";
import { Router } from "express";
import { postConfiguracion, getConfiguracion, IdConfiguracion, actualizarConfiguracion } from "../controller/controller.configuracion.js";

const RouterConfiguracion = Router();

/**
 * @swagger
 * tags:
 *   name: Configuracion
 *   description: API para gestionar configuraciones de sensores
 */

/**
 * @swagger
 * /configuracion:
 *   post:
 *     summary: Registra una nueva configuración
 *     tags: [Configuracion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               parametros:
 *                 type: string
 *               fk_sensores:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Configuración registrada correctamente
 *       500:
 *         description: Error en el servidor
 */
RouterConfiguracion.post('/configuracion', verificarToken, postConfiguracion);

/**
 * @swagger
 * /configuracion:
 *   get:
 *     summary: Obtiene todas las configuraciones
 *     tags: [Configuracion]
 *     responses:
 *       200:
 *         description: Lista de configuraciones obtenida correctamente
 *       404:
 *         description: No hay configuraciones registradas
 */
RouterConfiguracion.get('/configuracion', verificarToken, getConfiguracion);

/**
 * @swagger
 * /configuracion/{id}:
 *   get:
 *     summary: Obtiene una configuración por su ID
 *     tags: [Configuracion]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la configuración
 *     responses:
 *       200:
 *         description: Configuración encontrada correctamente
 *       404:
 *         description: Configuración no encontrada
 */
RouterConfiguracion.get('/configuracion/:id', verificarToken, IdConfiguracion);

/**
 * @swagger
 * /configuracion/{id}:
 *   put:
 *     summary: Actualiza una configuración por su ID
 *     tags: [Configuracion]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la configuración
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               parametros:
 *                 type: string
 *               fk_sensores:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Configuración actualizada correctamente
 *       404:
 *         description: No se pudo actualizar la configuración
 */
RouterConfiguracion.put('/configuracion/:id', verificarToken, actualizarConfiguracion);

export default RouterConfiguracion;
