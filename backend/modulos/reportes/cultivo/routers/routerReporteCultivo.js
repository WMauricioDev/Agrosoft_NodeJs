import { Router } from "express";
import verificarToken from "../../../usuarios/middlewares/verificarToken.js";
import { 
  generarReporteCultivosPDF
} from "../controller/controllerReporteCultivo.js";

const RouterCultivoPDF = Router();


RouterCultivoPDF.get("/cultivos/reporte_pdf/", verificarToken, generarReporteCultivosPDF);

export default RouterCultivoPDF