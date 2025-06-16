import { Router } from "express";
import verificarToken from "../../usuarios/middlewares/verificarToken.js";
import { registrarVenta, listarVentas, actualizarVenta, eliminarVenta, registrarDetalleVenta, listarDetalleVentas } from "../controllers/ventaController.js";

const rutaVenta = Router();

/**
 * @swagger
 * tags:
 *   name: Ventas
 *   description: Endpoints para gestionar las ventas
 */

/**
 * @swagger
 * /ventas:
 *   get:
 *     summary: Obtener todas las ventas registradas
 *     tags: [Ventas]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de ventas obtenida con éxito
 */
rutaVenta.get("/venta", verificarToken, listarVentas);

/**
 * @swagger
 * /ventas:
 *   post:
 *     summary: Registrar una nueva venta
 *     tags: [Ventas]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fk_cosecha:
 *                 type: integer
 *                 example: 1
 *               precio_unitario:
 *                 type: number
 *                 example: 1500.50
 *               producto_vendido:
 *                 type: string
 *                 example: "Tomate"
 *               cantidad:
 *                 type: integer
 *                 example: 20
 *               fecha_venta:
 *                 type: string
 *                 format: date
 *                 example: "2025-02-20"
 *     responses:
 *       201:
 *         description: Venta registrada correctamente
 */
rutaVenta.post("/venta", verificarToken, registrarVenta);

/**
 * @swagger
 * /ventas/{id}:
 *   put:
 *     summary: Actualizar una venta por ID
 *     tags: [Ventas]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la venta a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fk_cosecha:
 *                 type: integer
 *                 example: 1
 *               precio_unitario:
 *                 type: number
 *                 example: 1600.00
 *               producto_vendido:
 *                 type: string
 *                 example: "Tomate"
 *               cantidad:
 *                 type: integer
 *                 example: 25
 *               fecha_venta:
 *                 type: string
 *                 format: date
 *                 example: "2025-03-01"
 *     responses:
 *       200:
 *         description: Venta actualizada correctamente
 */
rutaVenta.put("/venta/:id", verificarToken, actualizarVenta);

/**
 * @swagger
 * /ventas/{id}:
 *   delete:
 *     summary: Eliminar una venta por ID
 *     tags: [Ventas]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la venta a eliminar
 *     responses:
 *       200:
 *         description: Venta eliminada correctamente
 */
rutaVenta.delete("/venta/:id", verificarToken, eliminarVenta);

rutaVenta.post("/venta/:id/detalles", verificarToken, registrarDetalleVenta);
rutaVenta.get("/venta/:id/detalles", verificarToken, listarDetalleVentas);


export default rutaVenta;
