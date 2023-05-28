import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Usuario, { IUsuario } from '../models/Usuario.model';
import {IUsuarioController} from '../interfaces/Usuario.interface';
import configs from '../../configs';
import bcrypt from 'bcrypt';



class UsuarioController implements IUsuarioController {
    public async obtenerUsuarios(req: Request, res: Response): Promise<void> {
        try {
          const usuarios: IUsuario[] = await Usuario.find();
          res.status(200).json(usuarios);
        } catch (error) {
          res.status(500).json({ error: 'Error al obtener los usuarios' });
        }
      }

      public async obtenerLogin(userName: string, password: string): Promise<any> {
        try {
          console.log('usuario obtener');
          console.log(userName, password);
      
          if (userName && password) {
            console.log(userName, password);
      
            // Buscar el usuario por su nombre de usuario
            const usuario = await Usuario.findOne({ userName: userName });
      
            if (usuario) {
              // Si se encuentra el usuario, comparar la contraseña
              const isPasswordMatch = await bcrypt.compare(password, usuario.password);
      
              if (!isPasswordMatch) {
                // Si la contraseña no coincide, retornar un objeto con el usuario y un indicador de coincidencia falsa
                return { usuario, find: false };
              } else {
                console.log('usuario obtener');
                // Si la contraseña coincide, retornar un objeto con el usuario y un indicador de coincidencia verdadera
                return { usuario, find: true };
              }
            }
          }
        } catch (error) {
          throw error;
        }
      }
      

      public async obtenerUsuarioPorId(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
          const usuario: IUsuario | null = await Usuario.findById(id);
          if (!usuario) {
            res.status(404).json({ error: 'Usuario no encontrado' });
            return;
          }
          else{res.status(200).json(usuario);}
          
        } catch (error) {
        console.log(error + "el");
          res.status(500).json({ error: 'Error al obtener el usuario', errors: error });
        }
      }

      public async crearUsuario(req: Request, res: Response): Promise<void> {
        var { nombres,apellidos, userName, tel, fechaNacimiento, genero, correo, password } = req.body;
        try {
            console.log(req.body.password)
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            password = hashedPassword;
          const nuevoUsuario: IUsuario = new Usuario({
            nombres,
            apellidos,
            userName,
            tel,
            fechaNacimiento,
            genero,
            correo,
            password,
            saltRounds
          });
          await nuevoUsuario.save();
          res.status(200).send({estado: true, msj:"usuario creado correctamente"});
        } catch (error) {
          res.status(500).send({ error: 'Error al crear el usuario', clase:error });
        }
      }

    public async actualizarUsuario(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { apellidos, userName, tel, fechaNacimiento, genero, correo, password } = req.body;
        try {
          const usuarioActualizado: IUsuario | null = await Usuario.findByIdAndUpdate(
            id,
            {
              apellidos,
              userName,
              tel,
              fechaNacimiento,
              genero,
              correo,
              password
            },
            { new: true }
          );
          if (!usuarioActualizado) {
            res.status(404).send({ error: 'Usuario no encontrado' });
            return;
          }
          res.json(usuarioActualizado);
        } catch (error) {
          res.status(500).send({ error: 'Error al actualizar el usuario' });
        }
      }

   
  public async eliminarUsuario(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const usuarioEliminado: IUsuario | null = await Usuario.findByIdAndDelete(id);
      if (!usuarioEliminado) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }
      res.json(usuarioEliminado);
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
  }
  
}

export default UsuarioController;








