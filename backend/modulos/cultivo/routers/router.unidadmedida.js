import { Router } from "express";
import verificarToken from "../../usuarios/middlewares/verificarToken.js";
import { postUnidadMedida, getUnidadesMedida, getIdUnidadMedida, updateUnidadMedida } from "../controller/controller.unidadmedida.js";

const RouterUnidadMedida = Router();

/**
 * @swagger
 * tags:
 *   name: Unidades de Medida
 *   description: Endpoints para la gestión de unidades de medida
 */

/**
 * @swagger
 * /unidades-medida:
 *   post:
 *     summary: Registra una nueva unidad de medida
 *     tags: [Unidades de Medida]
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
 *                 nullable: true
 *               creada_por_usuario:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Unidad de medida registrada correctamente
 *       400:
 *         description: Error en la solicitud
 */
RouterUnidadMedida.post("/unidades_medida", verificarToken, postUnidadMedida);

/**
 * @swagger
 * /unidades-medida:
 *   get:
 *     summary: Obtiene todas las unidades de medida registradas
 *     tags: [Unidades de Medida]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de unidades de medida
 *       401:
 *         description: No autorizado
 */
RouterUnidadMedida.get("/unidades_medida", verificarToken, getUnidadesMedida);

/**
 * @swagger
 * /unidades-medida/{id}:
 *   get:
 *     summary: Obtiene una unidad de medida por ID
 *     tags: [Unidades de Medida]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Datos de la unidad de medida
 *       404:
 *         description: Unidad de medida no encontrada
 */
RouterUnidadMedida.get("/unidades-medida/:id", verificarToken, getIdUnidadMedida);

/**
 * @swagger
 * /unidades-medida/{id}:
 *   put:
 *     summary: Actualiza una unidad de medida por ID
 *     tags: [Unidades de Medida]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
 *                 nullable: true
 *               creada_por_usuario:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Unidad de medida actualizada correctamente
 *       400:
 *         description: Error en la solicitud
 */
RouterUnidadMedida.put("/unidades_medida/:id", verificarToken, updateUnidadMedida);

/**
 * @swagger
 * /unidades-medida/{id}:
 *   delete:
 *     summary: Elimina una unidad de medida por ID
 *     tags: [Unidades de Medida]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Unidad de medida eliminada correctamente
 *       404:
 *         description: No se pudo eliminar la unidad de medida
 */
//RouterUnidadMedida.delete("/unidades-medida/:id", verificarToken, deleteUnidadMedida);

export default RouterUnidadMedida;