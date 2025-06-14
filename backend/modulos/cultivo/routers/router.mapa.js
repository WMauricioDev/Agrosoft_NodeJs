import { Router } from "express";
import verificarToken from "../../usuarios/middlewares/verificarToken.js";
import { postMapa, getMapa, updateMapa, getMapaById, deleteMapa } from "../controller/controller.mapa.js";

const RouterMapa = Router();

/**
 * @swagger
 * tags:
 *   name: MapaPunto
 *   description: Endpoints para gestionar los puntos de mapa
 */

/**
 * @swagger
 * /mapa:
 *   post:
 *     summary: Registrar un nuevo punto de mapa
 *     tags: [MapaPunto]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - descripcion
 *               - latitud
 *               - longitud
 *               - usuario_id
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: mandarina
 *               descripcion:
 *                 type: string
 *                 example: tomate verde rayado
 *               latitud:
 *                 type: number
 *                 format: float
 *                 example: 1.892474
 *               longitud:
 *                 type: number
 *                 format: float
 *                 example: -76.091323
 *               usuario_id:
 *                 type: integer
 *                 example: 28
 *               cultivo_id:
 *                 type: integer
 *                 example: 1
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Punto de mapa registrado correctamente
 *       400:
 *         description: Error en la solicitud (datos inválidos)
 *       500:
 *         description: Error en el servidor
 */

RouterMapa.post("/mapa", verificarToken, postMapa);

/**
 * @swagger
 * /mapa:
 *   get:
 *     summary: Obtener la lista de puntos de mapa
 *     tags: [MapaPunto]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de puntos obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 9
 *                   nombre:
 *                     type: string
 *                     example: mandarina
 *                   descripcion:
 *                     type: string
 *                     example: tomate verde rayado
 *                   latitud:
 *                     type: number
 *                     format: float
 *                     example: 1.892474
 *                   longitud:
 *                     type: number
 *                     format: float
 *                     example: -76.091323
 *                   cultivo_nombre:
 *                     type: string
 *                     example: Tomate
 *                   usuario_nombre:
 *                     type: string
 *                     example: Santiago
 */

RouterMapa.get("/mapa", verificarToken, getMapa);

/**
 * @swagger
 * /mapa/{id}:
 *   get:
 *     summary: Obtener un punto de mapa por ID
 *     tags: [MapaPunto]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del punto de mapa a obtener
 *     responses:
 *       200:
 *         description: Punto de mapa obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 9
 *                 nombre:
 *                   type: string
 *                   example: mandarina
 *                 descripcion:
 *                   type: string
 *                   example: tomate verde rayado
 *                 latitud:
 *                   type: number
 *                   format: float
 *                   example: 1.892474
 *                 longitud:
 *                   type: number
 *                   format: float
 *                   example: -76.091323
 *                 cultivo_nombre:
 *                   type: string
 *                   example: Tomate
 *                 usuario_nombre:
 *                   type: string
 *                   example: Santiago
 */

/**
 * @swagger
 * /mapa/{id}:
 *   put:
 *     summary: Actualizar un punto de mapa
 *     tags: [MapaPunto]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del punto de mapa a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: nuevo nombre
 *               descripcion:
 *                 type: string
 *                 example: nueva descripción
 *               latitud:
 *                 type: number
 *                 format: float
 *                 example: 1.900000
 *               longitud:
 *                 type: number
 *                 format: float
 *                 example: -76.090000
 *               cultivo_id:
 *                 type: integer
 *                 example: 1
 *               usuario_id:
 *                 type: integer
 *                 example: 28
 *     responses:
 *       200:
 *         description: Punto de mapa actualizado correctamente
 */
RouterMapa.put("/mapa/:id", verificarToken, updateMapa);
RouterMapa.delete("/mapa/:id", verificarToken, deleteMapa);

export default RouterMapa;
