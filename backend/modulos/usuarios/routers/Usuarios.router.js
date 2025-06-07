import { Router } from 'express';
import {
  listarUsuarios,
  RegistrarUsuarios,
  ActualizarUsuarios,
  EliminarUsuarios,
  BuscarUsuarios,
  obtenerUsuarioActual
} from '../controllers/Usuarios.controllers.js';
import verificarToken from '../middlewares/verificarToken.js';

const router = Router();
router.get('/usuarios/me' ,verificarToken,obtenerUsuarioActual )
router.get('/usuarios', listarUsuarios);
router.get('/usuarios/:id', BuscarUsuarios);
router.post('/usuarios',  RegistrarUsuarios);
router.put('/usuarios/:id',  ActualizarUsuarios);
router.delete('/usuarios/:id', verificarToken, EliminarUsuarios);

export default router;