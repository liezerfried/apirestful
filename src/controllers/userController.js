// ============================================================================
// userController.js — Controlador de Perfil de Usuario
// ============================================================================
// Gestiona las operaciones CRUD sobre el perfil del usuario AUTENTICADO.
// Todas las funciones asumen que el middleware authenticateToken ya verificó
// el JWT y colocó el usuario en req.user.
//
// Funciones exportadas:
//   - getProfile():    Obtiene los datos del usuario autenticado
//   - updateProfile(): Actualiza nombre, email y/o contraseña
//   - deleteProfile(): Elimina la cuenta permanentemente
//
// Importante: cada usuario solo puede ver/modificar/eliminar SU PROPIO perfil.
// El userId se obtiene de req.user.id (del token JWT), NO del body/params,
// lo que impide que un usuario modifique datos de otro.
// ============================================================================

import { User } from '../models/index.js';

// --- OBTENER PERFIL ---
// req.user.id viene del middleware authenticateToken (extraído del JWT).
// Se busca en BD por primary key para obtener datos frescos (el token
// podría haberse emitido hace horas y los datos pueden haber cambiado).
// GET /api/users/profile - Ver perfil del usuario autenticado
export const getProfile = async (req, res, next) => {
    console.log(`[CONTROLLER:User] Obteniendo perfil → userId: ${req.user.id}`);
    try {
        const user = await User.findByPk(req.user.id);
        
        if (!user) {
            console.log(`[CONTROLLER:User] ✗ Usuario ${req.user.id} no encontrado`);
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        
        console.log(`[CONTROLLER:User] ✓ Perfil obtenido: ${user.email}`);
        res.json({
            success: true,
            message: 'Perfil obtenido exitosamente',
            user: user
        });
        
    } catch (error) {
        console.error(`[CONTROLLER:User] ✗ Error obteniendo perfil: ${error.message}`);
        next(error);
    }
};

// --- ACTUALIZAR PERFIL ---
// Solo se actualizan los campos que el usuario envió en el body.
// Los campos no enviados se ignoran (actualización parcial).
// PUT /api/users/profile - Actualizar perfil del usuario autenticado
export const updateProfile = async (req, res, next) => {
    console.log(`[CONTROLLER:User] Actualizando perfil → userId: ${req.user.id}`);
    try {
        const { name, email, password } = req.body;
        const userId = req.user.id;
        console.log(`[CONTROLLER:User] Campos a actualizar: ${[name && 'name', email && 'email', password && 'password'].filter(Boolean).join(', ') || 'ninguno'}`);
        
        const user = await User.findByPk(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        
        // Construir objeto dinámico: solo incluye campos que llegaron en el body.
        // Esto permite actualización parcial (ej: solo cambiar el nombre).
        // Preparar datos para actualizar (solo campos que llegaron)
        const updateData = {};
        
        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (password !== undefined) updateData.password = password; // Se encriptará automáticamente por el hook
        
        // SEGURIDAD: verificar que el nuevo email no esté ya registrado por otro usuario.
        // Solo se verifica si el email cambió (email !== user.email), para evitar
        // consultas innecesarias cuando el usuario envía su mismo email.
        // Verificar si el email ya existe (si se está actualizando)
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: 'El email ya está en uso'
                });
            }
        }
        
        // Actualizar usuario
        console.log(`[CONTROLLER:User] Aplicando cambios en BD...`);
        await user.update(updateData);
        
        // Se hace una nueva consulta (findByPk) después del update para obtener
        // los datos actualizados y frescos de la BD, incluyendo cualquier
        // transformación aplicada por hooks o la base de datos.
        const updatedUser = await User.findByPk(userId);
        
        console.log(`[CONTROLLER:User] ✓ Perfil actualizado para: ${updatedUser.email}`);
        res.json({
            success: true,
            message: 'Perfil actualizado exitosamente',
            user: updatedUser
        });
        
    } catch (error) {
        console.error(`[CONTROLLER:User] ✗ Error actualizando perfil: ${error.message}`);
        next(error);
    }
};

// --- ELIMINAR CUENTA ---
// Eliminación permanente (hard delete). El usuario solo puede eliminar
// su propia cuenta. Se devuelven los datos del usuario eliminado como
// confirmación de qué se eliminó (ya no estará en la BD después).
// DELETE /api/users/profile - Eliminar cuenta del usuario autenticado
export const deleteProfile = async (req, res, next) => {
    console.log(`[CONTROLLER:User] Eliminando cuenta → userId: ${req.user.id}`);
    try {
        const userId = req.user.id;
        
        const user = await User.findByPk(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        
        await user.destroy();
        console.log(`[CONTROLLER:User] ✓ Cuenta eliminada: ${user.email} (id: ${user.id})`);
        
        res.json({
            success: true,
            message: 'Cuenta eliminada exitosamente',
            deletedUser: {
                id: user.id,
                name: user.name,
                email: user.email,
                deletedAt: new Date().toISOString()
            }
        });
        
    } catch (error) {
        next(error);
    }
};