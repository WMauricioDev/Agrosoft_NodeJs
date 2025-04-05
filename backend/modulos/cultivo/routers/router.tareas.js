import { Router } from "express";
import verificarToken from "../../usuarios/middlewares/verificarToken.js";
import { 
    postTareas, 
    getTareas, 
    getIdTareas, 
    updateTareas, 
    deleteTareas 
} from "../controller/controller.tareas.js";

const RouterTareas = Router();

/**
 * @swagger
 * tags:
 *   name: Tareas
 *   description: Gestión de tareas del sistema
 */

/**
 * @swagger
 * /tareas:
 *   post:
 *     summary: Crea una nueva tarea
 *     tags: [Tareas]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 description: Título de la tarea
 *               descripcion:
 *                 type: string
 *                 description: Descripción de la tarea
 *               fecha_inicio:
 *                 type: string
 *                 format: date
 *                 description: Fecha de inicio de la tarea
 *               fecha_limite:
 *                 type: string
 *                 format: date
 *                 description: Fecha límite de la tarea
 *               estado:
 *                 type: string
 *                 enum: [pendiente, en_progreso, completada]
 *                 description: Estado de la tarea
 *               nombre:
 *                 type: string
 *                 description: Nombre de la tarea
 *               fk_usuario:
 *                 type: integer
 *                 description: ID del usuario asignado
 *               fk_cultivo:
 *                 type: integer
 *                 description: ID del cultivo relacionado
 *     responses:
 *       201:
 *         description: Tarea creada con éxito
 *       400:
 *         description: Error en la solicitud
 */
RouterTareas.post("/tareas", verificarToken, postTareas);

/**
 * @swagger
 * /tareas:
 *   get:
 *     summary: Obtiene todas las tareas registradas
 *     tags: [Tareas]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tareas obtenida con éxito
 *       401:
 *         description: No autorizado
 */
RouterTareas.get("/tareas", verificarToken, getTareas);

/**
 * @swagger
 * /tareas/{id}:
 *   get:
 *     summary: Obtiene una tarea por ID
 *     tags: [Tareas]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tarea a buscar
 *     responses:
 *       200:
 *         description: Tarea encontrada con éxito
 *       404:
 *         description: Tarea no encontrada
 */
RouterTareas.get("/tareas/:id", verificarToken, getIdTareas);

/**
 * @swagger
 * /tareas/{id}:
 *   put:
 *     summary: Actualiza una tarea por ID
 *     tags: [Tareas]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tarea a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 description: Nuevo título de la tarea
 *               descripcion:
 *                 type: string
 *                 description: Nueva descripción de la tarea
 *               fecha_inicio:
 *                 type: string
 *                 format: date
 *                 description: Nueva fecha de inicio
 *               fecha_limite:
 *                 type: string
 *                 format: date
 *                 description: Nueva fecha límite
 *               estado:
 *                 type: string
 *                 enum: [pendiente, en_progreso, completada]
 *                 description: Estado actualizado de la tarea
 *               nombre:
 *                 type: string
 *                 description: Nuevo nombre de la tarea
 *               fk_usuario:
 *                 type: integer
 *                 description: Nuevo ID del usuario asignado
 *               fk_cultivo:
 *                 type: integer
 *                 description: Nuevo ID del cultivo relacionado
 *     responses:
 *       200:
 *         description: Tarea actualizada con éxito
 *       400:
 *         description: Error en la solicitud
 *       404:
 *         description: Tarea no encontrada
 */
RouterTareas.put("/tareas/:id", verificarToken, updateTareas);

/**
 * @swagger
 * /tareas/{id}:
 *   delete:
 *     summary: Elimina una tarea por ID
 *     tags: [Tareas]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tarea a eliminar
 *     responses:
 *       200:
 *         description: Tarea eliminada con éxito
 *       404:
 *         description: Tarea no encontrada
 */
RouterTareas.delete("/tareas/:id", verificarToken, deleteTareas);

export default RouterTareas;
