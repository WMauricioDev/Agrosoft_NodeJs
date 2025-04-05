import { Router } from "express";
import verificarToken from "../../usuarios/middlewares/verificarToken.js";
import { listarInsumos, registrarInsumo, actualizarInsumo, eliminarInsumo } from "../controllers/Insumos.Controller.js";

const rutaInsumos = Router();

/**
 * @swagger
 * tags:
 *   name: Insumos
 *   description: API para la gestión de insumos
 */

/**
 * @swagger
 * /insumos:
 *   get:
 *     summary: Obtener todos los insumos
 *     tags: [Insumos]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de insumos obtenida correctamente
 *       500:
 *         description: Error en el servidor
 */
rutaInsumos.get("/insumos", verificarToken, listarInsumos);

/**
 * @swagger
 * /insumos:
 *   post:
 *     summary: Registrar un nuevo insumo
 *     tags: [Insumos]
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
 *                 description: Nombre del insumo
 *               descripcion:
 *                 type: string
 *                 description: Descripción del insumo
 *               precio:
 *                 type: number
 *                 description: Precio del insumo
 *               unidad_medida:
 *                 type: string
 *                 description: Unidad de medida
 *     responses:
 *       200:
 *         description: Insumo registrado correctamente
 *       500:
 *         description: Error en el servidor
 */
rutaInsumos.post("/insumos", verificarToken, registrarInsumo);

/**
 * @swagger
 * /insumos/{id}:
 *   put:
 *     summary: Actualizar un insumo
 *     tags: [Insumos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del insumo a actualizar
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
 *               precio:
 *                 type: number
 *               unidad_medida:
 *                 type: string
 *     responses:
 *       200:
 *         description: Insumo actualizado correctamente
 *       404:
 *         description: Insumo no encontrado
 *       500:
 *         description: Error en el servidor
 */
rutaInsumos.put("/insumos/:id", verificarToken, actualizarInsumo);

/**
 * @swagger
 * /insumos/{id}:
 *   delete:
 *     summary: Eliminar un insumo
 *     tags: [Insumos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del insumo a eliminar
 *     responses:
 *       200:
 *         description: Insumo eliminado correctamente
 *       404:
 *         description: Insumo no encontrado
 *       500:
 *         description: Error en el servidor
 */
rutaInsumos.delete("/insumos/:id", verificarToken, eliminarInsumo);

export default rutaInsumos;