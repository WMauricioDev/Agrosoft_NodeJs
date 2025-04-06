import { Router } from "express";
import verificarToken from "../../usuarios/middlewares/verificarToken.js";
import { 
    postTipo_actividad, 
    getTipo_actividad, 
    getIdTipo_actividad, 
    updateTipo_actividad, 
    deleteTipo_actividad 
} from "../controller/controller.tipo_actividad.js";

const RouterTipo_actividad = Router();

/**
 * @swagger
 * tags:
 *   name: Tipo de Actividad
 *   description: Gestión de los tipos de actividades
 */

/**
 * @swagger
 * /api/cultivo/tipo_actividad:
 *   post:
 *     summary: Crea un nuevo tipo de actividad
 *     tags: [Tipo de Actividad]
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
 *                 description: Nombre del tipo de actividad
 *               descripcion:
 *                 type: string
 *                 description: Descripción del tipo de actividad
 *     responses:
 *       201:
 *         description: Tipo de actividad creado con éxito
 *       400:
 *         description: Error en la solicitud
 */
RouterTipo_actividad.post("/tipo_actividad", verificarToken, postTipo_actividad);

/**
 * @swagger
 * /api/cultivo/tipo_actividad:
 *   get:
 *     summary: Obtiene todos los tipos de actividades
 *     tags: [Tipo de Actividad]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tipos de actividades obtenida con éxito
 *       401:
 *         description: No autorizado
 */
RouterTipo_actividad.get("/tipo_actividad", verificarToken, getTipo_actividad);

/**
 * @swagger
 * /api/cultivo/tipo_actividad/{id}:
 *   get:
 *     summary: Obtiene un tipo de actividad por ID
 *     tags: [Tipo de Actividad]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tipo de actividad a buscar
 *     responses:
 *       200:
 *         description: Tipo de actividad encontrado con éxito
 *       404:
 *         description: Tipo de actividad no encontrado
 */
RouterTipo_actividad.get("/tipo_actividad/:id", verificarToken, getIdTipo_actividad);

/**
 * @swagger
 * /api/cultivo/tipo_actividad/{id}:
 *   put:
 *     summary: Actualiza un tipo de actividad por ID
 *     tags: [Tipo de Actividad]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tipo de actividad a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nuevo nombre del tipo de actividad
 *               descripcion:
 *                 type: string
 *                 description: Nueva descripción del tipo de actividad
 *     responses:
 *       200:
 *         description: Tipo de actividad actualizado con éxito
 *       400:
 *         description: Error en la solicitud
 *       404:
 *         description: Tipo de actividad no encontrado
 */
RouterTipo_actividad.put("/tipo_actividad/:id", verificarToken, updateTipo_actividad);

/**
 * @swagger
 * /api/cultivo/tipo_actividad/{id}:
 *   delete:
 *     summary: Elimina un tipo de actividad por ID
 *     tags: [Tipo de Actividad]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tipo de actividad a eliminar
 *     responses:
 *       200:
 *         description: Tipo de actividad eliminado con éxito
 *       404:
 *         description: Tipo de actividad no encontrado
 */
RouterTipo_actividad.delete("/tipo_actividad/:id", verificarToken, deleteTipo_actividad);

export default RouterTipo_actividad;