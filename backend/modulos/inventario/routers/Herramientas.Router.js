import { Router } from "express";
import {
  registrarHerramienta,
  listarHerramientas,
  actualizarHerramienta,
  eliminarHerramienta,
} from "../controllers/Herramientas.Controller.js";
import verificarToken from "../../usuarios/middlewares/verificarToken.js";

const rutaHerramienta = Router();

/**
 * @swagger
 * tags:
 *   name: Herramientas
 *   description: Endpoints para gestionar herramientas
 */

/**
 * @swagger
 * /herramientas:
 *   get:
 *     summary: Obtener la lista de herramientas
 *     tags: [Herramientas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de herramientas obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Herramientas obtenidas correctamente
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       nombre:
 *                         type: string
 *                         example: Martillo
 *                       descripcion:
 *                         type: string
 *                         example: Herramienta de golpe
 *                       cantidad:
 *                         type: integer
 *                         example: 10
 *                       estado:
 *                         type: string
 *                         example: Disponible
 *                       activo:
 *                         type: boolean
 *                         example: true
 *                       fecha_registro:
 *                         type: string
 *                         example: 2025-06-14T14:43:00Z
 *                       precio:
 *                         type: number
 *                         example: 50000
 *                       cantidad_disponible:
 *                         type: number
 *                         example: 8
 */
rutaHerramienta.get("/herramientas", verificarToken, listarHerramientas);

/**
 * @swagger
 * /herramientas:
 *   post:
 *     summary: Registrar una nueva herramienta
 *     tags: [Herramientas]
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
 *                 example: Martillo
 *               descripcion:
 *                 type: string
 *                 example: Herramienta de golpe
 *               cantidad:
 *                 type: integer
 *                 example: 10
 *               estado:
 *                 type: string
 *                 example: Disponible
 *               activo:
 *                 type: boolean
 *                 example: true
 *               fecha_registro:
 *                 type: string
 *                 example: 2025-06-14T14:43:00Z
 *               precio:
 *                 type: number
 *                 example: 50000
 *     responses:
 *       201:
 *         description: Herramienta registrada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Herramienta registrada correctamente
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 */
rutaHerramienta.post("/herramientas", verificarToken, registrarHerramienta);

/**
 * @swagger
 * /herramientas/{id}:
 *   put:
 *     summary: Actualizar los datos de una herramienta
 *     tags: [Herramientas]
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
 *               nombre:
 *                 type: string
 *                 example: Destornillador
 *               descripcion:
 *                 type: string
 *                 example: Herramienta para tornillos
 *               cantidad:
 *                 type: integer
 *                 example: 15
 *               estado:
 *                 type: string
 *                 example: Disponible
 *               activo:
 *                 type: boolean
 *                 example: true
 *               fecha_registro:
 *                 type: string
 *                 example: 2025-06-14T14:43:00Z
 *               precio:
 *                 type: number
 *                 example: 30000
 *     responses:
 *       200:
 *         description: Herramienta actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Herramienta actualizada correctamente
 */
rutaHerramienta.put("/herramientas/:id", verificarToken, actualizarHerramienta);

/**
 * @swagger
 * /herramientas/{id}:
 *   delete:
 *     summary: Eliminar una herramienta
 *     tags: [Herramientas]
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Herramienta eliminada correctamente
 */
rutaHerramienta.delete("/herramientas/:id", verificarToken, eliminarHerramienta);

export default rutaHerramienta;