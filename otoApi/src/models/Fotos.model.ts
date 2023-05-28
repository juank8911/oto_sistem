import mongoose, { Document, PopulatedDoc, Schema, Types } from 'mongoose';
import { IPet } from './Pets.models';

export interface IFoto extends Document {
    ubicacionArchivo: string;
    nombre: string;
    pets: Types.ObjectId | IPet; // Reemplaza "any" con el tipo correcto para referenciar a la colección de "pets"
  }
  
const fotoSchema = new Schema({
  ubicacionArchivo: {
    type: String,
    required: true
  },
  nombre: {
    type: String,
    required: true
  },
  pets: {
    type: Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  }
});

const Foto = mongoose.model<IFoto>('Foto', fotoSchema);

export default Foto;
