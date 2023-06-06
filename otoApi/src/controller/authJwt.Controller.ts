import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import configs from '../../configs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
const IUsuarioController = require('../interfaces/Usuario.interface');
import UsuarioController from '../controller/UsuarioController';
import Usuario from '../models/Usuario.model'
import router from '../routes/Usuario.routes';
import { IUsuarioController } from '../interfaces/Usuario.interface';


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
                        console.log('de auth -------------------pasword machted----------------------------------'+' '+isPasswordMatch);
                        if (!isPasswordMatch) {
                            // Si las contraseñas no coinciden, enviar una respuesta de error
                            res.status(401).send({isLoggedIn:false, error: 'Credenciales inválidas' });
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
     
                            res.status(200).json({ token:token,isLoggedIn:true });
                          }     

                        }
                      else{
                        res.status(500).send({msj:'usuario no encontrado',isLoggedIn:false ,find:false})
                      }})
    } catch (error) {
      // Manejar errores
      res.status(500).json({isLoggedIn:false, error: 'Error al iniciar sesión' });
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
                 console.log(user?.userName);
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



async isLogin(req: Request, res: Response):Promise<void> {
  var IsLoged = false;
  var decodedToken:any;
  try {
    var cookieHeader;
    console.log(req.headers)
    console.log('isLogin-------------1---------------------------------------------------')
    if(req.headers.authorization)
    {
      
      console.log('isLogin----------2------------------------------------------------------')
      cookieHeader = req.headers.authorization;
    }
      // console.log(cookieHeader);
    if (cookieHeader) {
      // Acceder y manejar las cookies aquí
      // cookieHeader = cookieHeader?.split(' ')[1];
      console.log('isLogin----------------------------------------------------------------')
      // console.log(req)
      const token = cookieHeader;
      console.log(token);
       decodedToken = await jwt.decode(token.replace('Bearer ', '')) as {user:{
        _id: string,
        nombres: string,
          apellidos: string,
          userName:string,
          tel: number,
       }}
       console.log(decodedToken.user)
          var user = decodedToken.user;
          console.log('buscanod usuario')
          console.log(user._id)
       var usuario: IUsuarioController | null = await Usuario.findById(user._id);
       console.log(usuario);
      //  const usuario: IUsuarioController | null = await Usuario.findById(user._id);
      var usue = new Usuario(usuario);
      console.log('----------------usue-----------------');
      console.log(usue);
       console.log('---------------------------------------------');
              if(usue)
              {
                var resp = {
                  usue,
                  isloggedIn: true,
                  pruabe:'1234'
                }
                console.log(resp);
                res.status(200).send(resp);   
               }
               else
               {
                res.status(200).send({usaurio:null, isLoggedIn: false })   
               }           
                
              
                // .
              // then(userFi =>{ 
              //   console.log(userFi?.nombres);
              //    if(userFi){                                   
              //     IsLoged = true;
              //     console.log(userFi.nombres, IsLoged);
              //     console.log('usuario de autoizacion-------------if 1-----------------------'); 
              //     res.status(200).send({userName: userFi.userName, IsLogedIn: true});
              //     console.log('usuario de autoizacion------------------------------------'); 
              //     return true;
                  
              //   }else{
                  
              //     console.log('usuario de autoizacion------------else 1------------------------'); 
                
              //   res.status(401).json({ IsLoged:IsLoged , error: 'Unauthorized' });
              // }})
      
    } else {
      // No se encontraron cookies en la solicitud
      console.log('usuario de autoizacion------------else 2------------------------'); 
      res.status(401).json({ IsLoged:IsLoged, error: 'Unauthorized' });
    }
      
  } catch (error) {
    console.log('usuario de autoizacion------------catch------------------------'); 

    res.status(430).json({ IsLoged:IsLoged,error: error });
    throw error; 
  }
}

}
