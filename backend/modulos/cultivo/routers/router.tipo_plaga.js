import { Router } from "express";
import upload from "../../usuarios/middlewares/Multer.js";
import verificarToken from "../../usuarios/middlewares/verificarToken.js";
import { 
    postTipo_plaga, 
    getTipo_plaga, 
    getIdTipo_plaga, 
    updateTipo_plaga, 
    deleteTipo_plaga 
} from "../controller/controller.tipo_plaga.js";

const RouterTipo_plaga = Router();

/**
 * @swagger
 * tags:
 *   name: Tipo de Plaga
 *   description: Gestión de los tipos de plagas
 */

/**
 * @swagger
 * /tipo_plaga:
 *   post:
 *     summary: Crea un nuevo tipo de plaga
 *     tags: [Tipo de Plaga]
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
 *                 description: Nombre del tipo de plaga
 *               descripcion:
 *                 type: string
 *                 description: Descripción del tipo de plaga
 *               img:
 *                 type: string
 *                 description: URL de la imagen del tipo de plaga
 *     responses:
 *       201:
 *         description: Tipo de plaga creado con éxito
 *       400:
 *         description: Error en la solicitud
 */
RouterTipo_plaga.post("/tipo_plaga", upload.single("img"), verificarToken, postTipo_plaga);

/**
 * @swagger
 * /tipo_plaga:
 *   get:
 *     summary: Obtiene todos los tipos de plagas
 *     tags: [Tipo de Plaga]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tipos de plagas obtenida con éxito
 *       401:
 *         description: No autorizado
 */
RouterTipo_plaga.get("/tipo_plaga", verificarToken, getTipo_plaga);

/**
 * @swagger
 * /tipo_plaga/{id}:
 *   get:
 *     summary: Obtiene un tipo de plaga por ID
 *     tags: [Tipo de Plaga]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tipo de plaga a buscar
 *     responses:
 *       200:
 *         description: Tipo de plaga encontrado con éxito
 *       404:
 *         description: Tipo de plaga no encontrado
 */
RouterTipo_plaga.get("/tipo_plaga/:id", verificarToken, getIdTipo_plaga);

/**
 * @swagger
 * /tipo_plaga/{id}:
 *   put:
 *     summary: Actualiza un tipo de plaga por ID
 *     tags: [Tipo de Plaga]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tipo de plaga a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nuevo nombre del tipo de plaga
 *               descripcion:
 *                 type: string
 *                 description: Nueva descripción del tipo de plaga
 *               img:
 *                 type: string
 *                 description: Nueva URL de la imagen del tipo de plaga
 *     responses:
 *       200:
 *         description: Tipo de plaga actualizado con éxito
 *       400:
 *         description: Error en la solicitud
 *       404:
 *         description: Tipo de plaga no encontrado
 */
RouterTipo_plaga.put("/tipo_plaga/:id", verificarToken, updateTipo_plaga);

/**
 * @swagger
 * /tipo_plaga/{id}:
 *   delete:
 *     summary: Elimina un tipo de plaga por ID
 *     tags: [Tipo de Plaga]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tipo de plaga a eliminar
 *     responses:
 *       200:
 *         description: Tipo de plaga eliminado con éxito
 *       404:
 *         description: Tipo de plaga no encontrado
 */
RouterTipo_plaga.delete("/tipo_plaga/:id", verificarToken, deleteTipo_plaga);

export default RouterTipo_plaga;
