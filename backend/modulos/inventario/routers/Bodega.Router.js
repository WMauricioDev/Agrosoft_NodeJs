import { Router } from "express";
import {
  registrarBodega,
  listarBodega,
  actualizarBodega,
  eliminarBodega,
} from "../controllers/Bodega.Controller.js";
import verificarToken from "../../usuarios/middlewares/verificarToken.js";

const rutaBodega = Router();

rutaBodega.get("/bodega", verificarToken, listarBodega);
rutaBodega.post("/bodega", verificarToken, registrarBodega);
rutaBodega.put("/bodega/:id", verificarToken, actualizarBodega);
rutaBodega.delete("/bodega/:id", verificarToken, eliminarBodega);

export default rutaBodega;