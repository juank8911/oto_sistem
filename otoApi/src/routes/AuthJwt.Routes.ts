import { Router } from 'express';
import { IAuthJwtController } from '../interfaces/AuthJwt.Interface';
import { AuthJwtController } from '../controller/authJwt.Controller';

const router = Router();
const jwtController: IAuthJwtController = new AuthJwtController();

router.post('/',jwtController.login)
router.get('/',jwtController.isLogin)

export default router;