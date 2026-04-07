// ============================================================================
// models/index.js — Centralización de modelos (Barrel Export)
// ============================================================================
// Patrón "Barrel Export": un único punto de entrada para importar todos
// los modelos de la aplicación. En lugar de que cada controlador importe
// directamente desde './models/User.js', importan desde './models/index.js'.
//
// Ventajas:
//   - Si se agregan más modelos (Post, Comment, etc.), solo se modifica este archivo
//   - Las relaciones entre modelos se definen aquí (has Many, belongsTo, etc.)
//   - Un solo lugar para inicializar todos los modelos con Sequelize
//
// Exporta: { User }, initModels()
// ============================================================================

// Centraliza las exportaciones de los modelos para facilitar su importación en otras partes de la aplicación

import sequelize from '../config/database.js';
import User from './User.js';

// Inicializar modelos con la conexión de Sequelize.
// User.init(sequelize) registra el modelo y asocia sus campos a la tabla 'users'.
// Esto se ejecuta al importar este módulo, ANTES de que startServer() llame a initModels().
console.log('[MODELS] Inicializando modelo User...');
User.init(sequelize);
console.log('[MODELS] Modelo User registrado en Sequelize');

// Aquí irían las relaciones entre modelos (futuro)
// User.hasMany(Post);
// Post.belongsTo(User);

// Exportar modelos
export { User };

export const initModels = async () => {};