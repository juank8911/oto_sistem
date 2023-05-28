import { Request, Response } from 'express';

export interface IFotoController {
  cargarFoto(req: Request, res: Response): Promise<void>;
  verFoto(req: Request, res: Response): Promise<void>;
  eliminarFoto(req: Request, res: Response): Promise<void>;
}
