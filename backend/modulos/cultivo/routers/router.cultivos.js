import { Router } from "express";
import verificarToken from "../../usuarios/middlewares/verificarToken.js";
import { postCultivos, getCultivos, getIdCultivos, updateCultivos, deleteCultivos } from "../controller/controller.cultivos.js";

const RouterCultivos = Router();

/**
 * @swagger
 * tags:
 *   name: Cultivos
 *   description: Endpoints para la gestión de cultivos
 */

/**
 * @swagger
 * /cultivos:
 *   post:
 *     summary: Registra un nuevo cultivo
 *     tags: [Cultivos]
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
 *               unidad_de_medida:
 *                 type: string
 *               estado:
 *                 type: string
 *               fecha_siembra:
 *                 type: string
 *                 format: date
 *               fk_especie:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Cultivo registrado correctamente
 *       400:
 *         description: Error en la solicitud
 */
RouterCultivos.post("/cultivos", verificarToken, postCultivos);

/**
 * @swagger
 * /cultivos:
 *   get:
 *     summary: Obtiene todos los cultivos registrados
 *     tags: [Cultivos]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de cultivos
 *       401:
 *         description: No autorizado
 */
RouterCultivos.get("/cultivos", verificarToken, getCultivos);

/**
 * @swagger
 * /cultivos/{id}:
 *   get:
 *     summary: Obtiene un cultivo por ID
 *     tags: [Cultivos]
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
 *         description: Datos del cultivo
 *       404:
 *         description: Cultivo no encontrado
 */
RouterCultivos.get("/cultivos/:id", verificarToken, getIdCultivos);

/**
 * @swagger
 * /cultivos/{id}:
 *   put:
 *     summary: Actualiza un cultivo por ID
 *     tags: [Cultivos]
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
 *               unidad_de_medida:
 *                 type: string
 *               estado:
 *                 type: string
 *               fecha_siembra:
 *                 type: string
 *                 format: date
 *               fk_especie:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cultivo actualizado correctamente
 *       400:
 *         description: Error en la solicitud
 */
RouterCultivos.put("/cultivos/:id", verificarToken, updateCultivos);

/**
 * @swagger
 * /cultivos/{id}:
 *   delete:
 *     summary: Elimina un cultivo por ID
 *     tags: [Cultivos]
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
 *         description: Cultivo eliminado correctamente
 *       404:
 *         description: No se pudo eliminar el cultivo
 */
RouterCultivos.delete("/cultivos/:id", verificarToken, deleteCultivos);

export default RouterCultivos;
