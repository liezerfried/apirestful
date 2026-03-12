// ============================================================================
// app.js — Configuración de Express y middleware global
// ============================================================================
// Configura la instancia de Express con todos los middleware en el orden
// correcto. El ORDEN de los middleware es crítico en Express:
//
//   1. cors()             → Permite peticiones desde otros dominios (CORS)
//   2. express.json()     → Parsea el body de peticiones JSON
//   3. express.urlencoded → Parsea datos de formularios HTML
//   4. Logger de petición → Log informativo de cada request entrante
//   5. Rutas (/api)       → Enruta a los controladores correspondientes
//   6. errorHandler       → Captura CUALQUIER error no manejado (siempre al final)
//
// Si el errorHandler se registrara antes de las rutas, nunca capturaría
// errores de los controladores. Express ejecuta middleware en orden de registro.
//
// Exporta: instancia de Express configurada (usada por server.js)
// ============================================================================

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import apiRoutes from './routes/index.js';
import errorHandler from './middleware/errorHandler.js';

// En ESM (ES Modules) no existe __dirname como en CommonJS.
// Se reconstruye manualmente usando import.meta.url (URL del archivo actual)
// y fileURLToPath() para convertir la URL a ruta del sistema de archivos.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
console.log('[APP] Instancia de Express creada');

// Motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
console.log('[APP] Motor de plantillas EJS configurado');

// Archivos estáticos (CSS, JS, imágenes)
app.use(express.static(path.join(__dirname, 'public')));
console.log('[APP] Archivos estáticos servidos desde /public');

// Middleware global — Se ejecutan en CADA petición, en este orden:
// cors(): Agrega headers Access-Control-Allow-* para permitir peticiones
//         desde orígenes distintos (ej: frontend en otro puerto).
app.use(cors());
// express.json(): Parsea el body de peticiones con Content-Type: application/json
//                 y lo coloca en req.body como objeto JavaScript.
app.use(express.json());
// express.urlencoded(): Parsea datos de formularios HTML (Content-Type: application/x-www-form-urlencoded).
//                       extended: true permite objetos anidados usando la librería qs.
app.use(express.urlencoded({ extended: true }));

// Log de cada petición entrante
app.use((req, res, next) => {
    console.log(`[APP] → ${req.method} ${req.originalUrl} desde ${req.ip}`);
    next();
});

// Rutas
app.use('/api', apiRoutes);
console.log('[APP] Rutas /api registradas');

// Vista principal (frontend de pruebas)
app.get('/', (req, res) => {
    res.render('index', { title: 'API RESTful - Test Panel' });
});
console.log('[APP] Vista EJS disponible en /');

// Middleware de manejo de errores (siempre al final)
app.use(errorHandler);
console.log('[APP] Middleware de errores registrado');

export default app;