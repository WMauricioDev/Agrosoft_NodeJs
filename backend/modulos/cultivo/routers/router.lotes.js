import verificarToken from "../../usuarios/middlewares/verificarToken.js";
import { Router } from "express";
import { postLote, getLote, IdLote, actualizarLote, deleteLote } from "../controller/controller.lotes.js";
const RouterLote = Router();

/**
 * @swagger
 * tags:
 *   name: Lotes
 *   description: Endpoints para gestionar lotes
 */

/**
 * @swagger
 * /lotes:
 *   post:
 *     summary: Registrar un nuevo lote
 *     tags: [Lotes]
 *     security:
 *       - bearerAuth: []
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
 *               tamx:
 *                 type: number
 *                 example: 20.5
 *               tamy:
 *                 type: number
 *                 example: 30.0
 *               estado:
 *                 type: string
 *                 example: "Activo"
 *               posx:
 *                 type: number
 *                 example: 10.0
 *               posy:
 *                 type: number
 *                 example: 15.5
 *     responses:
 *       201:
 *         description: Lote registrado correctamente
 */
RouterLote.post("/lotes", verificarToken, postLote);

/**
 * @swagger
 * /lotes:
 *   get:
 *     summary: Obtener la lista de lotes
 *     tags: [Lotes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de lotes obtenida correctamente
 */
RouterLote.get("/lotes", verificarToken, getLote);

/**
 * @swagger
 * /lotes/{id}:
 *   get:
 *     summary: Obtener un lote por ID
 *     tags: [Lotes]
 *     security:
 *       - bearerAuth: []
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
 */
RouterLote.get("/lotes/:id", verificarToken, IdLote);

/**
 * @swagger
 * /lotes/{id}:
 *   put:
 *     summary: Actualizar un lote
 *     tags: [Lotes]
 *     security:
 *       - bearerAuth: []
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
 *               tamx:
 *                 type: number
 *                 example: 25.0
 *               tamy:
 *                 type: number
 *                 example: 35.0
 *               estado:
 *                 type: string
 *                 example: "Inactivo"
 *               posx:
 *                 type: number
 *                 example: 12.0
 *               posy:
 *                 type: number
 *                 example: 18.5
 *     responses:
 *       200:
 *         description: Lote actualizado correctamente
 */
RouterLote.put("/lotes/:id", verificarToken, actualizarLote);

RouterLote.delete("/lotes/:id", verificarToken, deleteLote);

export default RouterLote;
