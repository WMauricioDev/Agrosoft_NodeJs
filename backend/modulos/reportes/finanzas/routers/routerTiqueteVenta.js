import { Router } from "express";
import verificarToken from "../../../usuarios/middlewares/verificarToken.js";
import { 
  getFacturaPDF
} from "../controllers/controllerTiqueteVenta.js";

const RouterTiquetePDF = Router();


RouterTiquetePDF.get("/venta/:id/factura_pdf/", verificarToken, getFacturaPDF);

export default RouterTiquetePDF