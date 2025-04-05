import { Router } from "express";
import verificarToken from "../../usuarios/middlewares/verificarToken.js";
import { registrarInventarioProducto, listarInventarioProducto, actualizarInventarioProducto, eliminarInventarioProducto } from "../controllers/inventarioProductoController.js";

const rutaInventario = Router();

/**
 * @swagger
 * tags:
 *   name: Inventario
 *   description: Endpoints para gestionar el inventario de productos
 */

/**
 * @swagger
 * /inventario:
 *   post:
 *     summary: Registrar un nuevo producto en el inventario
 *     tags: [Inventario]
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
 *               fk_venta:
 *                 type: integer
 *                 example: 2
 *               nombre:
 *                 type: string
 *                 example: "Lechuga"
 *               cantidad_disponible:
 *                 type: integer
 *                 example: 100
 *               costo_unitario:
 *                 type: number
 *                 example: 850.75
 *     responses:
 *       201:
 *         description: Producto registrado correctamente en el inventario
 */
rutaInventario.post("/inventario", verificarToken, registrarInventarioProducto);

/**
 * @swagger
 * /inventario:
 *   get:
 *     summary: Obtener todos los productos en el inventario
 *     tags: [Inventario]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de productos obtenida con éxito
 */
rutaInventario.get("/inventario", verificarToken, listarInventarioProducto);

/**
 * @swagger
 * /inventario/{id}:
 *   put:
 *     summary: Actualizar un producto en el inventario por ID
 *     tags: [Inventario]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto a actualizar
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
 *               fk_venta:
 *                 type: integer
 *                 example: 2
 *               nombre:
 *                 type: string
 *                 example: "Lechuga"
 *               cantidad_disponible:
 *                 type: integer
 *                 example: 120
 *               costo_unitario:
 *                 type: number
 *                 example: 900.00
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente
 */
rutaInventario.put("/inventario/:id", verificarToken, actualizarInventarioProducto);

/**
 * @swagger
 * /inventario/{id}:
 *   delete:
 *     summary: Eliminar un producto del inventario por ID
 *     tags: [Inventario]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto a eliminar
 *     responses:
 *       200:
 *         description: Producto eliminado correctamente
 */
rutaInventario.delete("/inventario/:id", verificarToken, eliminarInventarioProducto);

export default rutaInventario;
