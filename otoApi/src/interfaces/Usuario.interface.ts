import { Request, Response } from 'express';

export interface IUsuarioController {
  obtenerLogin(userName:string, password:string  ):Promise<void>
  obtenerUsuarios(req: Request, res: Response): Promise<void>;
  obtenerUsuarioPorId(req: Request, res: Response): Promise<void>;
  crearUsuario(req: Request, res: Response): Promise<void>;
  actualizarUsuario(req: Request, res: Response): Promise<void>;
  eliminarUsuario(req: Request, res: Response): Promise<void>;
}