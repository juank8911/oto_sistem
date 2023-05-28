import mongoose from 'mongoose';

export function connect(): Promise<void> {
  return new Promise((resolve, reject) => {
    mongoose
      .connect('mongodb://127.0.0.1:27017/Oto_Db', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as mongoose.ConnectOptions)
      .then(() => {
        console.log('Conexión establecida con éxito');
        resolve(); // Resuelve la promesa si la conexión es exitosa
      })
      .catch((error) => {
        console.error('Error al conectar a MongoDB:', error);
        reject(error); // Rechaza la promesa si hay un error en la conexión
      });
  });
}
