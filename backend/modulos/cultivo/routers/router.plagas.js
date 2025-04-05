import { Router } from "express";
import verificarToken from "../../usuarios/middlewares/verificarToken.js";
import { postPlagas, getPlagas, getIdPlagas, updatePlagas, deletePlagas } from "../controller/controller.plagas.js";

const RouterPlagas = Router();

/**
 * @swagger
 * tags:
 *   name: Plagas
 *   description: Gestión de plagas en los cultivos
 */

/**
 * @swagger
 * /plagas:
 *   post:
 *     summary: Crea una nueva plaga
 *     tags: [Plagas]
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
 *               descripcion:
 *                 type: string
 *               img:
 *                 type: string
 *               fk_tipo_plaga:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Plaga creada con éxito
 *       400:
 *         description: Error en la solicitud
 */
RouterPlagas.post("/plagas", verificarToken, postPlagas);

/**
 * @swagger
 * /plagas:
 *   get:
 *     summary: Obtiene todas las plagas registradas
 *     tags: [Plagas]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de plagas obtenida con éxito
 *       401:
 *         description: No autorizado
 */
RouterPlagas.get("/plagas", verificarToken, getPlagas);

/**
 * @swagger
 * /plagas/{id}:
 *   get:
 *     summary: Obtiene una plaga por ID
 *     tags: [Plagas]
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
 *         description: Plaga encontrada con éxito
 *       404:
 *         description: Plaga no encontrada
 */
RouterPlagas.get("/plagas/:id", verificarToken, getIdPlagas);

/**
 * @swagger
 * /plagas/{id}:
 *   put:
 *     summary: Actualiza una plaga por ID
 *     tags: [Plagas]
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
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               img:
 *                 type: string
 *               fk_tipo_plaga:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Plaga actualizada con éxito
 *       400:
 *         description: Error en la solicitud
 */
RouterPlagas.put("/plagas/:id", verificarToken, updatePlagas);

/**
 * @swagger
 * /plagas/{id}:
 *   delete:
 *     summary: Elimina una plaga por ID
 *     tags: [Plagas]
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
 *         description: Plaga eliminada con éxito
 *       404:
 *         description: No se pudo eliminar la plaga
 */
RouterPlagas.delete("/plagas/:id", verificarToken, deletePlagas);

export default RouterPlagas;
