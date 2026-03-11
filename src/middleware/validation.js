import { validationResult } from 'express-validator';

/**
 * Middleware para manejar errores de validación de express-validator
 * @param {Object} req - Request object
 * @param {Object} res - Response object  
 * @param {Function} next - Next middleware function
 */
export const handleValidationErrors = (req, res, next) => {
    console.log(`[VALIDATION] Verificando datos para: ${req.method} ${req.originalUrl}`);
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        const errorDetails = errors.array().map(error => ({
            field: error.path || error.param,
            message: error.msg,
            value: error.value,
            location: error.location
        }));
        console.log(`[VALIDATION] ✗ ${errorDetails.length} error(es) encontrado(s):`, errorDetails.map(e => `${e.field}: ${e.message}`).join(', '));
        return res.status(400).json({
            success: false,
            message: 'Errores de validación en los datos enviados',
            errors: errorDetails
        });
    }
    
    console.log('[VALIDATION] ✓ Datos válidos, continuando...');
    next();
};

/**
 * Middleware para sanitizar datos comunes
 * @param {Object} req - Request object
 * @param {Object} res - Response object  
 * @param {Function} next - Next middleware function
 */
export const sanitizeInput = (req, res, next) => {
    console.log('[SANITIZE] Limpiando datos de entrada...');
    if (req.body) {
        const fields = Object.keys(req.body);
        console.log(`[SANITIZE] Campos recibidos: ${fields.join(', ')}`);
        fields.forEach(key => {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].trim();
            }
        });
    }
    console.log('[SANITIZE] ✓ Datos sanitizados');
    next();
};