import { Router } from 'express';
import {
  listarUsuarios,
  RegistrarUsuarios,
  ActualizarUsuarios,
  EliminarUsuarios,
  BuscarUsuarios,
  obtenerUsuarioActual,
  actualizarEstadoStaff
} from '../controllers/Usuarios.controllers.js';
import verificarToken from '../middlewares/verificarToken.js';

const router = Router();
router.get('/usuarios/me' ,verificarToken,obtenerUsuarioActual )
router.get('/usuarios', listarUsuarios);
router.get('/usuarios/:id',verificarToken, BuscarUsuarios);
router.post('/usuarios',verificarToken,  RegistrarUsuarios);
router.put('/usuarios/:id',  ActualizarUsuarios);
router.delete('/usuarios/:id', verificarToken, EliminarUsuarios);
router.patch('/usuarios/staff/:id/' ,verificarToken, actualizarEstadoStaff);

export default router;