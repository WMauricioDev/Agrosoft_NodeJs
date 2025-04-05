import { Router } from "express";
import verificarToken from "../../usuarios/middlewares/verificarToken.js";
import { registrarRegistroVenta, listarRegistroVenta, actualizarRegistroVenta, eliminarRegistroVenta } from "../controllers/registroVentaController.js";

const rutaVenta = Router();

/**
 * @swagger
 * tags:
 *   name: RegistroVentas
 *   description: Endpoints para gestionar los registros de ventas
 */

/**
 * @swagger
 * /registroventas:
 *   post:
 *     summary: Registrar un nuevo registro de venta
 *     tags: [RegistroVentas]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fk_venta:
 *                 type: integer
 *                 example: 1
 *               cantidad_vendida:
 *                 type: integer
 *                 example: 50
 *               precio_unitario:
 *                 type: number
 *                 example: 1200.50
 *               ingresos_venta:
 *                 type: number
 *                 example: 60025.00
 *               fecha_venta:
 *                 type: string
 *                 format: date
 *                 example: "2024-02-20"
 *     responses:
 *       201:
 *         description: Registro de venta agregado correctamente
 */
rutaVenta.post("/registroventas", verificarToken, registrarRegistroVenta);

/**
 * @swagger
 * /registroventas:
 *   get:
 *     summary: Obtener todos los registros de ventas
 *     tags: [RegistroVentas]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de registros obtenida con éxito
 */
rutaVenta.get("/registroventas", verificarToken, listarRegistroVenta);

/**
 * @swagger
 * /registroventas/{id}:
 *   put:
 *     summary: Actualizar un registro de venta por ID
 *     tags: [RegistroVentas]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del registro de venta a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fk_venta:
 *                 type: integer
 *                 example: 1
 *               cantidad_vendida:
 *                 type: integer
 *                 example: 60
 *               precio_unitario:
 *                 type: number
 *                 example: 1300.00
 *               ingresos_venta:
 *                 type: number
 *                 example: 78000.00
 *               fecha_venta:
 *                 type: string
 *                 format: date
 *                 example: "2024-03-15"
 *     responses:
 *       200:
 *         description: Registro de venta actualizado correctamente
 */
rutaVenta.put("/registroventas/:id", verificarToken, actualizarRegistroVenta);

/**
 * @swagger
 * /registroventas/{id}:
 *   delete:
 *     summary: Eliminar un registro de venta por ID
 *     tags: [RegistroVentas]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del registro de venta a eliminar
 *     responses:
 *       200:
 *         description: Registro de venta eliminado correctamente
 */
rutaVenta.delete("/registroventas/:id", verificarToken, eliminarRegistroVenta);

export default rutaVenta;
