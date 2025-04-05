import { Router } from "express";
import verificarToken from "../../usuarios/middlewares/verificarToken.js";
import { postFase_lunar, getFase_lunar, getIdFase_lunar, updateFase_lunar, deleteFase_lunar } from "../controller/controller.fase_lunar.js";

const RouterFase_lunar = Router();

/**
 * @swagger
 * tags:
 *   name: Fase Lunar
 *   description: Endpoints para la gestión de fases lunares
 */

/**
 * @swagger
 * /fase_lunar:
 *   post:
 *     summary: Registra una nueva fase lunar
 *     tags: [Fase Lunar]
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
 *               fecha:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Fase lunar registrada correctamente
 *       400:
 *         description: Error en la solicitud
 */
RouterFase_lunar.post("/fase_lunar", verificarToken, postFase_lunar);

/**
 * @swagger
 * /fase_lunar:
 *   get:
 *     summary: Obtiene todas las fases lunares registradas
 *     tags: [Fase Lunar]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de fases lunares
 *       401:
 *         description: No autorizado
 */
RouterFase_lunar.get("/fase_lunar", verificarToken, getFase_lunar);

/**
 * @swagger
 * /fase_lunar/{id}:
 *   get:
 *     summary: Obtiene una fase lunar por ID
 *     tags: [Fase Lunar]
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
 *         description: Datos de la fase lunar
 *       404:
 *         description: Fase lunar no encontrada
 */
RouterFase_lunar.get("/fase_lunar/:id", verificarToken, getIdFase_lunar);

/**
 * @swagger
 * /fase_lunar/{id}:
 *   put:
 *     summary: Actualiza una fase lunar por ID
 *     tags: [Fase Lunar]
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
 *               fecha:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Fase lunar actualizada correctamente
 *       400:
 *         description: Error en la solicitud
 */
RouterFase_lunar.put("/fase_lunar/:id", verificarToken, updateFase_lunar);

/**
 * @swagger
 * /fase_lunar/{id}:
 *   delete:
 *     summary: Elimina una fase lunar por ID
 *     tags: [Fase Lunar]
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
 *         description: Fase lunar eliminada correctamente
 *       404:
 *         description: No se pudo eliminar la fase lunar
 */
RouterFase_lunar.delete("/fase_lunar/:id", verificarToken, deleteFase_lunar);

export default RouterFase_lunar;
