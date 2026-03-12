// ============================================================================
// authController.js — Controlador de Autenticación
// ============================================================================
// Contiene la lógica de negocio para registro e inicio de sesión.
// Es la capa "C" (Controller) del patrón MVC:
//   Ruta → Middleware(s) → **Controlador** → Modelo → Base de datos
//
// Funciones exportadas:
//   - register(): Crea un nuevo usuario en la BD
//   - login():    Autentica credenciales y genera un token JWT
//
// Los errores no se manejan aquí directamente: se pasan al siguiente
// middleware con next(error), donde el errorHandler centralizado los procesa.
// ============================================================================

import { User } from '../models/index.js';
import jwt from 'jsonwebtoken';

// --- REGISTRO DE USUARIO ---
// Flujo: recibe datos del body → crea usuario en BD → responde con el usuario creado.
// La contraseña se encripta AUTOMÁTICAMENTE gracias al hook beforeCreate de User.js,
// por lo que aquí se pasa en texto plano y Sequelize se encarga del hash.
export const register = async (req, res, next) => {
    console.log('[CONTROLLER:Auth] Procesando registro de usuario...');
    try {
        const { name, email, password } = req.body;
        console.log(`[CONTROLLER:Auth] Datos recibidos → name: ${name}, email: ${email}`);
        
        // User.create() inserta un registro en la tabla 'users'.
        // Antes de insertar, el hook beforeCreate encripta la contraseña.
        // Después de insertar, toJSON() oculta la contraseña en la respuesta.
        console.log('[CONTROLLER:Auth] Creando usuario en BD...');
        const newUser = await User.create({
            name,
            email, 
            password  // Se envía en texto plano; el hook de Sequelize la encripta con bcrypt
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

// --- INICIO DE SESIÓN ---
// Flujo: busca usuario por email → compara contraseña → genera JWT si es válido.
//
// SEGURIDAD: Si el email no existe O la contraseña es incorrecta, se devuelve
// el MISMO mensaje genérico "Credenciales inválidas". Esto es intencional:
// si devolviéramos "email no encontrado" vs "contraseña incorrecta", un atacante
// podría enumerar emails válidos en el sistema (ataque de enumeración).
export const login = async (req, res, next) => {
    console.log('[CONTROLLER:Auth] Procesando login...');
    try {
        const { email, password } = req.body;
        console.log(`[CONTROLLER:Auth] Buscando usuario: ${email}`);
        
        const user = await User.findOne({ where: { email } });
        
        // Verificación combinada: si el usuario no existe O la contraseña no coincide,
        // se responde con el mismo error genérico (ver nota de seguridad arriba).
        if (!user || !(await user.comparePassword(password))) {
            console.log(`[CONTROLLER:Auth] ✗ Credenciales inválidas para: ${email}`);
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }
        
        // jwt.sign() crea un token firmado con el secreto del servidor.
        // Payload: solo userId (mínima información necesaria; evitar datos sensibles).
        // El token expira en 24h: después de ese tiempo, el usuario debe loguearse de nuevo.
        // El secreto JWT_SECRET se lee de .env y NUNCA debe exponerse al cliente.
        console.log(`[CONTROLLER:Auth] Generando JWT para userId: ${user.id}`);
        const token = jwt.sign(
            { userId: user.id },   // Payload: datos que viajan dentro del token
            process.env.JWT_SECRET, // Clave secreta para firmar (solo el servidor la conoce)
            { expiresIn: '24h' }    // Opciones: el token expira en 24 horas
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