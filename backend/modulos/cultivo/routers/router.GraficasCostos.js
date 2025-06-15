import { Router } from "express";
import verificarToken from "../../usuarios/middlewares/verificarToken.js"
import { getActividadCostosGrafica } from '../controller/controller.graficasCostos.js';

const RouterGraficos = Router();

RouterGraficos.get('/grafico_costos',verificarToken, getActividadCostosGrafica);

export default RouterGraficos;
