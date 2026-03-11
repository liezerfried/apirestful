import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/index.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const app = express();
console.log('[APP] Instancia de Express creada');

// Middleware global
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log de cada petición entrante
app.use((req, res, next) => {
    console.log(`[APP] → ${req.method} ${req.originalUrl} desde ${req.ip}`);
    next();
});

// Rutas
app.use('/api', apiRoutes);
console.log('[APP] Rutas /api registradas');

// Middleware de manejo de errores (siempre al final)
app.use(errorHandler);
console.log('[APP] Middleware de errores registrado');

export default app;