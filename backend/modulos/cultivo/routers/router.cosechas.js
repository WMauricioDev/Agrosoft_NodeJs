import { Router } from "express";
import verificarToken from "../../usuarios/middlewares/verificarToken.js";
import { postCosechas, getCosechas, getIdCosechas, updateCosechas, deleteCosechas } from "../controller/controller.cosechas.js";

const RouterCosechas = Router();

/**
 * @swagger
 * tags:
 *   name: Cosechas
 *   description: Endpoints para la gestión de cosechas
 */

/**
 * @swagger
 * /cosechas:
 *   post:
 *     summary: Registra una nueva cosecha
 *     tags: [Cosechas]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha:
 *                 type: string
 *                 format: date
 *               unidades_medida:
 *                 type: number
 *               fk_cultivo:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Cosecha registrada correctamente
 *       400:
 *         description: Error en la solicitud
 */
RouterCosechas.post("/cosechas", verificarToken, postCosechas);

/**
 * @swagger
 * /cosechas:
 *   get:
 *     summary: Obtiene todas las cosechas
 *     tags: [Cosechas]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de cosechas
 *       404:
 *         description: No hay registros de cosechas
 */
RouterCosechas.get("/cosechas", verificarToken, getCosechas);

/**
 * @swagger
 * /cosechas/{id}:
 *   get:
 *     summary: Obtiene una cosecha por ID
 *     tags: [Cosechas]
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
 *         description: Datos de la cosecha
 *       404:
 *         description: Cosecha no encontrada
 */
RouterCosechas.get("/cosechas/:id", verificarToken, getIdCosechas);

/**
 * @swagger
 * /cosechas/{id}:
 *   put:
 *     summary: Actualiza una cosecha por ID
 *     tags: [Cosechas]
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
 *               fecha:
 *                 type: string
 *                 format: date
 *               unidades_medida:
 *                 type: number
 *               fk_cultivo:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cosecha actualizada exitosamente
 *       400:
 *         description: Error en la solicitud
 */
RouterCosechas.put("/cosechas/:id", verificarToken, updateCosechas);

/**
 * @swagger
 * /cosechas/{id}:
 *   delete:
 *     summary: Elimina una cosecha por ID
 *     tags: [Cosechas]
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
 *         description: Cosecha eliminada correctamente
 *       404:
 *         description: No se pudo eliminar la cosecha
 */
RouterCosechas.delete("/cosechas/:id", verificarToken, deleteCosechas);

export default RouterCosechas;
