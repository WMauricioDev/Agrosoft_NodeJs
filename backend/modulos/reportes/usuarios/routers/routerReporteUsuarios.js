import { Router } from "express";
import verificarToken from "../../../usuarios/middlewares/verificarToken.js";
import { 
  generarReporteUsuariosPDF
} from "../controller/controllerReporteUsuarios.js";

const RouterUsuariosPDF = Router();


RouterUsuariosPDF.get("/usuarios/reporte_pdf/", verificarToken, generarReporteUsuariosPDF);

export default RouterUsuariosPDF