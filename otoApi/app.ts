// import express from 'express';
// import morgan from 'morgan';
// import bodyParser from 'body-parser';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';
// import { connect } from './src/connexions/mongoDbConnection';
// import config from './configs';
// import indexRoutes from './src/routes/Index.Routes';

// const app = express();

// // Middlewares
// app.use(morgan('dev'));
// app.use(express.static('src/public'));
// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// app.use(cors());

// console.log('creando conexion')
// // Conexión a MongoDB
// connect()
//   .then(() => {
//     // Configuración de rutas
//     app.use(cookieParser());
//     app.use(indexRoutes);

//     app.listen(config.puerto, () => {
//       console.log('Servidor en el puerto', config.puerto);
//     });
//   })
//   .catch((error) => {
//     console.error('Error al conectar a MongoDB:', error);
//   });

import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connect } from './src/connexions/mongoDbConnection';
import config from './configs';
import indexRoutes from './src/routes/Index.Routes';

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(express.static('src/public'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Habilitar CORS
app.use(cors());

console.log('creando conexion');
// Conexión a MongoDB
connect()
  .then(() => {
    // Configuración de rutas
    app.use(cookieParser());
    app.use(indexRoutes);

    app.listen(config.puerto, () => {
      console.log('Servidor en el puerto', config.puerto);
    });
  })
  .catch((error) => {
    console.error('Error al conectar a MongoDB:', error);
  });
