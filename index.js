/**
 * Orden recomendado para configurar una app de Express:
 *
 * 1. Middlewares globales (por ejemplo, app.use(express.json()), cors, etc.)
 * 2. Ruteadores o middlewares específicos (por ejemplo, app.use('/teachers', teachersRoutes))
 * 3. Rutas específicas (por ejemplo, app.get('/'), app.post('/login'), etc.)
 * 4. app.listen() para iniciar el servidor
 *
 * Este orden asegura:
 * - Todas las peticiones pasan primero por los middlewares y ruteadores.
 * - Las rutas específicas están disponibles después de aplicar los middlewares.
 * - El servidor comienza a escuchar solo cuando todo está correctamente configurado.
 */

// Importa el módulo express (framework para crear servidores web)
import express from 'express';

// Importa el ruteador de estudiantes
import estudiantesRoutes from './routes/estudiantes.routes.js';

// Importa el ruteador de profesores
import profesoresRoutes from './routes/profesores.routes.js';

// Crea una instancia de la aplicación Express (app principal de la API)
const app = express();

// Middleware para procesar datos JSON en las peticiones (convierte el body JSON a objeto JS)
app.use(express.json());

// Usa el ruteador de estudiantes bajo el prefijo '/estudiantes'
app.use('/estudiantes', estudiantesRoutes);

// Usa el ruteador de profesores bajo el prefijo '/profesores'
app.use('/profesores', profesoresRoutes);

// Ruta de ejemplo: responde a peticiones GET en la raíz "/"
// app.get define una ruta para el método HTTP GET
app.get('/', (req, res) => {
  // res.send envía una respuesta al cliente
  res.send('API RESTful running');
});

// Define el puerto donde correrá el servidor (por defecto 3000)
// process.env.PORT permite usar un puerto definido en variables de entorno
const PORT = process.env.PORT || 3000;

// Se coloca al final del archivo para asegurar que todas las rutas y middlewares estén configurados.
// app.listen inicia el servidor y lo pone a escuchar en el puerto definido.
// El callback se ejecuta cuando el servidor está listo.
// console.log muestra un mensaje indicando que el servidor está activo.

app.listen(PORT, () => {
  // console.log muestra un mensaje en la consola cuando el servidor está activo
  console.log(`Server listening on port ${PORT}`);
});

// Exporta la instancia de la app (útil para testing o modularización)
export default app;