import { Router } from "express";
import verificarToken from "../../../usuarios/middlewares/verificarToken.js";
import { 
  generarReporteActividadesPDF
} from "../controller/controllerReporteActividades.js";

const RouterActividadesPDF = Router();


RouterActividadesPDF.get("/actividades/reporte_pdf/", verificarToken, generarReporteActividadesPDF);

export default RouterActividadesPDF