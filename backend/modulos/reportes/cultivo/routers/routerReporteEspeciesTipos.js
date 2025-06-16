import { Router } from "express";
import verificarToken from "../../../usuarios/middlewares/verificarToken.js";
import { 
  generarReporteEspeciesTiposPDF
} from "../controller/controllerReporteEspeciesTipos.js";

const RouterEspeciesPDF = Router();


RouterEspeciesPDF.get("/especies/reporte_pdf/", verificarToken, generarReporteEspeciesTiposPDF);

export default RouterEspeciesPDF