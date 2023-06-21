import mongoose, { Document, Schema } from 'mongoose';

export interface IUsuario extends Document {
  nombres: string;
  apellidos: string;
  userName: string;
  tel: number;
  fechaNacimiento: Date;
  genero: string;
  correo: string;
  password: string;
  saltRounds: number;
}

const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const usuarioSchema = new Schema({
 nombres: {
    type: String,
    required: true
  },
  apellidos: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    unique: true,
    required: true
  },
  tel: {
    type: Number,
    required: true
  },
  fechaNacimiento: {
    type: Date,
    required: true
  },
  genero: {
    type: String,
    required: true
  },
  correo: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (value: string) => correoRegex.test(value),
      message: 'Formato de correo electrónico inválido'
    }
  },
  password: {
    type: String,
    required: true
  },
  saltRounds:{
    type: Number,
    require: true
  }
});

const Usuario = mongoose.model<IUsuario>('Usuario', usuarioSchema);

export default Usuario;
