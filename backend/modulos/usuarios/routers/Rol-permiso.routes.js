import { Router } from 'express';
import {
  listarPermisosRol,
  AsignarPermisoRol,
  EliminarPermisoRol
} from '../controllers/RolPermiso.controllers.js';
import verificarToken from '../middlewares/verificarToken.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: RolPermisos
 *   description: API para la gestión de permisos asignados a roles
 */

/**
 * @swagger
 * /rol-permisos:
 *   get:
 *     summary: Lista los permisos asignados a los roles
 *     tags: [RolPermisos]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de permisos asignados a roles obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   fk_rol:
 *                     type: integer
 *                     example: 2
 *                   fk_permiso:
 *                     type: integer
 *                     example: 5
 *                   nombre_rol:
 *                     type: string
 *                     example: "Administrador"
 *                   nombre_permiso:
 *                     type: string
 *                     example: "Editar usuarios"
 */
router.get('/rol-permisos', listarPermisosRol);

/**
 * @swagger
 * /rol-permisos:
 *   post:
 *     summary: Asigna un permiso a un rol
 *     tags: [RolPermisos]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fk_rol:
 *                 type: integer
 *                 example: 3
 *               fk_permiso:
 *                 type: integer
 *                 example: 7
 *     responses:
 *       201:
 *         description: Permiso asignado con éxito al rol
 *       400:
 *         description: Error en la solicitud
 */
router.post('/rol-permisos', verificarToken, AsignarPermisoRol);

/**
 * @swagger
 * /rol-permisos/{fk_rol}/{fk_permiso}:
 *   delete:
 *     summary: Elimina un permiso de un rol
 *     tags: [RolPermisos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fk_rol
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol
 *       - in: path
 *         name: fk_permiso
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del permiso
 *     responses:
 *       200:
 *         description: Permiso eliminado con éxito del rol
 *       404:
 *         description: Relación no encontrada
 */
router.delete('/rol-permisos/:fk_rol/:fk_permiso', verificarToken, EliminarPermisoRol);

export default router;
