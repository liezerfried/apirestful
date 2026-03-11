import express from 'express';
import { getProfile, updateProfile, deleteProfile } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { updateProfileValidation } from '../utils/validators.js';
import { handleValidationErrors, sanitizeInput } from '../middleware/validation.js';

const router = express.Router();

// ======================================
// MIDDLEWARE GLOBAL PARA TODAS LAS RUTAS
// ======================================

// Todas estas rutas requieren autenticación
router.use(authenticateToken);

// ======================================
// RUTAS PRIVADAS DE USUARIO
// ======================================

/**
 * @route   GET /api/users/profile
 * @desc    Obtener perfil del usuario autenticado
 * @access  Privado (requiere JWT)
 */
router.get('/profile', getProfile);

/**
 * @route   PUT /api/users/profile  
 * @desc    Actualizar perfil del usuario autenticado
 * @access  Privado (requiere JWT)
 * @body    { name?: string, email?: string, password?: string }
 */
router.put('/profile',
    sanitizeInput,              // 1. Limpiar datos de entrada
    updateProfileValidation,    // 2. Validar campos opcionales
    handleValidationErrors,     // 3. Manejar errores de validación
    updateProfile              // 4. Ejecutar controlador
);

/**
 * @route   DELETE /api/users/profile
 * @desc    Eliminar cuenta del usuario autenticado
 * @access  Privado (requiere JWT)
 */
router.delete('/profile', deleteProfile);

export default router;