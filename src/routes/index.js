// ============================================================================
// routes/index.js — Router principal (punto de montaje /api)
// ============================================================================
// Agrupa todos los sub-routers bajo el prefijo /api (definido en app.js).
// Actúa como "tabla de contenidos" de la API:
//
//   /api/auth/*   → authRoutes.js  (registro, login — rutas públicas)
//   /api/users/*  → userRoutes.js  (perfil CRUD — rutas privadas con JWT)
//
// Este patrón permite agregar nuevos grupos de rutas fácilmente:
//   router.use('/posts', postRoutes);  →  /api/posts/*
//
// Exporta: router (usado en app.js como app.use('/api', apiRoutes))
// ============================================================================

import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';

const router = express.Router();
console.log('[ROUTES] Registrando rutas principales...');

router.use('/auth', authRoutes);
console.log('[ROUTES] ✓ /api/auth/* → authRoutes');
router.use('/users', userRoutes);
console.log('[ROUTES] ✓ /api/users/* → userRoutes');

export default router;