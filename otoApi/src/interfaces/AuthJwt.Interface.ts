import { Request, Response, NextFunction } from 'express';

export interface IAuthJwtController{

    register(req: Request, res: Response): Promise<void>
    login(req: Request, res: Response): Promise<void>;
    isAuthenticated(req: Request,res: Response,next: NextFunction ):Promise<NextFunction>
    isLogin(req: Request, res: Response): Promise<void>
}