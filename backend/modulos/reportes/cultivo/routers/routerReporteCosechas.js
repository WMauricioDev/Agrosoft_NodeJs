import { Router } from "express";
import verificarToken from "../../../usuarios/middlewares/verificarToken.js";
import { 
  generarReporteCosechasPDF
} from "../controller/controllerReporteCosechas.js";

const RouterCosechasPDF = Router();


RouterCosechasPDF.get("/cosechas/reporte_pdf/", verificarToken, generarReporteCosechasPDF);

export default RouterCosechasPDF