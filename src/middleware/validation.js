// ============================================================================
// validation.js — Middleware de validación y sanitización de datos
// ============================================================================
// Contiene dos middleware que se ejecutan en cada ruta ANTES del controlador:
//
//   1. sanitizeInput(): Limpia los datos de entrada (trim de espacios)
//      Se ejecuta PRIMERO para que las validaciones trabajen con datos limpios.
//
//   2. handleValidationErrors(): Revisa si express-validator encontró errores
//      y los devuelve en formato consistente al cliente.
//
// El flujo en cada ruta es:
//   sanitizeInput → reglas de validación (validators.js) → handleValidationErrors → controlador
//
// Esto asegura que los datos llegan LIMPIOS y VALIDADOS al controlador,
// separando la lógica de validación de la lógica de negocio.
//
// Exporta: { handleValidationErrors, sanitizeInput }
// ============================================================================

import { validationResult } from 'express-validator';

/**
 * Middleware para manejar errores de validación de express-validator.
 * validationResult(req) recopila todos los errores que las reglas de validación
 * (definidas en validators.js) encontraron en req.body/params/query.
 * Si hay errores, responde con 400 y el detalle; si no, continúa con next().
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
 * Middleware para sanitizar datos de entrada.
 * Recorre todos los campos del body y elimina espacios en blanco al inicio
 * y final de cada string (trim). Esto previene problemas como:
 *   - Registros duplicados: " juan@email.com" vs "juan@email.com"
 *   - Nombres con espacios extra: "  Juan  "
 * Se ejecuta ANTES de las validaciones para que trabajen con datos limpios.
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