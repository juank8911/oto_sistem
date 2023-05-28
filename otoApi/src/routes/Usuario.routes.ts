const IUsuarioController = require('../interfaces/Usuario.interface')
import UsuarioController from '../controller/UsuarioController';
import { AuthJwtController } from '../controller/authJwt.Controller';
const IAuthJwtController = require( '../interfaces/AuthJwt.Interface')

import { Router } from 'express';


const router = Router();
const usuarioController: typeof IUsuarioController = new UsuarioController();
const authJwtController: typeof IAuthJwtController = new AuthJwtController();

router.get('/',usuarioController.obtenerUsuarios);
router.get('/:id',authJwtController.isAuthenticated, usuarioController.obtenerUsuarioPorId);
router.post('/', usuarioController.crearUsuario);
router.put('/:id', usuarioController.actualizarUsuario);
router.delete('/:id', usuarioController.eliminarUsuario);

export default router;
