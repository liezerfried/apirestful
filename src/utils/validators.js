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

// ======================================
// VALIDACIONES GENERALES
// ======================================

/**
 * Validación para ID de parámetros
 */
export const idValidation = [
    body('id')
        .isInt({ min: 1 })
        .withMessage('El ID debe ser un número entero positivo')
];

/**
 * Validación solo para email
 */
export const emailValidation = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Debe ser un email válido')
        .normalizeEmail()
];

/**
 * Validación solo para password
 */
export const passwordValidation = [
    body('password')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres')
];