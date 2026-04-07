// ============================================================================
// authMiddleware.js — Middleware de Autenticación JWT
// ============================================================================
// Protege rutas privadas verificando que el cliente envie un token JWT válido.
// Se aplica como middleware ANTES de los controladores en las rutas protegidas.
//
// Flujo:
//   1. Extrae el token del header "Authorization: Bearer <token>"
//   2. Verifica la firma y expiración del token con jwt.verify()
//   3. Busca al usuario en la BD (por si fue eliminado después de emitir el token)
//   4. Adjunta el usuario a req.user para que los controladores lo usen
//
// El estándar "Bearer Token" (RFC 6750) define que el token se envía en:
//   Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
// "Bearer" significa "portador": quien porte este token tiene acceso.
//
// Exporta: authenticateToken (usado en routes/userRoutes.js)
// ============================================================================

import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

// Middleware único para autenticación JWT
// En este proyecto: Si estás autenticado → puedes acceder a TU perfil
export const authenticateToken = async (req, res, next) => {
    console.log(`[AUTH] Verificando autenticación para: ${req.method} ${req.originalUrl}`);
    try {
        // Extraer token: el header tiene formato "Bearer TOKEN".
        // split(' ')[1] obtiene solo la parte del token (sin "Bearer").
        // 1. Obtener token del header Authorization
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        
        if (!token) {
            console.log('[AUTH] ✗ Token no proporcionado');
            return res.status(401).json({
                success: false,
                message: 'Token de acceso requerido',
                error: 'AUTHENTICATION_REQUIRED'
            });
        }
        console.log('[AUTH] Token recibido, verificando...');

        // jwt.verify() hace dos cosas:
        //   a) Verifica que la firma sea válida (no fue manipulado)
        //   b) Verifica que no haya expirado (según expiresIn del login)
        // Si falla, lanza JsonWebTokenError o TokenExpiredError.
        // 2. Verificar el token JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(`[AUTH] Token decodificado → userId: ${decoded.userId}`);
        
        // Se busca al usuario en BD para verificar que aún exista.
        // Un token válido podría pertenecer a un usuario que fue eliminado
        // (el token sigue siendo criptográficamente válido hasta que expire).
        // 3. Buscar el usuario en la base de datos
        const user = await User.findByPk(decoded.userId);
        
        if (!user) {
            console.log(`[AUTH] ✗ Usuario con id ${decoded.userId} no encontrado en BD`);
            return res.status(401).json({
                success: false,
                message: 'Token inválido - usuario no encontrado',
                error: 'USER_NOT_FOUND'
            });
        }

        // 4. Agregar usuario a la request para uso en controladores
        req.user = user;
        console.log(`[AUTH] ✓ Usuario autenticado: ${user.email} (id: ${user.id})`);
        
        // 5. Continuar al siguiente middleware/controlador
        next();
        
    } catch (error) {
        // Token inválido o expirado
        if (error.name === 'JsonWebTokenError') {
            console.log('[AUTH] ✗ Token inválido:', error.message);
            return res.status(401).json({
                success: false,
                message: 'Token inválido',
                error: 'INVALID_TOKEN'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            console.log('[AUTH] ✗ Token expirado');
            return res.status(401).json({
                success: false,
                message: 'Token expirado - inicia sesión nuevamente',
                error: 'TOKEN_EXPIRED'
            });
        }
        
        // Otro error
        console.error('[AUTH] ✗ Error inesperado:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: 'AUTHENTICATION_ERROR'
        });
    }
};

// Exportación por defecto para compatibilidad
export default authenticateToken;
