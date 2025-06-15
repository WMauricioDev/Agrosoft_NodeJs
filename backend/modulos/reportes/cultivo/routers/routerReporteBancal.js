import { Router } from "express";
import verificarToken from "../../../usuarios/middlewares/verificarToken.js";
import { 
  generarReporteBancalesPDF
} from "../controller/controllerReporteBancal.js";

const RouterBancalesPDF = Router();


RouterBancalesPDF.get("/Bancal/reporte_pdf/", verificarToken, generarReporteBancalesPDF);

export default RouterBancalesPDF