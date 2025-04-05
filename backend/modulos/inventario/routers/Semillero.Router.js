import { Router } from "express";
import {
    registrarSemillero,
    listarSemilleros,
    actualizarSemillero,
    eliminarSemillero,
} from "../controllers/Semillero.Controller.js";

import verificarToken from "../../usuarios/middlewares/verificarToken.js";

const rutaSemillero = Router();

/**
 * @swagger
 * tags:
 *   name: Semilleros
 *   description: Endpoints para la gestión de semilleros
 */

/**
 * @swagger
 * /semilleros:
 *   get:
 *     summary: Obtener la lista de semilleros
 *     tags: [Semilleros]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de semilleros obtenida correctamente
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
 *                   unidad_medida:
 *                     type: string
 *                     example: "Kilogramos"
 *                   fecha_siembra:
 *                     type: string
 *                     format: date
 *                     example: "2024-01-15"
 *                   fecha_estimada:
 *                     type: string
 *                     format: date
 *                     example: "2024-06-15"
 *                   especie:
 *                     type: string
 *                     example: "Tomate"
 *                   descripcion:
 *                     type: string
 *                     example: "Planta de tomate roja"
 *                   img:
 *                     type: string
 *                     example: "https://imagen.com/tomate.jpg"
 *                   tiempo_crecimiento:
 *                     type: integer
 *                     example: 150
 */
rutaSemillero.get("/semilleros", verificarToken, listarSemilleros);

/**
 * @swagger
 * /semilleros:
 *   post:
 *     summary: Registrar un nuevo semillero
 *     tags: [Semilleros]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fk_especie:
 *                 type: integer
 *                 example: 1
 *               unidad_medida:
 *                 type: string
 *                 example: "Kilogramos"
 *               fecha_siembra:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-15"
 *               fecha_estimada:
 *                 type: string
 *                 format: date
 *                 example: "2024-06-15"
 *     responses:
 *       201:
 *         description: Semillero registrado correctamente
 */
rutaSemillero.post("/semilleros", verificarToken, registrarSemillero);

/**
 * @swagger
 * /semilleros/{id}:
 *   put:
 *     summary: Actualizar los datos de un semillero
 *     tags: [Semilleros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del semillero a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fk_especie:
 *                 type: integer
 *                 example: 2
 *               unidad_medida:
 *                 type: string
 *                 example: "Litros"
 *               fecha_siembra:
 *                 type: string
 *                 format: date
 *                 example: "2024-02-20"
 *               fecha_estimada:
 *                 type: string
 *                 format: date
 *                 example: "2024-07-20"
 *     responses:
 *       200:
 *         description: Semillero actualizado correctamente
 */
rutaSemillero.put("/semilleros/:id", verificarToken, actualizarSemillero);

/**
 * @swagger
 * /semilleros/{id}:
 *   delete:
 *     summary: Eliminar un semillero
 *     tags: [Semilleros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del semillero a eliminar
 *     responses:
 *       200:
 *         description: Semillero eliminado correctamente
 */
rutaSemillero.delete("/semilleros/:id", verificarToken, eliminarSemillero);

export default rutaSemillero;
