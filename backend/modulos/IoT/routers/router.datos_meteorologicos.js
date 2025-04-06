import express from "express"; 
import { postDatoMeteorologico, getDatosMeteorologicos } from "../controller/controller_datos.meteorologicos.js";

const router = express.Router();

router.post("/datosmetereologicos",   postDatoMeteorologico);
router.get("/datosmetereologicos",   getDatosMeteorologicos);

export default router;