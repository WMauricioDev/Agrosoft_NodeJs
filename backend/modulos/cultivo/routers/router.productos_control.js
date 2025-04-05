import { Router } from "express";
import verificarToken from "../../usuarios/middlewares/verificarToken.js";
import { 
    postProductos_control, 
    getProductos_control, 
    getIdProductos_control, 
    updateProductos_control, 
    deleteProductos_control 
} from "../controller/controller.productos_control.js";

const RouterProductos_control = Router();

/**
 * @swagger
 * tags:
 *   name: Productos de Control
 *   description: Gestión de productos utilizados para el control de plagas y enfermedades
 */

/**
 * @swagger
 * /productos_control:
 *   post:
 *     summary: Crea un nuevo producto de control
 *     tags: [Productos de Control]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del producto
 *               precio:
 *                 type: number
 *                 description: Precio del producto
 *               ficha_tecnica:
 *                 type: string
 *                 description: URL de la ficha técnica
 *               contenido:
 *                 type: number
 *                 description: Cantidad de contenido
 *               tipo_contenido:
 *                 type: string
 *                 description: Tipo de contenido (ml, g, etc.)
 *               unidades:
 *                 type: integer
 *                 description: Número de unidades disponibles
 *     responses:
 *       201:
 *         description: Producto de control creado con éxito
 *       400:
 *         description: Error en la solicitud
 */
RouterProductos_control.post("/productos_control", verificarToken, postProductos_control);

/**
 * @swagger
 * /productos_control:
 *   get:
 *     summary: Obtiene todos los productos de control registrados
 *     tags: [Productos de Control]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de productos obtenida con éxito
 *       401:
 *         description: No autorizado
 */
RouterProductos_control.get("/productos_control", verificarToken, getProductos_control);

/**
 * @swagger
 * /productos_control/{id}:
 *   get:
 *     summary: Obtiene un producto de control por ID
 *     tags: [Productos de Control]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto de control a buscar
 *     responses:
 *       200:
 *         description: Producto de control encontrado con éxito
 *       404:
 *         description: Producto no encontrado
 */
RouterProductos_control.get("/productos_control/:id", verificarToken, getIdProductos_control);

/**
 * @swagger
 * /productos_control/{id}:
 *   put:
 *     summary: Actualiza un producto de control por ID
 *     tags: [Productos de Control]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto de control a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre actualizado del producto
 *               precio:
 *                 type: number
 *                 description: Precio actualizado del producto
 *               ficha_tecnica:
 *                 type: string
 *                 description: URL actualizada de la ficha técnica
 *               contenido:
 *                 type: number
 *                 description: Cantidad de contenido actualizado
 *               tipo_contenido:
 *                 type: string
 *                 description: Tipo de contenido actualizado (ml, g, etc.)
 *               unidades:
 *                 type: integer
 *                 description: Número de unidades actualizado
 *     responses:
 *       200:
 *         description: Producto de control actualizado con éxito
 *       400:
 *         description: Error en la solicitud
 *       404:
 *         description: Producto no encontrado
 */
RouterProductos_control.put("/productos_control/:id", verificarToken, updateProductos_control);

/**
 * @swagger
 * /productos_control/{id}:
 *   delete:
 *     summary: Elimina un producto de control por ID
 *     tags: [Productos de Control]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto de control a eliminar
 *     responses:
 *       200:
 *         description: Producto de control eliminado con éxito
 *       404:
 *         description: Producto no encontrado
 */
RouterProductos_control.delete("/productos_control/:id", verificarToken, deleteProductos_control);

export default RouterProductos_control;
