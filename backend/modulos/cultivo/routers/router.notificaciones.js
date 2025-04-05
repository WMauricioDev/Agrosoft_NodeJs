import { Router } from "express";
import verificarToken from "../../usuarios/middlewares/verificarToken.js";
import { postNotificaciones, getNotificaciones, getIdNotificaciones, updateNotificaciones, deleteNotificaciones } from "../controller/controller.notificaciones.js";

const RouterNotificaciones = Router();

/**
 * @swagger
 * tags:
 *   name: Notificaciones
 *   description: Gestión de notificaciones del sistema
 */

/**
 * @swagger
 * /notificaciones:
 *   post:
 *     summary: Crea una nueva notificación
 *     tags: [Notificaciones]
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
 *               descripcion:
 *                 type: string
 *               fecha_hora:
 *                 type: string
 *                 format: date-time
 *               fk_actividad:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Notificación creada con éxito
 *       400:
 *         description: Error en la solicitud
 */
RouterNotificaciones.post("/notificaciones", verificarToken, postNotificaciones);

/**
 * @swagger
 * /notificaciones:
 *   get:
 *     summary: Obtiene todas las notificaciones
 *     tags: [Notificaciones]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de notificaciones
 *       401:
 *         description: No autorizado
 */
RouterNotificaciones.get("/notificaciones", verificarToken, getNotificaciones);

/**
 * @swagger
 * /notificaciones/{id}:
 *   get:
 *     summary: Obtiene una notificación por ID
 *     tags: [Notificaciones]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Datos de la notificación
 *       404:
 *         description: Notificación no encontrada
 */
RouterNotificaciones.get("/notificaciones/:id", verificarToken, getIdNotificaciones);

/**
 * @swagger
 * /notificaciones/{id}:
 *   put:
 *     summary: Actualiza una notificación por ID
 *     tags: [Notificaciones]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               fecha_hora:
 *                 type: string
 *                 format: date-time
 *               fk_actividad:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Notificación actualizada correctamente
 *       400:
 *         description: Error en la solicitud
 */
RouterNotificaciones.put("/notificaciones/:id", verificarToken, updateNotificaciones);

/**
 * @swagger
 * /notificaciones/{id}:
 *   delete:
 *     summary: Elimina una notificación por ID
 *     tags: [Notificaciones]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notificación eliminada correctamente
 *       404:
 *         description: No se pudo eliminar la notificación
 */
RouterNotificaciones.delete("/notificaciones/:id", verificarToken, deleteNotificaciones);

export default RouterNotificaciones;
