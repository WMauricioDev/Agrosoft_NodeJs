import { Router } from "express";
import verificarToken from "../../usuarios/middlewares/verificarToken.js";
import { listarInsumos, registrarInsumo, actualizarInsumo, eliminarInsumo, registrarTipoInsumo,obtenerTiposInsumo } from "../controllers/Insumos.Controller.js";

const rutaInsumos = Router();

/**
 * @swagger
 * tags:
 *   name: Insumos
 *   description: API para la gestión de insumos
 *   name: TiposInsumos
 *   description: API para la gestión de tipos de insumos
 */

/**
 * @swagger
 * /insumos:
 *   get:
 *     summary: Obtener todos los insumos
 *     tags: [Insumos]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de insumos obtenida correctamente
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
 *                   descripcion:
 *                     type: string
 *                   cantidad:
 *                     type: integer
 *                   unidad_medida_id:
 *                     type: integer
 *                     nullable: true
 *                   tipo_insumo_id:
 *                     type: integer
 *                     nullable: true
 *                   activo:
 *                     type: boolean
 *                   tipo_empacado:
 *                     type: string
 *                     nullable: true
 *                   fecha_registro:
 *                     type: string
 *                     format: date-time
 *                   fecha_caducidad:
 *                     type: string
 *                     format: date
 *                     nullable: true
 *                   precio_insumo:
 *                     type: number
 *                     format: decimal
 *       500:
 *         description: Error en el servidor
 */
rutaInsumos.get("/insumos", verificarToken, listarInsumos);

/**
 * @swagger
 * /insumos:
 *   post:
 *     summary: Registrar un nuevo insumo
 *     tags: [Insumos]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - descripcion
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del insumo (máximo 255 caracteres)
 *               descripcion:
 *                 type: string
 *                 description: Descripción del insumo
 *               cantidad:
 *                 type: integer
 *                 description: Cantidad del insumo (por defecto 1)
 *                 default: 1
 *               unidad_medida_id:
 *                 type: integer
 *                 description: ID de la unidad de medida (opcional)
 *                 nullable: true
 *               tipo_insumo_id:
 *                 type: integer
 *                 description: ID del tipo de insumo (opcional)
 *                 nullable: true
 *               activo:
 *                 type: boolean
 *                 description: Estado del insumo (por defecto true)
 *                 default: true
 *               tipo_empacado:
 *                 type: string
 *                 description: Tipo de empaque del insumo (opcional, máximo 100 caracteres)
 *                 nullable: true
 *               fecha_caducidad:
 *                 type: string
 *                 format: date
 *                 description: Fecha de caducidad del insumo (opcional)
 *                 nullable: true
 *               precio_insumo:
 *                 type: number
 *                 format: decimal
 *                 description: Precio del insumo (por defecto 0.00)
 *                 default: 0.00
 *     responses:
 *       200:
 *         description: Insumo registrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 id:
 *                   type: integer
 *       500:
 *         description: Error en el servidor
 */
rutaInsumos.post("/insumos", verificarToken, registrarInsumo);

/**
 * @swagger
 * /insumos/{id}:
 *   put:
 *     summary: Actualizar un insumo
 *     tags: [Insumos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del insumo a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - descripcion
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del insumo (máximo 255 caracteres)
 *               descripcion:
 *                 type: string
 *                 description: Descripción del insumo
 *               cantidad:
 *                 type: integer
 *                 description: Cantidad del insumo (por defecto 1)
 *                 default: 1
 *               unidad_medida_id:
 *                 type: integer
 *                 description: ID de la unidad de medida (opcional)
 *                 nullable: true
 *               tipo_insumo_id:
 *                 type: integer
 *                 description: ID del tipo de insumo (opcional)
 *                 nullable: true
 *               activo:
 *                 type: boolean
 *                 description: Estado del insumo (por defecto true)
 *                 default: true
 *               tipo_empacado:
 *                 type: string
 *                 description: Tipo de empaque del insumo (opcional, máximo 100 caracteres)
 *                 nullable: true
 *               fecha_caducidad:
 *                 type: string
 *                 format: date
 *                 description: Fecha de caducidad del insumo (opcional)
 *                 nullable: true
 *               precio_insumo:
 *                 type: number
 *                 format: decimal
 *                 description: Precio del insumo (por defecto 0.00)
 *                 default: 0.00
 *     responses:
 *       200:
 *         description: Insumo actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Insumo no encontrado
 *       500:
 *         description: Error en el servidor
 */
rutaInsumos.put("/insumos/:id", verificarToken, actualizarInsumo);

/**
 * @swagger
 * /insumos/{id}:
 *   delete:
 *     summary: Eliminar un insumo
 *     tags: [Insumos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del insumo a eliminar
 *     responses:
 *       200:
 *         description: Insumo eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Insumo no encontrado
 *       500:
 *         description: Error en el servidor
 */
rutaInsumos.delete("/insumos/:id", verificarToken, eliminarInsumo);

/**
 * @swagger
 * /tipos-insumos:
 *   post:
 *     summary: Registrar un nuevo tipo de insumo
 *     tags: [TiposInsumos]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del tipo de insumo (máximo 50 caracteres, único)
 *               descripcion:
 *                 type: string
 *                 description: Descripción del tipo de insumo (opcional)
 *                 nullable: true
 *               creada_por_usuario:
 *                 type: boolean
 *                 description: Indica si fue creado por un usuario (por defecto false)
 *                 default: false
 *     responses:
 *       200:
 *         description: Tipo de insumo registrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 id:
 *                   type: integer
 *       400:
 *         description: Error de validación (nombre inválido o duplicado)
 *       500:
 *         description: Error en el servidor
 */
rutaInsumos.post("/tipos_insumo", verificarToken, registrarTipoInsumo);
rutaInsumos.get("/tipos_insumo", verificarToken, obtenerTiposInsumo);

export default rutaInsumos;