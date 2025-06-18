import { Router } from "express";
import verificarToken from "../../../usuarios/middlewares/verificarToken.js";
import { 
  generarReportePlagasPDF
} from "../controller/controllerReportePlagas.js";

const RouterPlagaPDF = Router();


RouterPlagaPDF.get("/plagas/reporte_pdf/", verificarToken, generarReportePlagasPDF);

export default RouterPlagaPDF