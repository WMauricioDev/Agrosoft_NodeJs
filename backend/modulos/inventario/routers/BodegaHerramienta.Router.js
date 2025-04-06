import { Router } from "express";
import {
    registrarBodegaHerramienta,
    listarBodegaHerramienta,
    actualizarBodegaHerramienta,
    eliminarBodegaHerramienta,
} from "../controllers/BodegaHerramienta.Controller.js";

import verificarToken from "../../usuarios/middlewares/verificarToken.js";

const rutaBodegaHerramienta = Router();

/**
 * @swagger
 * tags:
 *   name: BodegaHerramienta
 *   description: Endpoints para gestionar las herramientas en bodega
 */

/**
 * @swagger
 * /bodega_herramienta:
 *   get:
 *     summary: Obtener la lista de herramientas en la bodega
 *     tags: [BodegaHerramienta]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de herramientas obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_bodegaHerramienta:
 *                     type: integer
 *                     example: 1
 *                   id_bodega:
 *                     type: integer
 *                     example: 2
 *                   id_herramienta:
 *                     type: integer
 *                     example: 3

*                   cantidad_disponible:
 *                     type: integer
 *                     example: 10
 */
rutaBodegaHerramienta.get("/bodega_herramienta", verificarToken, listarBodegaHerramienta);

/**
 * @swagger
 * /bodega_herramienta:
 *   post:
 *     summary: Registrar una nueva herramienta en la bodega
 *     tags: [BodegaHerramienta]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_bodega:
 *                 type: integer
 *                 example: 2
 *               id_herramienta:
 *                 type: integer
 *                 example: 3
 *               cantidad_disponible:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       201:
 *         description: Herramienta registrada correctamente
 */
rutaBodegaHerramienta.post("/bodega_herramienta", verificarToken, registrarBodegaHerramienta);

/**
 * @swagger
 * /bodega_herramienta/{id_bodegaHerramienta}:
 *   put:
 *     summary: Actualizar los datos de una herramienta en la bodega
 *     tags: [BodegaHerramienta]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_bodegaHerramienta
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la herramienta a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_bodega:
 *                 type: integer
 *                 example: 2
 *               id_herramienta:
 *                 type: integer
 *                 example: 3
 *               cantidad_disponible:
 *                 type: integer
 *                 example: 15
 *     responses:
 *       200:
 *         description: Herramienta actualizada correctamente
 */
rutaBodegaHerramienta.put("/bodega_herramienta/:id", verificarToken, actualizarBodegaHerramienta);

/**
 * @swagger
 * /bodega_herramienta/{id_bodegaHerramienta}:
 *   delete:
 *     summary: Eliminar una herramienta de la bodega
 *     tags: [BodegaHerramienta]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_bodegaHerramienta
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la herramienta a eliminar
 *     responses:
 *       200:
 *         description: Herramienta eliminada correctamente
 */
rutaBodegaHerramienta.delete("/bodega_herramienta/:id", verificarToken, eliminarBodegaHerramienta);

export default rutaBodegaHerramienta;