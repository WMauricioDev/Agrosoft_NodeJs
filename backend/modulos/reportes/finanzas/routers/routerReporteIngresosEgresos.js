import { Router } from "express";
import verificarToken from "../../../usuarios/middlewares/verificarToken.js";
import { generarReporteIngresosEgresos } from "../controllers/controllerReporteIngresosEgresos.js.js";

const RouterIngresosEgresosPDF = Router();

RouterIngresosEgresosPDF.get("/ingresos-egresos/reporte_pdf/", verificarToken, generarReporteIngresosEgresos);

export default RouterIngresosEgresosPDF;