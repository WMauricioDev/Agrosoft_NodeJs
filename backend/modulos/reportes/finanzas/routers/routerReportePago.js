import { Router } from "express";
import verificarToken from "../../../usuarios/middlewares/verificarToken.js";
import { 
  generarReportePagosPDF
} from "../controllers/controllerReportePago.js";

const RouterPagoPDF = Router();


RouterPagoPDF.get("/pago/reporte_pdf/", verificarToken, generarReportePagosPDF);

export default RouterPagoPDF