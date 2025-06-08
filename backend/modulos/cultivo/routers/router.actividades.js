import { Router } from "express";
import verificarToken from "../../usuarios/middlewares/verificarToken.js";
import { postActividad, getActividades, getIdActividad, updateActividad, deleteActividad, finalizarActividad, graficoCostos } from "../controller/controller.actividades.js";

const RouterActividades = Router();

/**
 * @swagger
 * tags:
 *   name: Actividades
 *   description: Endpoints para la gestión de actividades
 */

/**
 * @swagger
 * /actividades:
 *   post:
 *     summary: Crea una nueva actividad
 *     tags: [Actividades]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipo_actividad_id:
 *                 type: integer
 *               descripcion:
 *                 type: string
 *               fecha_inicio:
 *                 type: string
 *                 format: date-time
 *               fecha_fin:
 *                 type: string
 *                 format: date-time
 *               cultivo_id:
 *                 type: integer
 *               usuarios:
 *                 type: array
 *                 items:
 *                   type: integer
 *               estado:
 *                 type: string
 *                 enum: [PENDIENTE, EN_PROCESO, COMPLETADA, CANCELADA]
 *                 default: PENDIENTE
 *               prioridad:
 *                 type: string
 *                 enum: [ALTA, MEDIA, BAJA]
 *                 default: MEDIA
 *               instrucciones_adicionales:
 *                 type: string
 *                 nullable: true
 *               insumos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     insumo:
 *                       type: integer
 *                     cantidad_usada:
 *                       type: integer
 *                       default: 0
 *                 required: false
 *               herramientas:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     herramienta:
 *                       type: integer
 *                     cantidad_entregada:
 *                       type: integer
 *                       default: 1
 *                     entregada:
 *                       type: boolean
 *                       default: true
 *                     devuelta:
 *                       type: boolean
 *                       default: false
 *                     fecha_devolucion:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                 required: false
 *     responses:
 *       201:
 *         description: Actividad creada correctamente
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
 *         description: Error en la solicitud
 */
RouterActividades.post("/actividades", verificarToken, postActividad);

/**
 * @swagger
 * /actividades:
 *   get:
 *     summary: Obtiene todas las actividades
 *     tags: [Actividades]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de actividades
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   tipo_actividad_id:
 *                     type: integer
 *                   tipo_actividad_nombre:
 *                     type: string
 *                   descripcion:
 *                     type: string
 *                   fecha_inicio:
 *                     type: string
 *                     format: date-time
 *                   fecha_fin:
 *                     type: string
 *                     format: date-time
 *                   cultivo_id:
 *                     type: integer
 *                   usuarios:
 *                     type: array
 *                     items:
 *                       type: integer
 *                   estado:
 *                     type: string
 *                   prioridad:
 *                     type: string
 *                   instrucciones_adicionales:
 *                     type: string
 *                     nullable: true
 *                   prestamos_insumos:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         insumo_id:
 *                           type: integer
 *                         insumo_nombre:
 *                           type: string
 *                         cantidad_usada:
 *                           type: integer
 *                         cantidad_devuelta:
 *                           type: integer
 *                         fecha_devolucion:
 *                           type: string
 *                           format: date-time
 *                           nullable: true
 *                         unidad_medida:
 *                           type: string
 *                           nullable: true
 *                   prestamos_herramientas:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         herramienta_id:
 *                           type: integer
 *                         herramienta_nombre:
 *                           type: string
 *                         bodega_herramienta_id:
 *                           type: integer
 *                           nullable: true
 *                         bodega_herramienta_cantidad:
 *                           type: integer
 *                           nullable: true
 *                         cantidad_entregada:
 *                           type: integer
 *                         cantidad_devuelta:
 *                           type: integer
 *                         entregada:
 *                           type: boolean
 *                         devuelta:
 *                           type: boolean
 *                         fecha_devolucion:
 *                           type: string
 *                           format: date-time
 *                           nullable: true
 *       404:
 *         description: No hay registros de actividades
 */
RouterActividades.get("/actividades", verificarToken, getActividades);

/**
 * @swagger
 * /actividades/{id}:
 *   get:
 *     summary: Obtiene una actividad por ID
 *     tags: [Actividades]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Datos de la actividad
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 tipo_actividad_id:
 *                   type: integer
 *                 tipo_actividad_nombre:
 *                   type: string
 *                 descripcion:
 *                   type: string
 *                 fecha_inicio:
 *                   type: string
 *                   format: date-time
 *                 fecha_fin:
 *                   type: string
 *                   format: date-time
 *                 cultivo_id:
 *                   type: integer
 *                 usuarios:
 *                   type: array
 *                   items:
 *                     type: integer
 *                 estado:
 *                   type: string
 *                 prioridad:
 *                   type: string
 *                 instrucciones_adicionales:
 *                   type: string
 *                   nullable: true
 *                 prestamos_insumos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       insumo_id:
 *                         type: integer
 *                       insumo_nombre:
 *                         type: string
 *                       cantidad_usada:
 *                         type: integer
 *                       cantidad_devuelta:
 *                         type: integer
 *                       fecha_devolucion:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                       unidad_medida:
 *                         type: string
 *                         nullable: true
 *                 prestamos_herramientas:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       herramienta_id:
 *                         type: integer
 *                       herramienta_nombre:
 *                         type: string
 *                       bodega_herramienta_id:
 *                         type: integer
 *                         nullable: true
 *                       bodega_herramienta_cantidad:
 *                         type: integer
 *                         nullable: true
 *                       cantidad_entregada:
 *                         type: integer
 *                       cantidad_devuelta:
 *                         type: integer
 *                       entregada:
 *                         type: boolean
 *                       devuelta:
 *                         type: boolean
 *                       fecha_devolucion:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *       404:
 *         description: Actividad no encontrada
 */
RouterActividades.get("/actividades/:id", verificarToken, getIdActividad);

/**
 * @swagger
 * /actividades/{id}:
 *   put:
 *     summary: Actualiza una actividad por ID
 *     tags: [Actividades]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipo_actividad_id:
 *                 type: integer
 *               descripcion:
 *                 type: string
 *               fecha_inicio:
 *                 type: string
 *                 format: date-time
 *               fecha_fin:
 *                 type: string
 *                 format: date-time
 *               cultivo_id:
 *                 type: integer
 *               usuarios:
 *                 type: array
 *                 items:
 *                   type: integer
 *               estado:
 *                 type: string
 *                 enum: [PENDIENTE, EN_PROCESO, COMPLETADA, CANCELADA]
 *                 default: PENDIENTE
 *               prioridad:
 *                 type: string
 *                 enum: [ALTA, MEDIA, BAJA]
 *                 default: MEDIA
 *               instrucciones_adicionales:
 *                 type: string
 *                 nullable: true
 *               insumos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     insumo:
 *                       type: integer
 *                     cantidad_usada:
 *                       type: integer
 *                       default: 0
 *                 required: false
 *               herramientas:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     herramienta:
 *                       type: integer
 *                     cantidad_entregada:
 *                       type: integer
 *                       default: 1
 *                     entregada:
 *                       type: boolean
 *                       default: true
 *                     devuelta:
 *                       type: boolean
 *                       default: false
 *                     fecha_devolucion:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                 required: false
 *     responses:
 *       200:
 *         description: Actividad actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Error en la solicitud
 *       404:
 *         description: No se pudo actualizar la actividad
 */
RouterActividades.put("/actividades/:id", verificarToken, updateActividad);

/**
 * @swagger
 * /actividades/{id}:
 *   delete:
 *     summary: Elimina una actividad por ID
 *     tags: [Actividades]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Actividad eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: No se pudo eliminar la actividad
 */
RouterActividades.delete("/actividades/:id", verificarToken, deleteActividad);

/**
 * @swagger
 * /actividades/{id}/finalizar:
 *   post:
 *     summary: Finaliza una actividad por ID
 *     tags: [Actividades]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha_fin:
 *                 type: string
 *                 format: date-time
 *             required:
 *               - fecha_fin
 *     responses:
 *       200:
 *         description: Actividad finalizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 insumos_devueltos:
 *                   type: integer
 *                 herramientas_devueltas:
 *                   type: integer
 *       400:
 *         description: Error en la solicitud (e.g., actividad ya completada, fecha_fin requerida)
 */
RouterActividades.post("/actividades/:id/finalizar", verificarToken, finalizarActividad);

/**
 * @swagger
 * /actividades/grafico_costos:
 *   get:
 *     summary: Obtiene los costos de actividades para visualización
 *     tags: [Actividades]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fecha_inicio
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *       - in: query
 *         name: fecha_fin
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *       - in: query
 *         name: tipo_grafico
 *         schema:
 *           type: string
 *           default: barra
 *         required: false
 *     responses:
 *       200:
 *         description: Datos de costos para visualización
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tipo_grafico:
 *                   type: string
 *                 periodo:
 *                   type: object
 *                   properties:
 *                     fecha_inicio:
 *                       type: string
 *                       format: date
 *                       nullable: true
 *                     fecha_fin:
 *                       type: string
 *                       format: date
 *                       nullable: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       actividad:
 *                         type: string
 *                       costo_total:
 *                         type: number
 *                       desglose:
 *                         type: object
 *                         properties:
 *                           insumos:
 *                             type: number
 *                           herramientas:
 *                             type: number
 *                           mano_de_obra:
 *                             type: number
 *                       tiempo_invertido_horas:
 *                         type: number
 *                       fecha_inicio:
 *                         type: string
 *                         format: date
 *                       fecha_fin:
 *                         type: string
 *                         format: date
 *                       usuarios:
 *                         type: array
 *                         items:
 *                           type: string
 *       500:
 *         description: Error en el servidor
 */
RouterActividades.get("/actividades/grafico_costos", verificarToken, graficoCostos);

export default RouterActividades;