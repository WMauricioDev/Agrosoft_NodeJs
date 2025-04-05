import { Router } from "express";
import {
    registrarSalario,
    listarSalarios,
    actualizarSalario,
    eliminarSalario,
} from "../controllers/salarioMinimoController.js";

import verificarToken from "../../usuarios/middlewares/verificarToken.js";

const rutaSalario = Router();

/**
 * @swagger
 * tags:
 *   name: Salarios
 *   description: API para la gestión del salario mínimo
 */

/**
 * @swagger
 * /salarios:
 *   get:
 *     summary: Obtener todos los salarios mínimos registrados
 *     tags: [Salarios]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de salarios obtenida correctamente
 *       404:
 *         description: No hay registros de salarios
 *       500:
 *         description: Error en el servidor
 */
rutaSalario.get("/salarios", verificarToken, listarSalarios);

/**
 * @swagger
 * /salarios:
 *   post:
 *     summary: Registrar un nuevo salario mínimo
 *     tags: [Salarios]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               valor:
 *                 type: number
 *                 description: Valor del salario mínimo
 *               fecha_aplicacion:
 *                 type: string
 *                 format: date
 *                 description: Fecha de aplicación del salario
 *     responses:
 *       201:
 *         description: Salario registrado correctamente
 *       400:
 *         description: Salario no registrado
 *       500:
 *         description: Error en el servidor
 */
rutaSalario.post("/salarios", verificarToken, registrarSalario);

/**
 * @swagger
 * /salarios/{id}:
 *   put:
 *     summary: Actualizar un salario mínimo
 *     tags: [Salarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del salario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               valor:
 *                 type: number
 *               fecha_aplicacion:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Salario actualizado correctamente
 *       404:
 *         description: Salario no encontrado
 *       500:
 *         description: Error en el servidor
 */
rutaSalario.put("/salarios/:id", verificarToken, actualizarSalario);

/**
 * @swagger
 * /salarios/{id}:
 *   delete:
 *     summary: Eliminar un salario mínimo
 *     tags: [Salarios]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del salario a eliminar
 *     responses:
 *       200:
 *         description: Salario eliminado correctamente
 *       404:
 *         description: Salario no encontrado
 *       500:
 *         description: Error en el servidor
 */
rutaSalario.delete("/salarios/:id", verificarToken, eliminarSalario);

export default rutaSalario;