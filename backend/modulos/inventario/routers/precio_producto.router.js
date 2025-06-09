import { Router } from "express";
import verificarToken from "../../usuarios/middlewares/verificarToken.js";
import { registrarPrecioProducto, listarPrecioProducto, actualizarPrecioProducto, eliminarPrecioProducto } from "../controllers/controller.precio_producto.js";

const rutaPrecio = Router();

rutaPrecio.get("/precio-producto", verificarToken, listarPrecioProducto);
rutaPrecio.post("/precio-producto", verificarToken, registrarPrecioProducto);

rutaPrecio.put("/precio-producto/:id", verificarToken, actualizarPrecioProducto);
 
rutaPrecio.delete("/precio-producto/:id", verificarToken, eliminarPrecioProducto);
export default rutaPrecio;