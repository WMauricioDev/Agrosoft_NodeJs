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
 * /actividades:
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
 *               fk_cultivo:
 *                 type: integer
 *               fk_usuario:
 *                 type: integer
 *               fk_insumo:
 *                 type: integer
 *               fk_programacion:
 *                 type: integer
 *               fk_tipo_actividad:
 *                 type: integer
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               fecha:
 *                 type: string
 *                 format: date
 *               cantidad_producto:
 *                 type: number
 *     responses:
 *       201:
 *         description: Actividad creada correctamente
 *       400:
 *         description: Error en la solicitud
 */
RouterActividades.post("/actividades", verificarToken, postActividades);

/**
 * @swagger
 * /actividades:
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
 * /actividades/{id}:
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
 * /actividades/{id}:
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
 *               fk_cultivo:
 *                 type: integer
 *               fk_usuario:
 *                 type: integer
 *               fk_insumo:
 *                 type: integer
 *               fk_programacion:
 *                 type: integer
 *               fk_tipo_actividad:
 *                 type: integer
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               fecha:
 *                 type: string
 *                 format: date
 *               cantidad_producto:
 *                 type: number
 *     responses:
 *       200:
 *         description: Actividad actualizada exitosamente
 *       404:
 *         description: No se pudo actualizar la actividad
 */
RouterActividades.put("/actividades/:id", verificarToken, updateActividades);

/**
 * @swagger
 * /actividades/{id}:
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
