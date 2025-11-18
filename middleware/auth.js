// middleware/auth.js
import jwt from 'jsonwebtoken';
import UsuarioModel from '../models/UsuarioModel.js';

// Generar Token JWT
export function generarToken(userId) {
  const secret = process.env.JWT_SECRET || 'eventify-test-secret';
  if (!process.env.JWT_SECRET) console.warn('JWT_SECRET no definido. Usando secreto por defecto de desarrollo.');
  return jwt.sign(
    { id: userId },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// Middleware: Verificar que el usuario esté autenticado
export async function verificarAuth(req, res, next) {
  try {
    // 1. Obtener token de las cookies o del header
    const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).render('auth/login', {
        title: 'Acceso Denegado',
        error: 'Debes iniciar sesión para acceder a esta página'
      });
    }

    // 2. Verificar token
    const secret = process.env.JWT_SECRET || 'eventify-test-secret';
    const decoded = jwt.verify(token, secret);

    // 3. Buscar usuario
    const usuario = await UsuarioModel.getById(decoded.id);
    if (!usuario) {
      return res.status(401).render('auth/login', {
        title: 'Acceso Denegado',
        error: 'Usuario no encontrado'
      });
    }

    // 4. Agregar usuario a la request
    req.usuario = usuario;
    res.locals.usuario = usuario; // Para usarlo en las vistas
    next();
  } catch (error) {
    console.error('Error de autenticación:', error);
    return res.status(401).render('auth/login', {
      title: 'Acceso Denegado',
      error: 'Token inválido o expirado'
    });
  }
}

// Middleware: Verificar roles específicos
export function verificarRol(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ mensaje: 'No autenticado' });
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).render('error', {
        title: 'Acceso Denegado',
        message: `Solo usuarios con rol ${rolesPermitidos.join(' o ')} pueden acceder`
      });
    }

    next();
  };
}