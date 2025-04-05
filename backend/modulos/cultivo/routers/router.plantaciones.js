import { Router } from "express";
import verificarToken from "../../usuarios/middlewares/verificarToken.js";
import { postPlantaciones, getPlantaciones, getIdPlantaciones, updatePlantaciones, deletePlantaciones } from "../controller/controller.plantaciones.js";

const RouterPlantaciones = Router();

/**
 * @swagger
 * tags:
 *   name: Plantaciones
 *   description: Gestión de plantaciones en los cultivos
 */

/**
 * @swagger
 * /plantaciones:
 *   post:
 *     summary: Crea una nueva plantación
 *     tags: [Plantaciones]
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
 *               fk_bancal:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Plantación creada con éxito
 *       400:
 *         description: Error en la solicitud
 */
RouterPlantaciones.post("/plantaciones", verificarToken, postPlantaciones);

/**
 * @swagger
 * /plantaciones:
 *   get:
 *     summary: Obtiene todas las plantaciones registradas
 *     tags: [Plantaciones]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de plantaciones obtenida con éxito
 *       401:
 *         description: No autorizado
 */
RouterPlantaciones.get("/plantaciones", verificarToken, getPlantaciones);

/**
 * @swagger
 * /plantaciones/{id}:
 *   get:
 *     summary: Obtiene una plantación por ID
 *     tags: [Plantaciones]
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
 *         description: Plantación encontrada con éxito
 *       404:
 *         description: Plantación no encontrada
 */
RouterPlantaciones.get("/plantaciones/:id", verificarToken, getIdPlantaciones);

/**
 * @swagger
 * /plantaciones/{id}:
 *   put:
 *     summary: Actualiza una plantación por ID
 *     tags: [Plantaciones]
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
 *               fk_bancal:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Plantación actualizada con éxito
 *       400:
 *         description: Error en la solicitud
 */
RouterPlantaciones.put("/plantaciones/:id", verificarToken, updatePlantaciones);

/**
 * @swagger
 * /plantaciones/{id}:
 *   delete:
 *     summary: Elimina una plantación por ID
 *     tags: [Plantaciones]
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
 *         description: Plantación eliminada con éxito
 *       404:
 *         description: No se pudo eliminar la plantación
 */
RouterPlantaciones.delete("/plantaciones/:id", verificarToken, deletePlantaciones);

export default RouterPlantaciones;
