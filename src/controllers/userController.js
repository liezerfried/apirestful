import { User } from '../models/index.js';

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
        
        // Preparar datos para actualizar (solo campos que llegaron)
        const updateData = {};
        
        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (password !== undefined) updateData.password = password; // Se encriptará automáticamente por el hook
        
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