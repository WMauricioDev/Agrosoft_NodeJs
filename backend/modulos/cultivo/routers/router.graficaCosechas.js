import express from 'express';
import { 
    getDatosGraficas
} from '../controller/controller.graficasCosechas.js';

const RouterGraficosCosechas = express.Router();

RouterGraficosCosechas.get('/datos_graficas', getDatosGraficas);

export default RouterGraficosCosechas;