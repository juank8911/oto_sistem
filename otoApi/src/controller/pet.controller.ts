import { Request, Response } from 'express';
import { IPetController } from '../interfaces/Pet.Interface';
import Pet from '../models/Pets.models';

export class PetController implements IPetController {
  async obtenerMascotas(req: Request, res: Response): Promise<void> {
    try {
      const mascotas = await Pet.find();
      res.status(200).json(mascotas);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las mascotas' });
    }
  }

  async obtenerMascotaPorId(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const mascota = await Pet.findById(id);
      if (mascota) {
        res.status(200).json(mascota);
      } else {
        res.status(404).json({ mensaje: 'Mascota no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la mascota' });
    }
  }

  async crearMascota(req: Request, res: Response): Promise<void> {
    const { especie, raza, fechaNacimiento, descripcion, tagIdNum, propietario } = req.body;
    const nuevaMascota = new Pet({
      especie,
      raza,
      fechaNacimiento,
      descripcion,
      tagIdNum,
      propietario
    });
    try {
      const mascotaCreada = await nuevaMascota.save();
      res.status(201).json(mascotaCreada);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear la mascota' });
    }
  }

  async actualizarMascota(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { especie, raza, fechaNacimiento, descripcion, tagIdNum, propietario } = req.body;
    try {
      const mascotaActualizada = await Pet.findByIdAndUpdate(id, {
        especie,
        raza,
        fechaNacimiento,
        descripcion,
        tagIdNum,
        propietario
      }, { new: true });
      if (mascotaActualizada) {
        res.status(200).json(mascotaActualizada);
      } else {
        res.status(404).json({ mensaje: 'Mascota no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la mascota' });
    }
  }

  async eliminarMascota(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const mascotaEliminada = await Pet.findByIdAndRemove(id);
      if (mascotaEliminada) {
        res.status(200).json({ mensaje: 'Mascota eliminada correctamente' });
      } else {
        res.status(404).json({ mensaje: 'Mascota no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la mascota' });
    }
  }
}
