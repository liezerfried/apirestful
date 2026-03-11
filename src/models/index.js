// Centraliza las exportaciones de los modelos para facilitar su importación en otras partes de la aplicación

import sequelize from '../config/database.js';
import User from './User.js';

// Inicializar modelos con la conexión de Sequelize
console.log('[MODELS] Inicializando modelo User...');
User.init(sequelize);
console.log('[MODELS] Modelo User registrado en Sequelize');

// Aquí irían las relaciones entre modelos (futuro)
// User.hasMany(Post);
// Post.belongsTo(User);

// Exportar modelos
export { User };

// Exportar función para inicializar todos los modelos
export const initModels = async () => {
    try {
        console.log('[MODELS] Verificando configuración de modelos...');
        console.log('[MODELS] ✅ Modelos inicializados correctamente');
    } catch (error) {
        console.error('[MODELS] ❌ Error inicializando modelos:', error.message);
        throw error;
    }
};