import { Router } from "express";
import {
  listarPermisos,
  RegistrarPermisos,
  ActualizarPermisos,
  EliminarPermisos
} from "../controllers/Permisos.controllers.js";
import verificarToken from "../middlewares/verificarToken.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Permisos
 *   description: API para la gestión de permisos
 */

/**
 * @swagger
 * /permisos:
 *   get:
 *     summary: Lista todos los permisos
 *     tags: [Permisos]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de permisos obtenida con éxito
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
 *                     example: "Administrar usuarios"
 *                   descripcion:
 *                     type: string
 *                     example: "Permiso para administrar usuarios"
 */
router.get('/permisos', verificarToken, listarPermisos);

/**
 * @swagger
 * /permisos:
 *   post:
 *     summary: Registra un nuevo permiso
 *     tags: [Permisos]
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
 *                 example: "Editar productos"
 *               descripcion:
 *                 type: string
 *                 example: "Permiso para editar productos"
 *     responses:
 *       201:
 *         description: Permiso registrado con éxito
 *       400:
 *         description: Error en la solicitud
 */
router.post('/permisos', verificarToken, RegistrarPermisos);

/**
 * @swagger
 * /permisos/{id}:
 *   put:
 *     summary: Actualiza un permiso existente
 *     tags: [Permisos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del permiso a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Gestionar pedidos"
 *               descripcion:
 *                 type: string
 *                 example: "Permiso para gestionar pedidos"
 *     responses:
 *       200:
 *         description: Permiso actualizado con éxito
 *       404:
 *         description: Permiso no encontrado
 */
router.put('/permisos/:id', verificarToken, ActualizarPermisos);

/**
 * @swagger
 * /permisos/{id}:
 *   delete:
 *     summary: Elimina un permiso
 *     tags: [Permisos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del permiso a eliminar
 *     responses:
 *       200:
 *         description: Permiso eliminado con éxito
 *       404:
 *         description: Permiso no encontrado
 */
router.delete('/permisos/:id', verificarToken, EliminarPermisos);

export default router;
