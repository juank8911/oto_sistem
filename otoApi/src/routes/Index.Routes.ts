import { Router } from 'express';
import UsuarioRoutes from './Usuario.routes';
import PetRoutes from './Pet.Routes';
import FotosRoutes from './Fotos.Routes';
import AuthRoutes from './AuthJwt.Routes';

const router = Router();

// Rutas de Usuario
router.use('/usuario', UsuarioRoutes);

// Rutas de Pet
router.use('/pets', PetRoutes);

// Rutas de Foto
router.use('/fotos', FotosRoutes);

router.use('/auth', AuthRoutes);

export default router;