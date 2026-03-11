// 👇 IMPORTA el modelo User  
import { User } from '../models/index.js';
import jwt from 'jsonwebtoken';

// 👇 EXPORTA funciones que usa authRoutes
export const register = async (req, res, next) => {
    console.log('[CONTROLLER:Auth] Procesando registro de usuario...');
    try {
        const { name, email, password } = req.body;
        console.log(`[CONTROLLER:Auth] Datos recibidos → name: ${name}, email: ${email}`);
        
        console.log('[CONTROLLER:Auth] Creando usuario en BD...');
        const newUser = await User.create({
            name,
            email, 
            password
        });
        
        console.log(`[CONTROLLER:Auth] ✓ Usuario registrado → id: ${newUser.id}, email: ${newUser.email}`);
        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            user: newUser
        });
        
    } catch (error) {
        console.error(`[CONTROLLER:Auth] ✗ Error en registro: ${error.message}`);
        next(error);
    }
};

export const login = async (req, res, next) => {
    console.log('[CONTROLLER:Auth] Procesando login...');
    try {
        const { email, password } = req.body;
        console.log(`[CONTROLLER:Auth] Buscando usuario: ${email}`);
        
        const user = await User.findOne({ where: { email } });
        
        if (!user || !(await user.comparePassword(password))) {
            console.log(`[CONTROLLER:Auth] ✗ Credenciales inválidas para: ${email}`);
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }
        
        console.log(`[CONTROLLER:Auth] Generando JWT para userId: ${user.id}`);
        const token = jwt.sign(
            { userId: user.id }, 
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        console.log(`[CONTROLLER:Auth] ✓ Login exitoso → ${user.email} (id: ${user.id})`);
        res.json({
            success: true,
            message: 'Login exitoso',
            token,
            user
        });
        
    } catch (error) {
        console.error(`[CONTROLLER:Auth] ✗ Error en login: ${error.message}`);
        next(error);
    }
};