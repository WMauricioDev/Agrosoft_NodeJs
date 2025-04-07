const express = require('express');
const router = express.Router();
import { generarReporteCosechas } from ('../controller/reportesControllerIot');

router.get('/datos-historicos', reportesController.generarReporteDatosHistoricos);

module.exports = router;