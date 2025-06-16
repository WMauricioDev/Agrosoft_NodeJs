import { Router } from "express";
import verificarToken from "../../usuarios/middlewares/verificarToken.js";
import {
  registrarPrecioProducto,
  listarPrecioProducto,
  actualizarPrecioProducto,
  eliminarPrecioProducto,
  obtenerUnidadesMedida,
  obtenerCosechas,
  crearUnidadMedida,
  crearCosecha, // Nueva función
} from "../controllers/controller.precio_producto.js";

const rutaPrecio = Router();

// Routes for precio-producto
rutaPrecio.get("/precio_producto/", verificarToken, listarPrecioProducto);
rutaPrecio.post("/precio_producto/", verificarToken, registrarPrecioProducto);
rutaPrecio.put("/precio_producto/:id", verificarToken, actualizarPrecioProducto);
rutaPrecio.delete("/precio_producto/:id", verificarToken, eliminarPrecioProducto);

// Routes for modals
rutaPrecio.get("/precio_producto/unidades_medida/", verificarToken, obtenerUnidadesMedida);
rutaPrecio.get("/precio_producto/cosechas/", verificarToken, obtenerCosechas);
rutaPrecio.post("/precio_producto/cosechas/", verificarToken, crearCosecha); // Nueva ruta

// Route for creating measurement units
rutaPrecio.post("/precio_producto/crear_unidad_medida/", verificarToken, crearUnidadMedida);

export default rutaPrecio;