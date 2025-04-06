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
 * /api/cultivo/especies:
 *   post:
 *     summary: Registra una nueva especie
 *     tags: [Especies]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               largoCrecimiento:
 *                 type: integer
 *               fk_tipo_especie:
 *                 type: integer
 *               img:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Especie registrada correctamente
 *       400:
 *         description: Error en la solicitud
 */
RouterEspecies.post("/especies", verificarToken, postEspecies);

/**
 * @swagger
 * /api/cultivo/especies:
 *   get:
 *     summary: Obtiene todas las especies registradas
 *     tags: [Especies]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de especies
 *       401:
 *         description: No autorizado
 */
RouterEspecies.get("/especies", verificarToken, getEspecies);

/**
 * @swagger
 * /api/cultivo/especies/{id}:
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
 *       404:
 *         description: Especie no encontrada
 */
RouterEspecies.get("/especies/:id", verificarToken, getIdEspecies);

/**
 * @swagger
 * /api/cultivo/especies/{id}:
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
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               largoCrecimiento:
 *                 type: integer
 *               fk_tipo_especie:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Especie actualizada correctamente
 *       400:
 *         description: Error en la solicitud
 *       404:
 *         description: Especie no encontrada
 */
RouterEspecies.put("/especies/:id", verificarToken, updateEspecies);

/**
 * @swagger
 * /api/cultivo/especies/{id}:
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