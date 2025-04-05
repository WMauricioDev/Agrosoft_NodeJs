import { Router } from "express";
import {
    registrarBodega,
    listarBodega,
    actualizarBodega,
    eliminarBodega,
} from "../controllers/Bodega.Controller.js";

import verificarToken from "../../usuarios/middlewares/verificarToken.js";

const rutaBodega = Router();

/**
 * @swagger
 * tags:
 *   name: Bodega
 *   description: Endpoints para gestionar las bodegas
 */

/**
 * @swagger
 * /bodega:
 *   get:
 *     summary: Obtener la lista de bodegas registradas
 *     tags: [Bodega]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de bodegas obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_bodega:
 *                     type: integer
 *                     example: 1
 *                   nombre:
 *                     type: string
 *                     example: "Bodega Central"
 *                   ubicacion:
 *                     type: string
 *                     example: "Calle 123, Ciudad"
 *                   tipo_bodega:
 *                     type: string
 *                     example: "Almacén principal"
 */
rutaBodega.get("/bodega", verificarToken, listarBodega);

/**
 * @swagger
 * /bodega:
 *   post:
 *     summary: Registrar una nueva bodega
 *     tags: [Bodega]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Bodega Central"
 *               ubicacion:
 *                 type: string
 *                 example: "Calle 123, Ciudad"
 *               tipo_bodega:
 *                 type: string
 *                 example: "Almacén principal"
 *     responses:
 *       201:
 *         description: Bodega registrada correctamente
 */
rutaBodega.post("/bodega", verificarToken, registrarBodega);

/**
 * @swagger
 * /bodega/{id_bodega}:
 *   put:
 *     summary: Actualizar los datos de una bodega
 *     tags: [Bodega]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_bodega
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la bodega a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Bodega Norte"
 *               ubicacion:
 *                 type: string
 *                 example: "Avenida 456, Ciudad"
 *               tipo_bodega:
 *                 type: string
 *                 example: "Depósito secundario"
 *     responses:
 *       200:
 *         description: Bodega actualizada correctamente
 */
rutaBodega.put("/bodega/:id_bodega", verificarToken, actualizarBodega);

/**
 * @swagger
 * /bodega/{id_bodega}:
 *   delete:
 *     summary: Eliminar una bodega registrada
 *     tags: [Bodega]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_bodega
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la bodega a eliminar
 *     responses:
 *       200:
 *         description: Bodega eliminada correctamente
 */
rutaBodega.delete("/bodega/:id_bodega", verificarToken, eliminarBodega);

export default rutaBodega;
