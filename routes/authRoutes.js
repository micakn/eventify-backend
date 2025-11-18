// routes/authRoutes.js
import express from 'express';
import * as authController from '../controllers/authController.js';
import { verificarAuth } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas
router.get('/registro', authController.mostrarRegistro);
router.post('/registro', authController.registrar);
router.get('/login', authController.mostrarLogin);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Rutas protegidas
router.get('/perfil', verificarAuth, authController.perfil);

export default router;