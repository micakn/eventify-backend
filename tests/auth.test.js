// tests/auth.test.js
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from '../routes/authRoutes.js';
import { connectMongo, disconnectMongo } from '../db/mongoose.js';

// Configurar __dirname para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

  // Configurar Pug como motor de vistas para que los tests puedan renderizar formularios
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../views'));

app.use('/auth', authRoutes);

describe('Sistema de Autenticación', () => {
  beforeAll(async () => {
    await connectMongo(process.env.MONGODB_URI);
  });

  afterAll(async () => {
    await disconnectMongo();
  });

  beforeEach(async () => {
    // Limpiar usuarios de prueba
    if (mongoose.connection.collections.usuarios) {
      await mongoose.connection.collections.usuarios.deleteMany({
        email: /test.*@example\.com/
      });
    }
  });

  describe('POST /auth/registro', () => {
    it('debe registrar un nuevo usuario correctamente', async () => {
      const nuevoUsuario = {
        nombre: 'Usuario Test',
        email: 'test-nuevo@example.com',
        password: 'password123',
        passwordConfirm: 'password123',
        rol: 'coordinador',
        area: 'Producción y Logística'
      };

      const response = await request(app)
        .post('/auth/registro')
        .send(nuevoUsuario);

      expect(response.status).toBe(302); // Redirección
      expect(response.headers['set-cookie']).toBeDefined(); // Cookie JWT
    });

    it('debe fallar si las contraseñas no coinciden', async () => {
      const usuarioInvalido = {
        nombre: 'Usuario Test',
        email: 'test-invalido@example.com',
        password: 'password123',
        passwordConfirm: 'password456',
        rol: 'coordinador',
        area: 'Producción y Logística'
      };

      const response = await request(app)
        .post('/auth/registro')
        .send(usuarioInvalido);

      expect(response.status).toBe(200); // Renderiza form con error
      expect(response.text).toContain('contraseñas no coinciden');
    });

    it('debe fallar si el email ya existe', async () => {
      const usuario = {
        nombre: 'Usuario Duplicado',
        email: 'test-duplicado@example.com',
        password: 'password123',
        passwordConfirm: 'password123',
        rol: 'planner',
        area: 'Planificación y Finanzas'
      };

      // Crear primer usuario
      await request(app).post('/auth/registro').send(usuario);

      // Intentar crear segundo con mismo email
      const response = await request(app)
        .post('/auth/registro')
        .send(usuario);

      expect(response.status).toBe(200);
      expect(response.text).toContain('email ya está registrado');
    });

    it('debe fallar si la contraseña es muy corta', async () => {
      const usuario = {
        nombre: 'Usuario Test',
        email: 'test-corto@example.com',
        password: '12345',
        passwordConfirm: '12345',
        rol: 'coordinador',
        area: 'Administración'
      };

      const response = await request(app)
        .post('/auth/registro')
        .send(usuario);

      expect(response.status).toBe(200);
      expect(response.text).toContain('al menos 6 caracteres');
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      // Crear usuario de prueba para login
      await request(app).post('/auth/registro').send({
        nombre: 'Usuario Login',
        email: 'test-login@example.com',
        password: 'password123',
        passwordConfirm: 'password123',
        rol: 'administrador',
        area: 'Administración'
      });
    });

    it('debe iniciar sesión con credenciales correctas', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test-login@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(302); // Redirección
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('debe fallar con contraseña incorrecta', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test-login@example.com',
          password: 'incorrecta'
        });

      expect(response.status).toBe(200);
      expect(response.text).toContain('Email o contraseña incorrectos');
    });

    it('debe fallar con email inexistente', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'noexiste@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.text).toContain('Email o contraseña incorrectos');
    });
  });

  describe('GET /auth/logout', () => {
    it('debe cerrar sesión y limpiar cookie', async () => {
      const response = await request(app).get('/auth/logout');

      expect(response.status).toBe(302); // Redirección
      expect(response.headers['set-cookie'][0]).toContain('token=;');
    });
  });
});