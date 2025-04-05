import { Router } from "express";
import verificarToken from "../../usuarios/middlewares/verificarToken.js";
import { 
    postTipo_especie, 
    getTipo_especie, 
    getIdTipo_especie, 
    updateTipo_especie, 
    deleteTipo_especie 
} from "../controller/controller.tipo_especie.js";

const RouterTipo_especie = Router();

/**
 * @swagger
 * tags:
 *   name: Tipo de Especie
 *   description: Gestión de los tipos de especies
 */

/**
 * @swagger
 * /tipo_especie:
 *   post:
 *     summary: Crea un nuevo tipo de especie
 *     tags: [Tipo de Especie]
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
 *                 description: Nombre del tipo de especie
 *               descripcion:
 *                 type: string
 *                 description: Descripción del tipo de especie
 *               img:
 *                 type: string
 *                 description: URL de la imagen del tipo de especie
 *     responses:
 *       201:
 *         description: Tipo de especie creado con éxito
 *       400:
 *         description: Error en la solicitud
 */
RouterTipo_especie.post("/tipo_especie", verificarToken, postTipo_especie);

/**
 * @swagger
 * /tipo_especie:
 *   get:
 *     summary: Obtiene todos los tipos de especies
 *     tags: [Tipo de Especie]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tipos de especies obtenida con éxito
 *       401:
 *         description: No autorizado
 */
RouterTipo_especie.get("/tipo_especie", verificarToken, getTipo_especie);

/**
 * @swagger
 * /tipo_especie/{id}:
 *   get:
 *     summary: Obtiene un tipo de especie por ID
 *     tags: [Tipo de Especie]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tipo de especie a buscar
 *     responses:
 *       200:
 *         description: Tipo de especie encontrado con éxito
 *       404:
 *         description: Tipo de especie no encontrado
 */
RouterTipo_especie.get("/tipo_especie/:id", verificarToken, getIdTipo_especie);

/**
 * @swagger
 * /tipo_especie/{id}:
 *   put:
 *     summary: Actualiza un tipo de especie por ID
 *     tags: [Tipo de Especie]
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
 *                 description: Nuevo nombre del tipo de especie
 *               descripcion:
 *                 type: string
 *                 description: Nueva descripción del tipo de especie
 *               img:
 *                 type: string
 *                 description: Nueva URL de la imagen del tipo de especie
 *     responses:
 *       200:
 *         description: Tipo de especie actualizado con éxito
 *       400:
 *         description: Error en la solicitud
 *       404:
 *         description: Tipo de especie no encontrado
 */
RouterTipo_especie.put("/tipo_especie/:id", verificarToken, updateTipo_especie);

/**
 * @swagger
 * /tipo_especie/{id}:
 *   delete:
 *     summary: Elimina un tipo de especie por ID
 *     tags: [Tipo de Especie]
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
 *         description: Tipo de especie eliminado con éxito
 *       404:
 *         description: Tipo de especie no encontrado
 */
RouterTipo_especie.delete("/tipo_especie/:id", verificarToken, deleteTipo_especie);

export default RouterTipo_especie;
