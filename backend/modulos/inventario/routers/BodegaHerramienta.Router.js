import { Router } from "express";
import {
  registrarBodegaHerramienta,
  listarBodegaHerramienta,
  actualizarBodegaHerramienta,
  eliminarBodegaHerramienta,
} from "../controllers/BodegaHerramienta.Controller.js";
import verificarToken from "../../usuarios/middlewares/verificarToken.js";

const rutaBodegaHerramienta = Router();

rutaBodegaHerramienta.get("/bodega_herramienta", verificarToken, listarBodegaHerramienta);
rutaBodegaHerramienta.post("/bodega_herramienta", verificarToken, registrarBodegaHerramienta);
rutaBodegaHerramienta.put("/bodega_herramienta/:id", verificarToken, actualizarBodegaHerramienta);
rutaBodegaHerramienta.delete("/bodega_herramienta/:id", verificarToken, eliminarBodegaHerramienta);

export default rutaBodegaHerramienta;