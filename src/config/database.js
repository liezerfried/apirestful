// ============================================================================
// database.js — Configuración de la conexión a MySQL con Sequelize
// ============================================================================
// Sequelize es un ORM (Object-Relational Mapping) que permite interactuar
// con MySQL usando objetos JavaScript en lugar de escribir SQL directamente.
//
// Este archivo configura la conexión y exporta dos funciones:
//   - connectDB():    Verifica que MySQL esté accesible (authenticate)
//   - syncDatabase(): Crea/actualiza las tablas según los modelos definidos
//
// Exporta: instancia de Sequelize (usada por los modelos para definir tablas)
// ============================================================================

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Crear instancia de Sequelize con la configuración de conexión a MySQL.
// Los valores se toman de las variables de entorno (.env) con fallbacks por defecto.
console.log('[DATABASE] Configurando conexión Sequelize...');
const sequelize = new Sequelize({
    database: process.env.DB_NAME || 'api_restful',
    username: process.env.DB_USER || 'root', 
    password: process.env.DB_PASSWORD || 'root',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',   // Indica a Sequelize que usamos MySQL (también soporta PostgreSQL, SQLite, etc.)
    logging: false,      // Desactivar logs de consultas SQL en consola (poner console.log para debug)
    define: {
        timestamps: true,   // Agrega automáticamente columnas createdAt y updatedAt a cada tabla
        underscored: false  // Nombres en camelCase (createdAt) en vez de snake_case (created_at)
    },
    // Pool de conexiones: reutiliza conexiones existentes en lugar de abrir una nueva
    // por cada consulta, mejorando el rendimiento significativamente.
    pool: {
        max: 5,         // Máximo 5 conexiones simultáneas al pool
        min: 0,         // Mínimo 0 conexiones (se crean bajo demanda)
        acquire: 30000, // Tiempo máximo (ms) para obtener una conexión antes de error
        idle: 10000     // Tiempo máximo (ms) que una conexión puede estar inactiva antes de liberarse
    }
});

// authenticate() solo VERIFICA que la conexión a MySQL funcione (hace un SELECT 1+1).
// NO crea tablas ni modifica la base de datos. Es un "ping" a MySQL.
export const connectDB = async () => {
    try {
        console.log(`[DATABASE] Intentando conectar a ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}/${process.env.DB_NAME || 'api_restful'}...`);
        await sequelize.authenticate();
        console.log('[DATABASE] ✅ Conexión a MySQL establecida correctamente');
        return sequelize;
    } catch (error) {
        console.error('[DATABASE] ❌ Error conectando:', error.message);
        throw error;
    }
};

// sync() compara los modelos definidos en JavaScript con las tablas en MySQL.
// Si la tabla no existe, la crea. Si ya existe, no la modifica (modo por defecto).
// Opciones: sync({ force: true }) elimina y recrea tablas (¡PELIGROSO en producción!).
//           sync({ alter: true }) modifica tablas existentes para coincidir con el modelo.
export const syncDatabase = async () => {
    try {
        console.log('[DATABASE] Sincronizando tablas...');
        await sequelize.sync(); 
        console.log('[DATABASE] ✅ Tablas sincronizadas correctamente');
    } catch (error) {
        console.error('[DATABASE] ❌ Error sincronizando:', error.message);
        throw error;
    }
};

export { sequelize };
export default sequelize;