import { Router } from "express";
import verificarToken from "../../usuarios/middlewares/verificarToken.js";
import { postAfecciones, getAfecciones, getIdAfecciones, updateAfecciones, deleteAfecciones, cambiarEstadoAfeccion} from "../controller/controller.afecciones.js";

const RouterAfecciones = Router();

/**
 * @swagger
 * tags:
 *   name: Afecciones
 *   description: Endpoints para la gestión de afecciones
 */

/**
 * @swagger
 * /afecciones:
 *   post:
 *     summary: Crea una nueva afección
 *     tags: [Afecciones]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prioridad:
 *                 type: string
 *               fecha_encuentro:
 *                 type: string
 *                 format: date
 *               fk_plantacion:
 *                 type: integer
 *               fk_plaga:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Afección creada correctamente
 *       400:
 *         description: Error en la solicitud
 */
RouterAfecciones.post("/afecciones", verificarToken, postAfecciones);

/**
 * @swagger
 * /afecciones:
 *   get:
 *     summary: Obtiene todas las afecciones
 *     tags: [Afecciones]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de afecciones
 *       401:
 *         description: No autorizado
 */
RouterAfecciones.get("/afecciones", verificarToken, getAfecciones);

/**
 * @swagger
 * /afecciones/{id}:
 *   get:
 *     summary: Obtiene una afección por ID
 *     tags: [Afecciones]
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
 *         description: Datos de la afección
 *       404:
 *         description: Afección no encontrada
 */
RouterAfecciones.get("/afecciones/:id", verificarToken, getIdAfecciones);

/**
 * @swagger
 * /afecciones/{id}:
 *   put:
 *     summary: Actualiza una afección por ID
 *     tags: [Afecciones]
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
 *               prioridad:
 *                 type: string
 *               fecha_encuentro:
 *                 type: string
 *                 format: date
 *               fk_plantacion:
 *                 type: integer
 *               fk_plaga:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Afección actualizada exitosamente
 *       400:
 *         description: Error en la solicitud
 */
RouterAfecciones.patch("/afecciones/:id", verificarToken, updateAfecciones);

/**
 * @swagger
 * /afecciones/{id}:
 *   delete:
 *     summary: Elimina una afección por ID
 *     tags: [Afecciones]
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
 *         description: Afección eliminada correctamente
 *       404:
 *         description: No se pudo eliminar la afección
 */
RouterAfecciones.delete("/afecciones/:id", verificarToken, deleteAfecciones);
RouterAfecciones.post("/afecciones/:id/cambiar_estado", verificarToken, cambiarEstadoAfeccion)

export default RouterAfecciones;
