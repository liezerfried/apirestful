import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Crear y configurar la instancia de Sequelize
console.log('[DATABASE] Configurando conexión Sequelize...');
const sequelize = new Sequelize({
    database: process.env.DB_NAME || 'api_restful',
    username: process.env.DB_USER || 'root', 
    password: process.env.DB_PASSWORD || 'root',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false, // Desactivar logs SQL en producción
    define: {
        timestamps: true, // Agregar createdAt y updatedAt
        underscored: false // Usar camelCase
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

// Función para conectar y autenticar
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

// Función para sincronizar modelos
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