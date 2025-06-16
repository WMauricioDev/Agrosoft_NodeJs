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
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   bodega_id:
 *                     type: integer
 *                     example: 2
 *                   herramienta_id:
 *                     type: integer
 *                     example: 3
 *                   cantidad:
 *                     type: integer
 *                     example: 10
 *                   creador_id:
 *                     type: integer
 *                     example: 1
 *                   costo_total:
 *                     type: number
 *                     format: float
 *                     example: 500.00
 *                   cantidad_prestada:
 *                     type: integer
 *                     example: 2
 *       404:
 *         description: No hay registros
 */

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
 *               bodega_id:
 *                 type: integer
 *                 example: 2
 *               herramienta_id:
 *                 type: integer
 *                 example: 3
 *               cantidad:
 *                 type: integer
 *                 example: 10
 *               creador_id:
 *                 type: integer
 *                 example: 1
 *               cantidad_prestada:
 *                 type: integer
 *                 example: 0
 *     responses:
 *       201:
 *         description: Herramienta registrada correctamente
 *       400:
 *         description: Error en los datos proporcionados
 */

/**
 * @swagger
 * /bodega_herramienta/{id}:
 *   put:
 *     summary: Actualizar los datos de una herramienta en la bodega
 *     tags: [BodegaHerramienta]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               bodega_id:
 *                 type: integer
 *                 example: 2
 *               herramienta_id:
 *                 type: integer
 *                 example: 3
 *               cantidad:
 *                 type: integer
 *                 example: 15
 *               creador_id:
 *                 type: integer
 *                 example: 1
 *               costo_total:
 *                 type: number
 *                 format: float
 *                 example: 750.00
 *               cantidad_prestada:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Herramienta actualizada correctamente
 *       404:
 *         description: Herramienta no encontrada
 */

/**
 * @swagger
 * /bodega_herramienta/{id}:
 *   delete:
 *     summary: Eliminar una herramienta de la bodega
 *     tags: [BodegaHerramienta]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la herramienta a eliminar
 *     responses:
 *       200:
 *         description: Herramienta eliminada correctamente
 *       404:
 *         description: Herramienta no encontrada
 */

rutaBodegaHerramienta.get("/bodega_herramienta", verificarToken, listarBodegaHerramienta);
rutaBodegaHerramienta.post("/bodega_herramienta", verificarToken, registrarBodegaHerramienta);
rutaBodegaHerramienta.put("/bodega_herramienta/:id", verificarToken, actualizarBodegaHerramienta);
rutaBodegaHerramienta.delete("/bodega_herramienta/:id", verificarToken, eliminarBodegaHerramienta);

export default rutaBodegaHerramienta;