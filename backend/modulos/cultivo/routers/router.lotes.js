import { Router } from "express";
import verificarToken from "../../usuarios/middlewares/verificarToken.js";
import { postLote, getLote, getIdLote, updateLote, deleteLote } from "../controller/controller.lotes.js";

const RouterLote = Router();

/**
 * @swagger
 * tags:
 *   name: Lotes
 *   description: Endpoints para gestionar lotes
 */

/**
 * @swagger
 * /api/cultivo/lotes:
 *   post:
 *     summary: Registrar un nuevo lote
 *     tags: [Lotes]
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
 *                 example: "Lote 1"
 *               descripcion:
 *                 type: string
 *                 example: "Lote destinado para cultivo de maíz"
 *               activo:
 *                 type: boolean
 *                 example: true
 *               tam_x:
 *                 type: number
 *                 example: 20.5
 *               tam_y:
 *                 type: number
 *                 example: 30.0
 *               pos_x:
 *                 type: number
 *                 example: 10.0
 *               pos_y:
 *                 type: number
 *                 example: 15.5
 *     responses:
 *       201:
 *         description: Lote registrado correctamente
 *       400:
 *         description: Error en la solicitud
 */
RouterLote.post("/lotes", verificarToken, postLote);

/**
 * @swagger
 * /api/cultivo/lotes:
 *   get:
 *     summary: Obtener la lista de lotes
 *     tags: [Lotes]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de lotes obtenida correctamente
 *       401:
 *         description: No autorizado
 */
RouterLote.get("/lotes", verificarToken, getLote);

/**
 * @swagger
 * /api/cultivo/lotes/{id}:
 *   get:
 *     summary: Obtener un lote por ID
 *     tags: [Lotes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del lote a obtener
 *     responses:
 *       200:
 *         description: Lote obtenido correctamente
 *       404:
 *         description: Lote no encontrado
 */
RouterLote.get("/lotes/:id", verificarToken, getIdLote);

/**
 * @swagger
 * /api/cultivo/lotes/{id}:
 *   put:
 *     summary: Actualizar un lote
 *     tags: [Lotes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del lote a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Lote 2"
 *               descripcion:
 *                 type: string
 *                 example: "Lote destinado para cultivo de trigo"
 *               activo:
 *                 type: boolean
 *                 example: false
 *               tam_x:
 *                 type: number
 *                 example: 25.0
 *               tam_y:
 *                 type: number
 *                 example: 35.0
 *               pos_x:
 *                 type: number
 *                 example: 12.0
 *               pos_y:
 *                 type: number
 *                 example: 18.5
 *     responses:
 *       200:
 *         description: Lote actualizado correctamente
 *       400:
 *         description: Error en la solicitud
 *       404:
 *         description: Lote no encontrado
 */
RouterLote.put("/lotes/:id", verificarToken, updateLote);

/**
 * @swagger
 * /api/cultivo/lotes/{id}:
 *   delete:
 *     summary: Eliminar un lote por ID
 *     tags: [Lotes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del lote a eliminar
 *     responses:
 *       200:
 *         description: Lote eliminado correctamente
 *       404:
 *         description: Lote no encontrado
 */
RouterLote.delete("/lotes/:id", verificarToken, deleteLote);

export default RouterLote;