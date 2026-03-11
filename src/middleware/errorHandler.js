// Middleware global para manejo de errores
const errorHandler = (error, req, res, next) => {
    console.error(`[ERROR HANDLER] Error capturado en: ${req.method} ${req.originalUrl}`);
    console.error(`[ERROR HANDLER] Tipo: ${error.name} → ${error.message}`);
    let statusCode = 500;
    let message = 'Error interno del servidor';
    let details = null;

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
    
    // Errores de Sequelize - Registro no encontrado
    else if (error.name === 'SequelizeEmptyResultError') {
        statusCode = 404;
        message = 'Recurso no encontrado';
    }
    
    // Errores de conexión a base de datos
    else if (error.name === 'SequelizeConnectionError') {
        statusCode = 503;
        message = 'Error de conexión a la base de datos';
        details = process.env.NODE_ENV === 'development' ? error.message : null;
    }
    
    // Errores de JWT
    else if (error.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Token inválido';
    }
    
    else if (error.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expirado';
    }
    
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

    // En desarrollo, agregar stack trace
    if (process.env.NODE_ENV === 'development' && error.stack) {
        errorResponse.stack = error.stack;
    }

    res.status(statusCode).json(errorResponse);
};

export default errorHandler;
