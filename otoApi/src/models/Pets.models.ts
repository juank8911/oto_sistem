import mongoose, { Document, Schema } from 'mongoose';

export interface IPet extends Document {
  especie: string;
  raza: string;
  fechaNacimiento: Date;
  descripcion: string;
  tagIdNum: string;
  propietario: mongoose.Schema.Types.ObjectId;
}

const petSchema: Schema = new Schema({
  especie: {
    type: String,
    required: true
  },
  raza: {
    type: String,
    required: true
  },
  fechaNacimiento: {
    type: Date,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  tagIdNum: {
    type: String,
    required: true
  },
  propietario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  }
});

const Pet = mongoose.model<IPet>('Pet', petSchema);

export default Pet;
