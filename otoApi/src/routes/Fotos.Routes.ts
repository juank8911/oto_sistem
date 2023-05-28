
import { Router } from 'express';
import { IFotoController } from '../interfaces/Foto.Interface';
import {FotoController} from '../controller/Fotos.Controller'

const router = Router()
const fotoController: IFotoController = new FotoController();

router.get('/', fotoController.verFoto);
//router.get('/:id', fotoController.);
router.post('/', fotoController.cargarFoto);
router.delete('/:id', fotoController.eliminarFoto);

export default router;
