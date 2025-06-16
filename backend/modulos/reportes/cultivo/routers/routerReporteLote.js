import { Router } from "express";
import verificarToken from "../../../usuarios/middlewares/verificarToken.js";
import { 
  generarReporteLotesPDF
} from "../controller/controllerReporteLote.js";

const RouterlotesPDF = Router();


RouterlotesPDF.get("/lote/reporte_pdf/", verificarToken, generarReporteLotesPDF);

export default RouterlotesPDF