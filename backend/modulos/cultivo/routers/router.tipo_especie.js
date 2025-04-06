import { Router } from "express";
import verificarToken from "../../usuarios/middlewares/verificarToken.js";
import { postTipo_especie, getTipo_especie, getIdTipo_especie, updateTipo_especie, deleteTipo_especie } from "../controller/controller.tipo_especie.js";

const RouterTipoEspecie = Router();

/**
 * @swagger
 * tags:
 *   name: Tipos de Especies
 *   description: Endpoints para gestionar tipos de especies
 */

/**
 * @swagger
 * /api/cultivo/tipo_especies:
 *   post:
 *     summary: Registrar un nuevo tipo de especie
 *     tags: [Tipos de Especies]
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
 *                 example: "Frutal"
 *               descripcion:
 *                 type: string
 *                 example: "Especies de árboles frutales"
 *               img:
 *                 type: string
 *                 example: "frutal.jpg"
 *     responses:
 *       201:
 *         description: Tipo de especie registrado correctamente
 *       400:
 *         description: Error en la solicitud
 */
RouterTipoEspecie.post("/tipo_especies", verificarToken, postTipo_especie);

/**
 * @swagger
 * /api/cultivo/tipo_especies:
 *   get:
 *     summary: Obtener la lista de tipos de especies
 *     tags: [Tipos de Especies]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tipos de especies obtenida correctamente
 *       401:
 *         description: No autorizado
 */
RouterTipoEspecie.get("/tipo_especies", verificarToken, getTipo_especie);

/**
 * @swagger
 * /api/cultivo/tipo_especies/{id}:
 *   get:
 *     summary: Obtener un tipo de especie por ID
 *     tags: [Tipos de Especies]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tipo de especie a obtener
 *     responses:
 *       200:
 *         description: Tipo de especie obtenido correctamente
 *       404:
 *         description: Tipo de especie no encontrado
 */
RouterTipoEspecie.get("/tipo_especies/:id", verificarToken, getIdTipo_especie);

/**
 * @swagger
 * /api/cultivo/tipo_especies/{id}:
 *   put:
 *     summary: Actualizar un tipo de especie
 *     tags: [Tipos de Especies]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tipo de especie a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Hortaliza"
 *               descripcion:
 *                 type: string
 *                 example: "Especies de hortalizas"
 *               img:
 *                 type: string
 *                 example: "hortaliza.jpg"
 *     responses:
 *       200:
 *         description: Tipo de especie actualizado correctamente
 *       400:
 *         description: Error en la solicitud
 *       404:
 *         description: Tipo de especie no encontrado
 */
RouterTipoEspecie.put("/tipo_especies/:id", verificarToken, updateTipo_especie);

/**
 * @swagger
 * /api/cultivo/tipo_especies/{id}:
 *   delete:
 *     summary: Eliminar un tipo de especie por ID
 *     tags: [Tipos de Especies]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tipo de especie a eliminar
 *     responses:
 *       200:
 *         description: Tipo de especie eliminado correctamente
 *       404:
 *         description: Tipo de especie no encontrado
 */
RouterTipoEspecie.delete("/tipo_especies/:id", verificarToken, deleteTipo_especie);

export default RouterTipoEspecie;