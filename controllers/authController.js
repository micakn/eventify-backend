// controllers/authController.js
import UsuarioModel from '../models/UsuarioModel.js';
import { generarToken } from '../middleware/auth.js';

// Mostrar formulario de registro
export function mostrarRegistro(req, res) {
  res.render('auth/registro', {
    title: 'Registro - Eventify',
    error: null
  });
}

// ✍️ Procesar registro
export async function registrar(req, res) {
  try {
    const { nombre, email, password, passwordConfirm, rol, area } = req.body;

    // Validaciones
    if (!nombre || !email || !password || !rol || !area) {
      return res.render('auth/registro', {
        title: 'Registro - Eventify',
        error: 'Todos los campos son obligatorios'
      });
    }

    if (password !== passwordConfirm) {
      return res.render('auth/registro', {
        title: 'Registro - Eventify',
        error: 'Las contraseñas no coinciden'
      });
    }

    if (password.length < 6) {
      return res.render('auth/registro', {
        title: 'Registro - Eventify',
        error: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Verificar si el email ya existe
    const usuarioExistente = await UsuarioModel.getByEmail(email);
    if (usuarioExistente) {
      return res.render('auth/registro', {
        title: 'Registro - Eventify',
        error: 'El email ya está registrado'
      });
    }

    // Crear usuario
    const nuevoUsuario = await UsuarioModel.add({
      nombre,
      email,
      password,
      rol,
      area
    });

    if (!nuevoUsuario) {
      return res.render('auth/registro', {
        title: 'Registro - Eventify',
        error: 'Error al crear el usuario'
      });
    }

    // Generar token
    const token = generarToken(nuevoUsuario.id);

    // Guardar token en cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
    });

    res.redirect('/');
  } catch (error) {
    console.error('Error en registro:', error);
    res.render('auth/registro', {
      title: 'Registro - Eventify',
      error: 'Error al procesar el registro'
    });
  }
}

// 🔓 Mostrar formulario de login
export function mostrarLogin(req, res) {
  res.render('auth/login', {
    title: 'Iniciar Sesión - Eventify',
    error: null
  });
}

// Procesar login
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Validaciones
    if (!email || !password) {
      return res.render('auth/login', {
        title: 'Iniciar Sesión - Eventify',
        error: 'Email y contraseña son obligatorios'
      });
    }

    // Buscar usuario
    const usuario = await UsuarioModel.getByEmail(email);
    if (!usuario) {
      return res.render('auth/login', {
        title: 'Iniciar Sesión - Eventify',
        error: 'Email o contraseña incorrectos'
      });
    }

    // Verificar contraseña
    const passwordValido = await usuario.compararPassword(password);
    if (!passwordValido) {
      return res.render('auth/login', {
        title: 'Iniciar Sesión - Eventify',
        error: 'Email o contraseña incorrectos'
      });
    }

    // Generar token
    const token = generarToken(usuario._id);

    // Guardar token en cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
    });

    res.redirect('/');
  } catch (error) {
    console.error('Error en login:', error);
    res.render('auth/login', {
      title: 'Iniciar Sesión - Eventify',
      error: 'Error al procesar el login'
    });
  }
}

// Cerrar sesión
export function logout(req, res) {
  res.clearCookie('token');
  res.redirect('/auth/login');
}

// Obtener perfil del usuario actual
export async function perfil(req, res) {
  res.render('auth/perfil', {
    title: 'Mi Perfil - Eventify',
    usuario: req.usuario
  });
}