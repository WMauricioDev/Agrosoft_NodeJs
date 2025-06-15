import { Router } from "express";
import verificarToken from "../../usuarios/middlewares/verificarToken.js";
import {
  registrarTipoInsumo,
  obtenerTiposInsumo,
  registrarInsumo,
  listarInsumos,
  actualizarInsumo,
  eliminarInsumo,
} from "../controllers/Insumos.Controller.js";

const rutaInsumos = Router();

/**
 * @swagger
 * tags:
 *   - name: Insumos
 *     description: API para la gestión de insumos
 *   - name: TiposInsumos
 *     description: API para la gestión de tipos de insumos
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
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Insumos obtenidos correctamente
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       nombre:
 *                         type: string
 *                         example: Fertilizante
 *                       descripcion:
 *                         type: string
 *                         example: Fertilizante nitrogenado
 *                       cantidad:
 *                         type: integer
 *                         example: 100
 *                       activo:
 *                         type: boolean
 *                         example: true
 *                       tipo_empacado:
 *                         type: string
 *                         example: Saco
 *                         nullable: true
 *                       fecha_registro:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-06-14T14:43:00Z
 *                       fecha_caducidad:
 *                         type: string
 *                         format: date
 *                         example: 2026-06-14
 *                         nullable: true
 *                       precio_insumo:
 *                         type: number
 *                         format: decimal
 *                         example: 50000.00
 *                       unidad_medida:
 *                         type: object
 *                         nullable: true
 *                         properties:
 *                           id:
 *                             type: integer
 *                           nombre:
 *                             type: string
 *                           descripcion:
 *                             type: string
 *                             nullable: true
 *                           creada_por_usuario:
 *                             type: boolean
 *                           fecha_creacion:
 *                             type: string
 *                             format: date-time
 *                       tipo_insumo:
 *                         type: object
 *                         nullable: true
 *                         properties:
 *                           id:
 *                             type: integer
 *                           nombre:
 *                             type: string
 *                           descripcion:
 *                             type: string
 *                             nullable: true
 *                           creada_por_usuario:
 *                             type: boolean
 *                           fecha_creacion:
 *                             type: string
 *                             format: date-time
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
 *               - cantidad
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Fertilizante
 *               descripcion:
 *                 type: string
 *                 example: Fertilizante nitrogenado
 *               cantidad:
 *                 type: integer
 *                 example: 100
 *               unidad_medida_id:
 *                 type: integer
 *                 example: 1
 *                 nullable: true
 *               tipo_insumo_id:
 *                 type: integer
 *                 example: 1
 *                 nullable: true
 *               activo:
 *                 type: boolean
 *                 example: true
 *               tipo_empacado:
 *                 type: string
 *                 example: Saco
 *                 nullable: true
 *               fecha_caducidad:
 *                 type: string
 *                 format: date
 *                 example: 2026-06-14
 *                 nullable: true
 *               precio_insumo:
 *                 type: number
 *                 format: decimal
 *                 example: 50000.00
 *     responses:
 *       201:
 *         description: Insumo registrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Insumo registrado correctamente
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
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
 *               - cantidad
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Fertilizante
 *               descripcion:
 *                 type: string
 *                 example: Fertilizante nitrogenado
 *               cantidad:
 *                 type: integer
 *                 example: 100
 *               unidad_medida_id:
 *                 type: integer
 *                 example: 1
 *                 nullable: true
 *               tipo_insumo_id:
 *                 type: integer
 *                 example: 1
 *                 nullable: true
 *               activo:
 *                 type: boolean
 *                 example: true
 *               tipo_empacado:
 *                 type: string
 *                 example: Saco
 *                 nullable: true
 *               fecha_caducidad:
 *                 type: string
 *                 format: date
 *                 example: 2026-06-14
 *                 nullable: true
 *               precio_insumo:
 *                 type: number
 *                 format: decimal
 *                 example: 50000.00
 *     responses:
 *       200:
 *         description: Insumo actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Insumo actualizado correctamente
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
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Insumo eliminado correctamente
 */
rutaInsumos.delete("/insumos/:id", verificarToken, eliminarInsumo);

/**
 * @swagger
 * /tipos-insumo:
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
 *                 example: Fertilizante
 *               descripcion:
 *                 type: string
 *                 example: Tipo de insumo para fertilizantes
 *                 nullable: true
 *               creada_por_usuario:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Tipo de insumo registrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Tipo de insumo registrado correctamente
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 */
rutaInsumos.post("/tipos-insumo", verificarToken, registrarTipoInsumo);

/**
 * @swagger
 * /tipos-insumo:
 *   get:
 *     summary: Obtener todos los tipos de insumo
 *     tags: [TiposInsumos]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tipos de insumo obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Tipos de insumo obtenidos correctamente
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       nombre:
 *                         type: string
 *                         example: Fertilizante
 *                       descripcion:
 *                         type: string
 *                         example: Tipo de insumo para fertilizantes
 *                         nullable: true
 *                       creada_por_usuario:
 *                         type: boolean
 *                         example: true
 *                       fecha_creacion:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-06-14T14:43:00Z
 */
rutaInsumos.get("/tipos-insumo", verificarToken, obtenerTiposInsumo);

export default rutaInsumos;