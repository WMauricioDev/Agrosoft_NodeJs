import { Router } from "express";
import verificarToken from "../../usuarios/middlewares/verificarToken.js";
import { postActividades, getActividades, getIdActividades, updateActividades, deleteActividades } from "../controller/controller.actividades.js";

const RouterActividades = Router();

/**
 * @swagger
 * tags:
 *   name: Actividades
 *   description: Endpoints para la gestión de actividades
 */

/**
 * @swagger
 * /api/cultivo/actividades:
 *   post:
 *     summary: Crea una nueva actividad
 *     tags: [Actividades]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descripcion:
 *                 type: string
 *               fecha_inicio:
 *                 type: string
 *                 format: date-time
 *               fecha_fin:
 *                 type: string
 *                 format: date-time
 *               tipo_actividad:
 *                 type: integer
 *               usuario:
 *                 type: integer
 *               cultivo:
 *                 type: integer
 *               insumo:
 *                 type: integer
 *               cantidadUsada:
 *                 type: number
 *               estado:
 *                 type: string
 *                 enum: [PENDIENTE, EN_PROCESO, COMPLETADA, CANCELADA]
 *               prioridad:
 *                 type: string
 *                 enum: [ALTA, MEDIA, BAJA]
 *               instrucciones_adicionales:
 *                 type: string
 *     responses:
 *       201:
 *         description: Actividad creada correctamente
 *       400:
 *         description: Error en la solicitud
 */
RouterActividades.post("/actividades", verificarToken, postActividades);

/**
 * @swagger
 * /api/cultivo/actividades:
 *   get:
 *     summary: Obtiene todas las actividades
 *     tags: [Actividades]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de actividades
 *       404:
 *         description: No hay registros de actividades
 */
RouterActividades.get("/actividades", verificarToken, getActividades);

/**
 * @swagger
 * /api/cultivo/actividades/{id}:
 *   get:
 *     summary: Obtiene una actividad por ID
 *     tags: [Actividades]
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
 *         description: Datos de la actividad
 *       404:
 *         description: Actividad no encontrada
 */
RouterActividades.get("/actividades/:id", verificarToken, getIdActividades);

/**
 * @swagger
 * /api/cultivo/actividades/{id}:
 *   put:
 *     summary: Actualiza una actividad por ID
 *     tags: [Actividades]
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
 *               descripcion:
 *                 type: string
 *               fecha_inicio:
 *                 type: string
 *                 format: date-time
 *               fecha_fin:
 *                 type: string
 *                 format: date-time
 *               tipo_actividad:
 *                 type: integer
 *               usuario:
 *                 type: integer
 *               cultivo:
 *                 type: integer
 *               insumo:
 *                 type: integer
 *               cantidadUsada:
 *                 type: number
 *               estado:
 *                 type: string
 *                 enum: [PENDIENTE, EN_PROCESO, COMPLETADA, CANCELADA]
 *               prioridad:
 *                 type: string
 *                 enum: [ALTA, MEDIA, BAJA]
 *               instrucciones_adicionales:
 *                 type: string
 *     responses:
 *       200:
 *         description: Actividad actualizada exitosamente
 *       404:
 *         description: No se pudo actualizar la actividad
 */
RouterActividades.put("/actividades/:id", verificarToken, updateActividades);

/**
 * @swagger
 * /api/cultivo/actividades/{id}:
 *   delete:
 *     summary: Elimina una actividad por ID
 *     tags: [Actividades]
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
 *         description: Actividad eliminada correctamente
 *       404:
 *         description: No se pudo eliminar la actividad
 */
RouterActividades.delete("/actividades/:id", verificarToken, deleteActividades);

export default RouterActividades;