import { Router } from "express";
import verificarToken from "../../usuarios/middlewares/verificarToken.js";
import {
  registrarPrecioProducto,
  listarPrecioProducto,
  actualizarPrecioProducto,
  eliminarPrecioProducto,
  listarUnidadesMedida,
  crearUnidadMedida
} from "../controllers/controller.precio_producto.js";

const rutaPrecio = Router();

rutaPrecio.get("/precio-producto", verificarToken, listarPrecioProducto);
rutaPrecio.post("/precio-producto", verificarToken, registrarPrecioProducto);
rutaPrecio.put("/precio-producto/:id", verificarToken, actualizarPrecioProducto);
rutaPrecio.delete("/precio-producto/:id", verificarToken, eliminarPrecioProducto);

rutaPrecio.get("/unidades_medida", verificarToken, listarUnidadesMedida);
rutaPrecio.post("/crear_unidad_medida", verificarToken, crearUnidadMedida);

export default rutaPrecio;