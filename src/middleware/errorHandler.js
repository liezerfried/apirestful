// ============================================================================
// errorHandler.js — Middleware centralizado de manejo de errores
// ============================================================================
// En Express, un middleware con EXACTAMENTE 4 parámetros (error, req, res, next)
// es reconocido automáticamente como "error-handling middleware".
// Express redirige aquí cualquier error lanzado con throw o pasado con next(error).
//
// Este middleware categoriza los errores por tipo y devuelve respuestas
// HTTP consistentes con códigos de estado apropiados:
//   - 400: Errores de validación (datos inválidos del cliente)
//   - 401: Errores de autenticación (JWT inválido/expirado)
//   - 404: Recurso no encontrado
//   - 409: Conflicto (ej: email duplicado)
//   - 503: Base de datos no disponible
//   - 500: Error interno no clasificado
//
// DEBE registrarse DESPUÉS de todas las rutas en app.js (app.use(errorHandler))
// para poder capturar errores de cualquier controlador o middleware.
//
// Exporta: función errorHandler (usada en app.js)
// ============================================================================

// Middleware global para manejo de errores.
// Express lo identifica como error handler por tener 4 parámetros: (error, req, res, next).
// Si se quita alguno (incluso 'next'), Express NO lo reconoce como error handler.
const errorHandler = (error, req, res, next) => {
    console.error(`[ERROR HANDLER] Error capturado en: ${req.method} ${req.originalUrl}`);
    console.error(`[ERROR HANDLER] Tipo: ${error.name} → ${error.message}`);
    let statusCode = 500;
    let message = 'Error interno del servidor';
    let details = null;

    // --- CLASIFICACIÓN DE ERRORES ---
    // Cada tipo de error de Sequelize/JWT tiene un 'name' específico
    // que permite identificarlo y asignar el código HTTP correcto.

    // Sequelize - Validación: campos que no cumplen las reglas del modelo
    // (ej: allowNull: false y se envía null)
    // Errores de Sequelize - Validación
    if (error.name === 'SequelizeValidationError') {
        statusCode = 400;
        message = 'Errores de validación';
        details = error.errors.map(err => ({
            field: err.path,
            message: err.message,
            value: err.value
        }));
    }
    
    // Sequelize - Constraint único violado: se intentó insertar un valor duplicado
    // en un campo con unique: true (ej: email ya registrado).
    // Errores de Sequelize - Constraint único (email duplicado)
    else if (error.name === 'SequelizeUniqueConstraintError') {
        statusCode = 409;
        message = 'Recurso ya existe';
        details = error.errors.map(err => ({
            field: err.path,
            message: `${err.path} ya está en uso`,
            value: err.value
        }));
    }
    
    // Sequelize - Registro no encontrado (cuando se usa rejectOnEmpty: true)
    // Errores de Sequelize - Registro no encontrado
    else if (error.name === 'SequelizeEmptyResultError') {
        statusCode = 404;
        message = 'Recurso no encontrado';
    }
    
    // Sequelize - La base de datos no está accesible (MySQL apagado, red caída, etc.)
    // En producción se oculta el detalle técnico por seguridad.
    // Errores de conexión a base de datos
    else if (error.name === 'SequelizeConnectionError') {
        statusCode = 503;
        message = 'Error de conexión a la base de datos';
        details = process.env.NODE_ENV === 'development' ? error.message : null;
    }
    
    // JWT - Token con firma inválida o formato incorrecto
    // Errores de JWT
    else if (error.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Token inválido';
    }
    
    // JWT - Token válido pero ya expiró (pasó el tiempo de expiresIn)
    else if (error.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expirado';
    }
    
    // JSON malformado: el cliente envió un body que no es JSON válido
    // (ej: {name: "test"  ← falta cerrar llave)
    // Errores de sintaxis JSON
    else if (error.type === 'entity.parse.failed') {
        statusCode = 400;
        message = 'JSON malformado en la solicitud';
    }
    
    // Errores personalizados con statusCode
    else if (error.statusCode) {
        statusCode = error.statusCode;
        message = error.message || message;
        details = error.details || null;
    }
    
    // Error genérico
    else if (error.message) {
        message = error.message;
    }

    // Log del error en desarrollo
    if (process.env.NODE_ENV === 'development') {
        console.error('🔥 Error detectado:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            statusCode,
            url: req.originalUrl,
            method: req.method,
            ip: req.ip,
            userAgent: req.get('User-Agent')
        });
    }

    // Respuesta consistente de error
    const errorResponse = {
        success: false,
        message,
        statusCode,
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
        method: req.method
    };

    // Agregar detalles solo si existen
    if (details) {
        errorResponse.details = details;
    }

    // SEGURIDAD: El stack trace (ruta de archivos y líneas de código) solo se
    // incluye en desarrollo. En producción, exponer el stack revela la estructura
    // interna del servidor, lo que facilita ataques.
    // En desarrollo, agregar stack trace
    if (process.env.NODE_ENV === 'development' && error.stack) {
        errorResponse.stack = error.stack;
    }

    res.status(statusCode).json(errorResponse);
};

export default errorHandler;
