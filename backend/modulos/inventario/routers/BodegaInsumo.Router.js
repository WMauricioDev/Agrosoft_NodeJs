import { Router } from "express";
import {
  registrarBodegaInsumo,
  listarBodegaInsumo,
  actualizarBodegaInsumo,
  eliminarBodegaInsumo,
} from "../controllers/BodegaInsumo.Controller.js";
import verificarToken from "../../usuarios/middlewares/verificarToken.js";

const rutaBodegaInsumo = Router();

rutaBodegaInsumo.get("/bodega_insumo", verificarToken, listarBodegaInsumo);
rutaBodegaInsumo.post("/bodega_insumo", verificarToken, registrarBodegaInsumo);
rutaBodegaInsumo.put("/bodega_insumo/:id", verificarToken, actualizarBodegaInsumo);
rutaBodegaInsumo.delete("/bodega_insumo/:id", verificarToken, eliminarBodegaInsumo);

export default rutaBodegaInsumo;