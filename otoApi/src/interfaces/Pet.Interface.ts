import { Request, Response } from 'express';

export interface IPetController {
  obtenerMascotas(req: Request, res: Response): Promise<void>;
  obtenerMascotaPorId(req: Request, res: Response): Promise<void>;
  ObtenerMascotasUsuario(req: Request, res: Response):Promise<void>;
  crearMascota(req: Request, res: Response): Promise<void>;
  actualizarMascota(req: Request, res: Response): Promise<void>;
  eliminarMascota(req: Request, res: Response): Promise<void>;
}