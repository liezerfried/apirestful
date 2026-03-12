// ============================================================================
// server.js — Punto de entrada de la aplicación
// ============================================================================
// Este archivo orquesta el arranque SECUENCIAL del servidor:
//   1. Carga variables de entorno (.env)
//   2. Conecta a MySQL (authenticate)
//   3. Inicializa los modelos de Sequelize
//   4. Sincroniza las tablas en la base de datos
//   5. Levanta el servidor HTTP con Express
//
// ¿Por qué secuencial? Porque el servidor NO debe aceptar peticiones HTTP
// hasta que la base de datos esté lista. Si se aceptaran peticiones antes,
// cualquier consulta a la BD fallaría.
// ============================================================================

import app from './app.js';
import dotenv from 'dotenv';
import { connectDB, syncDatabase } from './config/database.js';
import { initModels } from './models/index.js';

// 1. Cargar variables de entorno desde el archivo .env a process.env
dotenv.config();
console.log('[SERVER] Variables de entorno cargadas');

// 2. Configurar puerto del servidor
const PORT = process.env.PORT || 3000;

// 3. Función para iniciar el servidor
const startServer = async () => {
    console.log('[SERVER] Iniciando secuencia de arranque...');
    try {
        // Conectar a la base de datos ANTES de iniciar el servidor
        console.log('[SERVER] Paso 1/4: Conectando a la base de datos...');
        await connectDB();
        
        // Inicializar modelos
        console.log('[SERVER] Paso 2/4: Inicializando modelos...');
        await initModels();
        
        // Sincronizar base de datos
        console.log('[SERVER] Paso 3/4: Sincronizando base de datos...');
        await syncDatabase();
        
        console.log('[SERVER] Paso 4/4: Sistema de base de datos completamente inicializado');

        // Iniciar el servidor HTTP
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
            console.log(`📱 API disponible en: http://localhost:${PORT}/api`);
            console.log(`📋 Endpoints disponibles:`);
            console.log(`   POST /api/auth/register - Registrarse`);
            console.log(`   POST /api/auth/login - Iniciar sesión`);
            console.log(`   GET /api/users/profile - Ver perfil (requiere token)`);
            console.log(`   PUT /api/users/profile - Actualizar perfil (requiere token)`);
            console.log(`   DELETE /api/users/profile - Eliminar cuenta (requiere token)`);
        });
    } catch (error) {
        console.error('[SERVER] ❌ Error crítico al iniciar:', error.message);
        console.error('[SERVER] Stack:', error.stack);
        // process.exit(1) termina el proceso de Node.js con código de error.
        // Código 1 = error genérico. Se usa porque si la BD no conecta,
        // el servidor no puede funcionar y es mejor fallar rápido (fail-fast).
        process.exit(1);
    }
};

// 4. Ejecutar el servidor
console.log('[SERVER] Ejecutando startServer()...');
startServer();