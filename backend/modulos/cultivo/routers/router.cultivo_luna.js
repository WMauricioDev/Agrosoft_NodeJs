import { Router } from "express";
import verificarToken from "../../usuarios/middlewares/verificarToken.js";
import { postCultivo_luna, getCultivo_luna, getIdCultivo_luna, updateCultivo_luna, deleteCultivo_luna } from "../controller/controller.cultivo_luna.js";

const RouterCultivo_luna = Router();

/**
 * @swagger
 * tags:
 *   name: Cultivo_Luna
 *   description: Endpoints para la gestión de Cultivo Luna
 */

/**
 * @swagger
 * /cultivo_luna:
 *   post:
 *     summary: Registra un nuevo cultivo luna
 *     tags: [Cultivo_Luna]
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
 *               fk_fase_lunar:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Cultivo Luna registrado correctamente
 *       400:
 *         description: Error en la solicitud
 */
RouterCultivo_luna.post("/cultivo_luna", verificarToken, postCultivo_luna);

/**
 * @swagger
 * /cultivo_luna:
 *   get:
 *     summary: Obtiene todos los registros de Cultivo Luna
 *     tags: [Cultivo_Luna]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de Cultivo Luna
 *       401:
 *         description: No autorizado
 */
RouterCultivo_luna.get("/cultivo_luna", verificarToken, getCultivo_luna);

/**
 * @swagger
 * /cultivo_luna/{id}:
 *   get:
 *     summary: Obtiene un registro de Cultivo Luna por ID
 *     tags: [Cultivo_Luna]
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
 *         description: Datos del Cultivo Luna
 *       404:
 *         description: Cultivo Luna no encontrado
 */
RouterCultivo_luna.get("/cultivo_luna/:id", verificarToken, getIdCultivo_luna);

/**
 * @swagger
 * /cultivo_luna/{id}:
 *   put:
 *     summary: Actualiza un registro de Cultivo Luna por ID
 *     tags: [Cultivo_Luna]
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
 *               fk_fase_lunar:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cultivo Luna actualizado exitosamente
 *       400:
 *         description: Error en la solicitud
 */
RouterCultivo_luna.put("/cultivo_luna/:id", verificarToken, updateCultivo_luna);

/**
 * @swagger
 * /cultivo_luna/{id}:
 *   delete:
 *     summary: Elimina un registro de Cultivo Luna por ID
 *     tags: [Cultivo_Luna]
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
 *         description: Cultivo Luna eliminado correctamente
 *       404:
 *         description: No se pudo eliminar Cultivo Luna
 */
RouterCultivo_luna.delete("/cultivo_luna/:id", verificarToken, deleteCultivo_luna);

export default RouterCultivo_luna;
