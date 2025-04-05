import { Router } from "express";
import verificarToken from "../../usuarios/middlewares/verificarToken.js";
import { postBancal, getBancal, getIdBancal, updateBancal, deleteBancal } from "../controller/controller.bancal.js";

const RouterBancal = Router();

/**
 * @swagger
 * tags:
 *   name: Bancales
 *   description: Endpoints para gestionar bancales
 */

/**
 * @swagger
 * /api/cultivo/bancales:
 *   post:
 *     summary: Registrar un nuevo bancal
 *     tags: [Bancales]
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
 *                 example: "Bancal 1"
 *               TamX:
 *                 type: number
 *                 example: 5.0
 *               TamY:
 *                 type: number
 *                 example: 4.0
 *               posX:
 *                 type: number
 *                 example: 2.0
 *               posY:
 *                 type: number
 *                 example: 3.0
 *               fk_lote:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Bancal registrado correctamente
 *       400:
 *         description: Error en la solicitud
 */
RouterBancal.post("/bancales", verificarToken, postBancal);

/**
 * @swagger
 * /api/cultivo/bancales:
 *   get:
 *     summary: Obtener la lista de bancales
 *     tags: [Bancales]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de bancales obtenida correctamente
 *       401:
 *         description: No autorizado
 */
RouterBancal.get("/bancales", verificarToken, getBancal);

/**
 * @swagger
 * /api/cultivo/bancales/{id}:
 *   get:
 *     summary: Obtener un bancal por ID
 *     tags: [Bancales]
 *     security:
 *       - BearerAuth: []
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
 *       404:
 *         description: Bancal no encontrado
 */
RouterBancal.get("/bancales/:id", verificarToken, getIdBancal);

/**
 * @swagger
 * /api/cultivo/bancales/{id}:
 *   put:
 *     summary: Actualizar un bancal
 *     tags: [Bancales]
 *     security:
 *       - BearerAuth: []
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
 *               nombre:
 *                 type: string
 *                 example: "Bancal 1 Modificado"
 *               TamX:
 *                 type: number
 *                 example: 6.0
 *               TamY:
 *                 type: number
 *                 example: 4.5
 *               posX:
 *                 type: number
 *                 example: 2.5
 *               posY:
 *                 type: number
 *                 example: 3.5
 *               fk_lote:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Bancal actualizado correctamente
 *       400:
 *         description: Error en la solicitud
 *       404:
 *         description: Bancal no encontrado
 */
RouterBancal.put("/bancales/:id", verificarToken, updateBancal);

/**
 * @swagger
 * /api/cultivo/bancales/{id}:
 *   delete:
 *     summary: Eliminar un bancal por ID
 *     tags: [Bancales]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del bancal a eliminar
 *     responses:
 *       200:
 *         description: Bancal eliminado correctamente
 *       404:
 *         description: Bancal no encontrado
 */
RouterBancal.delete("/bancales/:id", verificarToken, deleteBancal);

export default RouterBancal;