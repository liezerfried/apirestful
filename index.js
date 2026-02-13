/**
 * Orden recomendado para la configuración de una app Express:
 *
 * 1. Middlewares globales (por ejemplo, app.use(express.json()), cors, etc.)
 * 2. Routers o middlewares específicos (por ejemplo, app.use('/teachers', teachersRoutes))
 * 3. Rutas específicas (por ejemplo, app.get('/'), app.post('/login'), etc.)
 * 4. app.listen() para iniciar el servidor
 *
 * Este orden asegura que:
 * - Todas las peticiones pasen primero por los middlewares y routers.
 * - Las rutas específicas estén disponibles después de aplicar los middlewares.
 * - El servidor comience a escuchar solo cuando todo está correctamente configurado.
 */

// Importa el módulo express (framework para crear servidores web)
import express from 'express';
// Importa el router de profesores
import teachersRoutes from './routes/teachersRoutes.js';

// Crea una instancia de la aplicación Express (app principal de la API)
const app = express();

// Middleware para procesar datos JSON en las peticiones (convierte el body JSON en objeto JS)
app.use(express.json());

// Usa el router de profesores bajo el prefijo '/teachers'
app.use('/teachers', teachersRoutes);

// Ruta de ejemplo: responde a solicitudes GET en la raíz "/"
// app.get define una ruta para el método HTTP GET
app.get('/', (req, res) => {
  // res.send envía una respuesta al cliente
  res.send('API RESTful funcionando');
});

// Define el puerto en el que se ejecutará el servidor (por defecto 3000)
// process.env.PORT permite usar un puerto definido en variables de entorno
const PORT = process.env.PORT || 3000;

// Inicia el servidor y lo pone a escuchar en el puerto definido
// app.listen inicia el servidor y ejecuta el callback cuando está listo
app.listen(PORT, () => {
  // console.log muestra un mensaje en la consola cuando el servidor está activo
  console.log(`Servidor escuchando en puerto ${PORT}`);
});

// Exporta la instancia de la aplicación (útil para pruebas o modularización)
export default app;