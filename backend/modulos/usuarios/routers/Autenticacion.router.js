import { Router } from "express";
import CrearToken from "../controllers/Autenticacion.controller.js";

const ruta = Router();

/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: API para autenticación de usuarios
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Autentica un usuario y genera un token JWT
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               identificacion:
 *                 type: string
 *                 example: "123456789"
 *               password:
 *                 type: string
 *                 example: "contraseñaSegura"
 *     responses:
 *       200:
 *         description: Autenticación exitosa, devuelve el token JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Autenticación exitosa"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     identificacion:
 *                       type: string
 *                       example: "123456789"
 *                     nombre:
 *                       type: string
 *                       example: "Juan Perez"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Identificación y contraseña son obligatorias
 *       401:
 *         description: Credenciales incorrectas
 *       500:
 *         description: Error en el servidor
 */
ruta.post("/login", CrearToken);

export default ruta;
