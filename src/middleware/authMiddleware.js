import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

// Middleware único para autenticación JWT
// En este proyecto: Si estás autenticado → puedes acceder a TU perfil
export const authenticateToken = async (req, res, next) => {
    console.log(`[AUTH] Verificando autenticación para: ${req.method} ${req.originalUrl}`);
    try {
        // 1. Obtener token del header Authorization
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"
        
        if (!token) {
            console.log('[AUTH] ✗ Token no proporcionado');
            return res.status(401).json({
                success: false,
                message: 'Token de acceso requerido',
                error: 'AUTHENTICATION_REQUIRED'
            });
        }
        console.log('[AUTH] Token recibido, verificando...');

        // 2. Verificar el token JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(`[AUTH] Token decodificado → userId: ${decoded.userId}`);
        
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
        req.userId = user.id;
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
