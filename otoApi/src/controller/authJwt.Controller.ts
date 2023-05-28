import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import configs from '../../configs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
const IUsuarioController = require('../interfaces/Usuario.interface');
import UsuarioController from '../controller/UsuarioController';
import Usuario from '../models/Usuario.model'
import router from '../routes/Usuario.routes';

dotenv.config();

const SECRET_KEY = configs.jwt_secreto ;
console.log(SECRET_KEY)
const usuarioController: typeof IUsuarioController = new UsuarioController();

export class AuthJwtController {
  // Método para registrar un usuario
  async register(req: Request, res: Response): Promise<void> {
    try {
      // Obtener los datos del usuario desde el cuerpo de la solicitud
      const { userName, password } = req.body;
      // Generar el hash de la contraseña utilizando bcrypt
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Guardar los datos del usuario en la base de datos (o cualquier otra acción necesaria)
      
      // Enviar una respuesta exitosa
      res.status(200).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
      // Manejar errores
      res.status(500).json({ error: 'Error al registrar el usuario' });
    }
  }

  // Método para iniciar sesión y generar un token JWT
  async login(req: Request, res: Response): Promise<void> {
    try {
      // Obtener los datos del usuario desde el cuerpo de la solicitud
      const { userName, password } = req.body;
      // Verificar las credenciales del usuario en la base de datos (o cualquier otra acción necesaria)
      
      console.log(userName, password)
      console.log('de auth ----------------------------ante ususarioController-------------------------');
        usuarioController.obtenerLogin(userName,password).
                       then((user: any)=>{if(user)
                        {   
                          console.log('de auth ------------------despues UC-----------------------------------');
                          console.log(user.usuario);
                            user =new Usuario(user.usuario)
                            // Simular la comparación de contraseñas utilizando bcrypt
                            console.log('de auth -----despues cre US------------------------------------------------');
                        const isPasswordMatch = bcrypt.compareSync(password, user.password);
                        console.log('de auth -------------------pasword machted----------------------------------');
                        if (!isPasswordMatch) {
                            // Si las contraseñas no coinciden, enviar una respuesta de error
                            res.status(401).send({ error: 'Credenciales inválidas' });
                            console.log('de auth ----------------invalidas-------------------------------------');
                          }   
                          else
                          {
                            console.log('credenciale valiodas')           
                            // Generar un token JWT con una duración de 1 hora
                            console.log(user)
                            console.log('token')
                            const token = jwt.sign( {user} , SECRET_KEY);
                            // Enviar el token en la respuesta
                            console.log(token)    
     
                            res.status(200).json({ token, ok:true });
                          }     

                        }
                      else{
                        res.status(500).send({msj:'usuario no encontrado', find:false})
                      }})
    } catch (error) {
      // Manejar errores
      res.status(500).json({ error: 'Error al iniciar sesión' });
    }
  }

/*  async isAuthenticated(req: Request,res: Response,next:NextFunction){
    try {
        const {token} = req.cookies;
        console.log(req.cookies)
        if(!token){
            return next('Please login to access the data');
        }
        var verify = await jwt.verify(token,SECRET_KEY);
            verify = new Usuario(verify);
        console.log(verify);
        await Usuario.findById(verify.id).
                    then(user=>{
                        if(user)
                        {
                            next(user);
                        }
                    })
       
    } catch (error) {
       return next(error); 
    }
}
*/
async isAuthenticated(req:Request,res:Response,next:NextFunction):Promise<any>
{
 
  try {
 
    const cookieHeader = req.headers.cookie;
    if (cookieHeader) {
      // Acceder y manejar las cookies aquí
      console.log('autenticando error antes')
      console.log(cookieHeader)
      const { token } = req.cookies;
      console.log(jwt.verify(token, SECRET_KEY))
      const decodedToken = jwt.verify(token, SECRET_KEY) as { user: { 
        _id: string,
        nombres: string,
          apellidos: string,
          userName:string,
          tel: number,
          fechaNacimiento: Date,
          genero: string,
          correo: string
          password: string,
          saltRounds: number,
          id: string,
          __v:number
          }}
      console.log(decodedToken);
      
      const user = decodedToken.user;
      // Imprime el objeto 'user' en la consola
          console.log('buscanod usuario')
        Usuario.findById(user._id).
              then(user=>{
                console.log('usuario de autorizacion');
                 console.log(user);
                 if(user){next()}else{
                res.status(401).json({ error: 'Unauthorized' });
              }})
      
    } else {
      // No se encontraron cookies en la solicitud
      console.log('else')
    }
      
  } catch (error) {
    throw error;
     return  error; 
  }
}

  // Método para proteger una ruta y verificar el token JWT
  async isLogin(req: Request, res: Response): Promise<void> {
    try {
      var authorizationHeader:any;

      console.log(req.headers)
      // Obtener el token JWT del encabezado de la solicitud
      if(!req.headers.authorization){
      authorizationHeader = req.headers.authorization
    }
    else{
      authorizationHeader = req.headers.cookie
      authorizationHeader = authorizationHeader.split('=')[2]
      console.log(authorizationHeader)
    }

      if (!authorizationHeader) {
        throw new Error('Token no encontrado');
      }
      const token = authorizationHeader.split(' ')[1];
    
      // Verificar y decodificar el token
      if (!token) {
        throw new Error('Token inválido');
      }
      const decodedToken = jwt.verify(token, SECRET_KEY);
      console.log(decodedToken);
     // var usuario = usuarioController.obtenerUsuarioPorId()
      // Verificar si el token es válido
        //res.status(200).json(islogin:true, )
      // Realizar acciones adicionales necesarias para la ruta protegida
    
      // Pasar al siguiente middleware o controlador
    } catch (err) {
      // Manejar errores
      throw err;
      res.status(401).send({ error: err || 'Error al procesar el token' });
    }
  }
  
}
