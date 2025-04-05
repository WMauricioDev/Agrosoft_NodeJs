import { Router } from "express";
import verificarToken from "../../usuarios/middlewares/verificarToken.js";
import { postEspecies, getEspecies, getIdEspecies, updateEspecies, deleteEspecies } from "../controller/controller.especies.js";

const RouterEspecies = Router();

/**
 * @swagger
 * tags:
 *   name: Especies
 *   description: Endpoints para la gestión de especies
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Especie:
 *       type: object
 *       required:
 *         - nombre
 *         - fk_tipo_especie
 *       properties:
 *         id:
 *           type: integer
 *           description: ID de la especie
 *         nombre:
 *           type: string
 *           description: Nombre de la especie
 *         descripcion:
 *           type: string
 *           description: Descripción de la especie
 *         img:
 *           type: string
 *           description: URL de la imagen de la especie
 *         tiempo_crecimiento:
 *           type: string
 *           description: Tiempo de crecimiento de la especie
 *         fk_tipo_especie:
 *           type: integer
 *           description: ID del tipo de especie asociado
 */

/**
 * @swagger
 * /especies:
 *   post:
 *     summary: Registra una nueva especie
 *     tags: [Especies]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Especie'
 *     responses:
 *       201:
 *         description: Especie registrada correctamente
 *       400:
 *         description: Error en la solicitud
 */
RouterEspecies.post("/especies", verificarToken, postEspecies);

/**
 * @swagger
 * /especies:
 *   get:
 *     summary: Obtiene todas las especies registradas
 *     tags: [Especies]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de especies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Especie'
 *       401:
 *         description: No autorizado
 */
RouterEspecies.get("/especies", verificarToken, getEspecies);

/**
 * @swagger
 * /especies/{id}:
 *   get:
 *     summary: Obtiene una especie por ID
 *     tags: [Especies]
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
 *         description: Datos de la especie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Especie'
 *       404:
 *         description: Especie no encontrada
 */
RouterEspecies.get("/especies/:id", verificarToken, getIdEspecies);

/**
 * @swagger
 * /especies/{id}:
 *   put:
 *     summary: Actualiza una especie por ID
 *     tags: [Especies]
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
 *             $ref: '#/components/schemas/Especie'
 *     responses:
 *       200:
 *         description: Especie actualizada correctamente
 *       400:
 *         description: Error en la solicitud
 */
RouterEspecies.put("/especies/:id", verificarToken, updateEspecies);

/**
 * @swagger
 * /especies/{id}:
 *   delete:
 *     summary: Elimina una especie por ID
 *     tags: [Especies]
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
 *         description: Especie eliminada correctamente
 *       404:
 *         description: No se pudo eliminar la especie
 */
RouterEspecies.delete("/especies/:id", verificarToken, deleteEspecies);

export default RouterEspecies;
