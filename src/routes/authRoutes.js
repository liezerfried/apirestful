import express from 'express';
import { register, login } from '../controllers/authController.js';
import { registerValidation, loginValidation } from '../utils/validators.js';
import { handleValidationErrors, sanitizeInput } from '../middleware/validation.js';

const router = express.Router();

// ======================================
// RUTAS PÚBLICAS DE AUTENTICACIÓN
// ======================================

/**
 * @route   POST /api/auth/register
 * @desc    Registrar nuevo usuario con validaciones completas
 * @access  Público
 * @body    { name: string, email: string, password: string }
 */
router.post('/register', 
    sanitizeInput,           // 1. Limpiar datos de entrada
    registerValidation,      // 2. Validar campos
    handleValidationErrors,  // 3. Manejar errores de validación
    register                 // 4. Ejecutar controlador
);

/**
 * @route   POST /api/auth/login  
 * @desc    Iniciar sesión y obtener JWT con validaciones
 * @access  Público
 * @body    { email: string, password: string }
 */
router.post('/login',
    sanitizeInput,           // 1. Limpiar datos de entrada
    loginValidation,         // 2. Validar campos
    handleValidationErrors,  // 3. Manejar errores de validación
    login                    // 4. Ejecutar controlador
);

// ======================================
// RUTAS ADICIONALES (FUTURAS)
// ======================================

/**
 * @route   POST /api/auth/logout
 * @desc    Cerrar sesión (invalidar token)
 * @access  Privado
 * @future  Implementación futura con blacklist de tokens
 */
// router.post('/logout', authenticateToken, logout);

/**
 * @route   POST /api/auth/refresh
 * @desc    Renovar token JWT
 * @access  Privado  
 * @future  Implementación futura con refresh tokens
 */
// router.post('/refresh', authenticateToken, refreshToken);

/**
 * @route   GET /api/auth/verify
 * @desc    Verificar si token es válido
 * @access  Privado
 * @future  Útil para frontend
 */
// router.get('/verify', authenticateToken, verifyToken);

export default router;