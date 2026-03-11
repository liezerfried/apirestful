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