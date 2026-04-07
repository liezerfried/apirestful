// ============================================================================
// validators.js — Reglas de validación con express-validator
// ============================================================================
// Define las reglas de validación para cada ruta usando express-validator.
// Cada exportación es un array de reglas que se pasa como middleware en las rutas.
//
// express-validator usa el patrón "builder" (encadenamiento de métodos):
//   body('campo').trim().notEmpty().isLength({ min: 2 })...
//
// Métodos clave usados:
//   - trim():           Elimina espacios al inicio/final
//   - notEmpty():       El campo no puede estar vacío
//   - isEmail():        Verifica formato de email válido
//   - normalizeEmail(): Estandariza el email (ej: mayúsculas → minúsculas)
//   - isLength():       Valida largo mínimo/máximo
//   - matches():        Valida contra una expresión regular (regex)
//   - optional():       El campo es opcional (solo valida si está presente)
//   - withMessage():    Mensaje de error personalizado si la regla falla
//
// Estas reglas NO envían respuesta; solo acumulan errores que luego
// handleValidationErrors() (validation.js) revisa y responde.
//
// Exporta: { registerValidation, loginValidation, updateProfileValidation }
// ============================================================================

import { body } from 'express-validator';

// ======================================
// VALIDACIONES DE AUTENTICACIÓN
// ======================================

/**
 * Validaciones para registro de usuario
 */
export const registerValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('El nombre es obligatorio')
        .isLength({ min: 2, max: 50 })
        .withMessage('El nombre debe tener entre 2 y 50 caracteres')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        .withMessage('El nombre solo puede contener letras y espacios'),
    
    body('email')
        .trim()
        .isEmail()
        .withMessage('Debe ser un email válido')
        .normalizeEmail()
        .isLength({ max: 100 })
        .withMessage('El email no puede exceder 100 caracteres'),
    
    body('password')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres')
        // Regex con lookaheads ("mirar adelante"):
        //   (?=.*[a-z]) → Debe haber al menos 1 minúscula en algún lugar
        //   (?=.*[A-Z]) → Debe haber al menos 1 mayúscula en algún lugar
        //   (?=.*\d)    → Debe haber al menos 1 dígito en algún lugar
        // Los lookaheads verifican condiciones SIN consumir caracteres,
        // lo que permite verificar múltiples reglas en una sola regex.
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('La contraseña debe contener al menos: 1 minúscula, 1 mayúscula y 1 número')
];

/**
 * Validaciones para login de usuario
 */
export const loginValidation = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Debe ser un email válido')
        .normalizeEmail(),
    
    body('password')
        .notEmpty()
        .withMessage('La contraseña es obligatoria')
];

// ======================================
// VALIDACIONES DE USUARIO (PERFIL)
// ======================================

/**
 * Validaciones para actualizar perfil
 */
export const updateProfileValidation = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('El nombre debe tener entre 2 y 50 caracteres')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        .withMessage('El nombre solo puede contener letras y espacios'),
    
    body('email')
        .optional()
        .trim()
        .isEmail()
        .withMessage('Debe ser un email válido')
        .normalizeEmail()
        .isLength({ max: 100 })
        .withMessage('El email no puede exceder 100 caracteres'),
    
    body('password')
        .optional()
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('La contraseña debe contener al menos: 1 minúscula, 1 mayúscula y 1 número')
];
