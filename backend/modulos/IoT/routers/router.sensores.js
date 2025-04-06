import express from "express"; 
import { getSensores, getSensorById, postSensores, updateSensores, deleteSensores } from "../controller/controller_sensores.js";

const router = express.Router();

router.post("/sensores", postSensores);
router.get("/sensores", getSensores);
router.get("/sensores/:id",  getSensorById);
router.put("/sensores/:id",  updateSensores);
router.delete("/sensores/:id",   deleteSensores);

export default router;