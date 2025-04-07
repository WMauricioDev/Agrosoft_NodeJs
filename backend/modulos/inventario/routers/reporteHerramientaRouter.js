import express from 'express';
import { generarReporteHerramientasActivas } from '../controllers/reporteHerramientaController.js';

const herramienta = express.Router();

herramienta.post('/herramientas/:formato', generarReporteHerramientasActivas);

export default herramienta;