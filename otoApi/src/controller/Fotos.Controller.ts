import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { IFoto } from '../models/Fotos.model';
import { Model, Document, Types } from 'mongoose';
import FotoModel from '../models/Fotos.model';
import { IPetController } from '../interfaces/Pet.Interface';
import Pet from '../models/Pets.models';
import { IFotoController } from '../interfaces/Foto.Interface';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './src/public/uploads'); // Directorio de destino para guardar las fotos
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${extension}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Error: Archivo debe ser una imagen válida'));
  }
});

const unlinkAsync = promisify(fs.unlink);

export class FotoController implements IFotoController {
  async cargarFoto(req: Request, res: Response): Promise<void> {
    console.log(req.file)
    try {
      const foto = req.file;
      if (!foto) {
        console.log(req)
        res.status(400).send({ error: 'Error: No se ha proporcionado ninguna foto'});
    
        return;
      }

      // Procesar la foto y guardarla en la base de datos

      const nuevaFoto: IFoto & Document<any, any, any> = new FotoModel({
        ubicacionArchivo: foto.path,
        nombre: foto.filename,
        pets: new Types.ObjectId(req.body.pets)
      });

      // Guardar la foto en la base de datos (ejemplo)
      const fotoGuardada = await FotoModel.create(nuevaFoto);

      res.status(201).json(fotoGuardada);
    } catch (error) {
        console.log(error)
      res.status(500).json({ error: 'Error al cargar la foto' });
    }
  }

  async verFoto(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const foto = await FotoModel.findById(id);
      if (foto) {
        res.sendFile(path.resolve(foto.ubicacionArchivo));
      } else {
        res.status(404).json({ mensaje: 'Foto no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la foto' });
    }
  }
  async eliminarFoto(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const foto = await FotoModel.findByIdAndDelete(id);
      if (foto) {
        await unlinkAsync(foto.ubicacionArchivo); // Eliminar el archivo de la foto del sistema de archivos
        res.status(200).json({ mensaje: 'Foto eliminada exitosamente' });
      } else {
        res.status(404).json({ mensaje: 'Foto no encontrada' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la foto' });
    }
  }}
