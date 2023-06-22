import { Router } from 'express';
import { IPetController } from '../interfaces/Pet.Interface';
import { PetController } from '../controller/pet.controller';
import { AuthJwtController } from '../controller/authJwt.Controller';
const IAuthJwtController = require( '../interfaces/AuthJwt.Interface')

const router = Router();
const petController: IPetController = new PetController();
const authJwtController: typeof IAuthJwtController = new AuthJwtController();

router.get('/', petController.obtenerMascotas);
router.get('/:id', petController.obtenerMascotaPorId);
router.get('/masc/my',authJwtController.isAuthenticated,petController.ObtenerMascotasUsuario);
router.post('/', petController.crearMascota);
router.put('/:id', petController.actualizarMascota);
router.delete('/:id', petController.eliminarMascota);

export default router;
