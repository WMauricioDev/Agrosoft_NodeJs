import { Router } from "express";
import verificarToken from "../../usuarios/middlewares/verificarToken.js";
import { postBancal, getBancal, IdBancal, actualizarBancal, deleteBancal } from "../controller/controller.bancal.js";

const RouterBancal = Router();

/**
 * @swagger
 * tags:
 *   name: Bancal
 *   description: Endpoints para gestionar los bancales
 */

/**
 * @swagger
 * /bancal:
 *   post:
 *     summary: Registrar un nuevo bancal
 *     tags: [Bancal]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fk_lote:
 *                 type: integer
 *                 example: 1
 *               tamx:
 *                 type: number
 *                 example: 5.0
 *               tamy:
 *                 type: number
 *                 example: 4.0
 *               posx:
 *                 type: number
 *                 example: 2.0
 *               posy:
 *                 type: number
 *                 example: 3.0
 *     responses:
 *       201:
 *         description: Bancal registrado correctamente
 */
RouterBancal.post("/bancal", verificarToken, postBancal);

/**
 * @swagger
 * /bancal:
 *   get:
 *     summary: Obtener la lista de bancales
 *     tags: [Bancal]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de bancales obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   tamx:
 *                     type: number
 *                     example: 5.0
 *                   tamy:
 *                     type: number
 *                     example: 4.0
 *                   posx:
 *                     type: number
 *                     example: 2.0
 *                   posy:
 *                     type: number
 *                     example: 3.0
 */
RouterBancal.get("/bancal", verificarToken, getBancal);

/**
 * @swagger
 * /bancal/{id}:
 *   get:
 *     summary: Obtener un bancal por ID
 *     tags: [Bancal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del bancal a obtener
 *     responses:
 *       200:
 *         description: Bancal obtenido correctamente
 */
RouterBancal.get("/bancal/:id", verificarToken, IdBancal);

/**
 * @swagger
 * /bancal/{id}:
 *   put:
 *     summary: Actualizar un bancal
 *     tags: [Bancal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del bancal a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fk_lote:
 *                 type: integer
 *                 example: 1
 *               tamx:
 *                 type: number
 *                 example: 6.0
 *               tamy:
 *                 type: number
 *                 example: 4.5
 *               posx:
 *                 type: number
 *                 example: 2.5
 *               posy:
 *                 type: number
 *                 example: 3.5
 *     responses:
 *       200:
 *         description: Bancal actualizado correctamente
 */
RouterBancal.put("/bancal/:id", verificarToken, actualizarBancal);
RouterBancal.delete("/bancal/:id", verificarToken, deleteBancal);

export default RouterBancal;
