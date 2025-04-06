import { Router } from "express";
import verificarToken from "../../usuarios/middlewares/verificarToken.js";
import { generarReporteActividades } from "../controller/reporteActividades.js";

const RouterReporteActividades = Router();

RouterReporteActividades.post("/reporteactividades/pdf", verificarToken, generarReporteActividades);

export default RouterReporteActividades;