import { Router } from "express";
import verificarToken from "../../usuarios/middlewares/verificarToken.js";
import { postControles, getControles, getIdControles, updateControles, deleteControles } from "../controller/controller.controles.js";

const RouterControles = Router();

/**
 * @swagger
 * tags:
 *   name: Controles
 *   description: Endpoints para la gestión de controles
 */

/**
 * @swagger
 * /controles:
 *   post:
 *     summary: Crea un nuevo control
 *     tags: [Controles]
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
 *               fecha_control:
 *                 type: string
 *                 format: date
 *               cantidad_producto:
 *                 type: integer
 *               fk_afecciones:
 *                 type: integer
 *               fk_tipo_control:
 *                 type: integer
 *               fk_productos_control:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Control creado correctamente
 *       400:
 *         description: Error en la solicitud
 */
RouterControles.post("/controles", verificarToken, postControles);

/**
 * @swagger
 * /controles:
 *   get:
 *     summary: Obtiene todos los controles
 *     tags: [Controles]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de controles
 *       401:
 *         description: No autorizado
 */
RouterControles.get("/controles", verificarToken, getControles);

/**
 * @swagger
 * /controles/{id}:
 *   get:
 *     summary: Obtiene un control por ID
 *     tags: [Controles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Datos del control
 *       404:
 *         description: Control no encontrado
 */
RouterControles.get("/controles/:id", verificarToken, getIdControles);

/**
 * @swagger
 * /controles/{id}:
 *   put:
 *     summary: Actualiza un control por ID
 *     tags: [Controles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descripcion:
 *                 type: string
 *               fecha_control:
 *                 type: string
 *                 format: date
 *               cantidad_producto:
 *                 type: integer
 *               fk_afecciones:
 *                 type: integer
 *               fk_tipo_control:
 *                 type: integer
 *               fk_productos_control:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Control actualizado exitosamente
 *       400:
 *         description: Error en la solicitud
 */
RouterControles.put("/controles/:id", verificarToken, updateControles);

/**
 * @swagger
 * /controles/{id}:
 *   delete:
 *     summary: Elimina un control por ID
 *     tags: [Controles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Control eliminado correctamente
 *       404:
 *         description: Control no encontrado
 */
RouterControles.delete("/controles/:id", verificarToken, deleteControles);

export default RouterControles;
