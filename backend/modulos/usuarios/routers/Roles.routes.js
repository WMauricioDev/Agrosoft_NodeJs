import { Router } from 'express';
import {
  listarRoles,
  RegistrarRoles,
  ActualizarRoles,
  EliminarRoles
} from '../controllers/Roles.controllers.js';
import verificarToken from '../middlewares/verificarToken.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: API para la gestión de roles de usuario
 */

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Lista todos los roles disponibles
 *     tags: [Roles]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de roles obtenida con éxito
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
 *                   nombre_rol:
 *                     type: string
 *                     example: "Administrador"
 */
router.get('/roles', listarRoles);

/**
 * @swagger
 * /roles:
 *   post:
 *     summary: Crea un nuevo rol (máximo 5 roles permitidos)
 *     tags: [Roles]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_rol:
 *                 type: string
 *                 example: "Supervisor"
 *     responses:
 *       201:
 *         description: Rol creado con éxito
 *       400:
 *         description: Límite de roles alcanzado o solicitud incorrecta
 */
router.post('/roles', verificarToken, RegistrarRoles);

/**
 * @swagger
 * /roles/{id}:
 *   put:
 *     summary: Actualiza un rol existente
 *     tags: [Roles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_rol:
 *                 type: string
 *                 example: "Gerente"
 *     responses:
 *       200:
 *         description: Rol actualizado con éxito
 *       404:
 *         description: Rol no encontrado
 */
router.put('/roles/:id', verificarToken, ActualizarRoles);

/**
 * @swagger
 * /roles/{id}:
 *   delete:
 *     summary: Elimina un rol por su ID
 *     tags: [Roles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol a eliminar
 *     responses:
 *       200:
 *         description: Rol eliminado con éxito
 *       404:
 *         description: Rol no encontrado
 */
router.delete('/roles/:id', verificarToken, EliminarRoles);

export default router;
