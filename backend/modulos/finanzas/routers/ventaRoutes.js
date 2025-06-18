import { Router } from "express";
import verificarToken from "../../usuarios/middlewares/verificarToken.js";
import { postVenta, getVentas, deleteVenta, getDetallesVenta } from "../controllers/ventaController.js";

const rutaVenta = Router();
rutaVenta.post('/venta', verificarToken, postVenta);
rutaVenta.get('/venta', verificarToken, getVentas);
rutaVenta.delete('/venta/:id', verificarToken, deleteVenta);
rutaVenta.get('/venta/:id/detalles', verificarToken, getDetallesVenta);


export default rutaVenta;
