import express from "express";
import { calcularPago, getPagos, postPago, getIdPago, updatePago, deletePago } from "../controllers/Pago.controller.js";

const routerPago = express.Router();


routerPago.post("/pago", postPago);
routerPago.post("/pago/calcular_pago/", calcularPago);
routerPago.get("/pago", getPagos);
routerPago.get("/pago/:id", getIdPago);
routerPago.put("/pago/:id", updatePago);
routerPago.delete("/pago/:id", deletePago);
export default routerPago;