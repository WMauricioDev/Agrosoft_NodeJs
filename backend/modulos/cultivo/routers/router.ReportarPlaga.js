import express from 'express';
import { 
  postReportePlaga,
  getReportesPlaga,
  getIdReportePlaga,
  updateReportePlaga,
  deleteReportePlaga,
  revisarReportePlaga,
  atenderReportePlaga
} from '../controller/controller.ReportarPlaga.js';

const routerReportarPlaga = express.Router();

routerReportarPlaga.post('/reportes-plagas', postReportePlaga);
routerReportarPlaga.get('/reportes-plagas', getReportesPlaga);
routerReportarPlaga.get('/reportes-plagas/:id', getIdReportePlaga);
routerReportarPlaga.put('/reportes-plagas/:id', updateReportePlaga);
routerReportarPlaga.delete('/reportes-plagas/:id', deleteReportePlaga);
routerReportarPlaga.post('/reportes-plagas/:id/revisar', revisarReportePlaga);// Attend a report
routerReportarPlaga.post('/reportes-plagas/:id/atender', atenderReportePlaga);

export default routerReportarPlaga;