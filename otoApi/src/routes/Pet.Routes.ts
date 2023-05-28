import { Router } from 'express';
import { IPetController } from '../interfaces/Pet.Interface';
import { PetController } from '../controller/pet.controller';

const router = Router();
const petController: IPetController = new PetController();

router.get('/', petController.obtenerMascotas);
router.get('/:id', petController.obtenerMascotaPorId);
router.post('/', petController.crearMascota);
router.put('/:id', petController.actualizarMascota);
router.delete('/:id', petController.eliminarMascota);

export default router;
