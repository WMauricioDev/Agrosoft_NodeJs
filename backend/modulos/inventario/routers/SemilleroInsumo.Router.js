import { Router } from "express";
import {
    registrarSemilleroInsumo,
    listarSemilleroInsumo,
    actualizarSemilleroInsumo,
    eliminarSemilleroInsumo,
} from "../controllers/SemilleroInsumo.js";

import verificarToken from "../../usuarios/middlewares/verificarToken.js";

const rutaSemilleroInsumo = Router();

/**
 * @swagger
 * tags:
 *   name: Semillero-Insumo
 *   description: Endpoints para la gestión de insumos de semilleros
 */

/**
 * @swagger
 * /semillero_insumo:
 *   get:
 *     summary: Obtener la lista de insumos asignados a semilleros
 *     tags: [Semillero-Insumo]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de insumos asignados a semilleros obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_semillero_insumo:
 *                     type: integer
 *                     example: 1
 *                   id_semillero:
 *                     type: integer
 *                     example: 2
 *                   id_insumo:
 *                     type: integer
 *                     example: 5
 *                   cantidad_necesaria:
 *                     type: integer
 *                     example: 10
 *                   id_bodega:
 *                     type: integer
 *                     example: 3
 */
rutaSemilleroInsumo.get("/semillero_insumo", verificarToken, listarSemilleroInsumo);

/**
 * @swagger
 * /semillero_insumo:
 *   post:
 *     summary: Asignar un insumo a un semillero
 *     tags: [Semillero-Insumo]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_semillero:
 *                 type: integer
 *                 example: 2
 *               id_insumo:
 *                 type: integer
 *                 example: 5
 *               cantidad_necesaria:
 *                 type: integer
 *                 example: 10
 *               id_bodega:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       201:
 *         description: Insumo asignado correctamente al semillero
 */
rutaSemilleroInsumo.post("/semillero_insumo", verificarToken, registrarSemilleroInsumo);

/**
 * @swagger
 * /semillero_insumo/{id}:
 *   put:
 *     summary: Actualizar la asignación de un insumo en un semillero
 *     tags: [Semillero-Insumo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la asignación a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_semillero:
 *                 type: integer
 *                 example: 2
 *               id_insumo:
 *                 type: integer
 *                 example: 5
 *               cantidad_necesaria:
 *                 type: integer
 *                 example: 15
 *               id_bodega:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Asignación de insumo actualizada correctamente
 */
rutaSemilleroInsumo.put("/semillero_insumo/:id", verificarToken, actualizarSemilleroInsumo);

/**
 * @swagger
 * /semillero_insumo/{id}:
 *   delete:
 *     summary: Eliminar una asignación de insumo en un semillero
 *     tags: [Semillero-Insumo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la asignación a eliminar
 *     responses:
 *       200:
 *         description: Asignación eliminada correctamente
 */
rutaSemilleroInsumo.delete("/semillero_insumo/:id", verificarToken, eliminarSemilleroInsumo);

export default rutaSemilleroInsumo;
