import { Router } from 'express';
import {
  listarUsuarios,
  RegistrarUsuarios,
  ActualizarUsuarios,
  EliminarUsuarios,
  BuscarUsuarios,
} from '../controllers/Usuarios.controllers.js';

import verificarToken from '../middlewares/verificarToken.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Usuarios
 *     description: Gestión de usuarios
 */

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               identificacion:
 *                 type: string
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               fecha_nacimiento:
 *                 type: string
 *                 format: date
 *               telefono:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               area_desarrollo:
 *                 type: string
 *               cargo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Datos faltantes o incorrectos
 */
router.post('/usuarios', verificarToken, RegistrarUsuarios);

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Obtiene la lista de todos los usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nombre:
 *                     type: string
 *                   email:
 *                     type: string
 */
router.get('/usuarios', verificarToken, listarUsuarios);

/**
 * @swagger
 * /usuarios/{identificacion}:
 *   get:
 *     summary: Busca un usuario por su identificación
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: identificacion
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificación del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/usuarios/:identificacion', verificarToken, BuscarUsuarios);

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Actualiza los datos de un usuario
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado con éxito
 *       404:
 *         description: Usuario no encontrado
 */
router.put('/usuarios/:id', verificarToken, ActualizarUsuarios);

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Elimina un usuario por su ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       404:
 *         description: Usuario no encontrado
 */
router.delete('/usuarios/:id', verificarToken, EliminarUsuarios);

export default router;
