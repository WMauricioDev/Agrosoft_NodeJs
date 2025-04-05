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
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   nombre:
 *                     type: string
 *                     example: "Martillo"
 *                   descripcion:
 *                     type: string
 *                     example: "Herramienta de golpe"
 *                   unidades:
 *                     type: integer
 *                     example: 10
 *                   fk_lote:
 *                     type: integer
 *                     example: 2
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
 *               fk_lote:
 *                 type: integer
 *                 example: 2
 *               nombre:
 *                 type: string
 *                 example: "Martillo"
 *               descripcion:
 *                 type: string
 *                 example: "Herramienta de golpe"
 *               unidades:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       201:
 *         description: Herramienta registrada correctamente
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
 *               fk_lote:
 *                 type: integer
 *                 example: 3
 *               nombre:
 *                 type: string
 *                 example: "Destornillador"
 *               descripcion:
 *                 type: string
 *                 example: "Herramienta para tornillos"
 *               unidades:
 *                 type: integer
 *                 example: 15
 *     responses:
 *       200:
 *         description: Herramienta actualizada correctamente
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
 */
rutaHerramienta.delete("/herramientas/:id", verificarToken, eliminarHerramienta);

export default rutaHerramienta;
