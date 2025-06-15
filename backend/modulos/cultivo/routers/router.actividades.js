import { Router } from "express";
import verificarToken from "../../usuarios/middlewares/verificarToken.js";
import { actividadController } from "../controller/controller.actividades.js";
const RouterActividades = Router();

RouterActividades.get('/actividades', verificarToken, actividadController.getAll);
RouterActividades.post('/actividades', verificarToken, actividadController.create);
RouterActividades.post('/actividades/:id/finalizar',verificarToken, actividadController.finalizar);
RouterActividades.delete('/actividades/:id',verificarToken,actividadController.delete);

export default RouterActividades;