// tests/empleados.test.js
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import empleadoRoutes from '../routes/empleadoRoutes.js';
import { connectMongo, disconnectMongo } from '../db/mongoose.js';

const app = express();
app.use(express.json());

// Mock de middleware de autenticación para tests
app.use((req, res, next) => {
  req.usuario = { id: 'test-user', nombre: 'Test User' };
  next();
});

app.use('/api/empleados', empleadoRoutes);

describe('API de Empleados', () => {
  beforeAll(async () => {
    await connectMongo(process.env.MONGODB_URI);
  });

  afterAll(async () => {
    await disconnectMongo();
  });

  beforeEach(async () => {
    // Limpiar colección de empleados antes de cada prueba
    if (mongoose.connection.collections.empleados) {
      await mongoose.connection.collections.empleados.deleteMany({});
    }
  });

  describe('POST /api/empleados', () => {
    it('debe crear un empleado con datos válidos', async () => {
      const nuevoEmpleado = {
        nombre: 'Juan Pérez',
        rol: 'coordinador',
        area: 'Producción y Logística',
        email: 'juan@eventify.com'
      };

      const response = await request(app)
        .post('/api/empleados')
        .send(nuevoEmpleado);

      expect(response.status).toBe(201);
      expect(response.body.empleado.nombre).toBe('Juan Pérez');
      expect(response.body.empleado.rol).toBe('coordinador');
    });

    it('debe rechazar empleado con rol inválido', async () => {
      const empleadoInvalido = {
        nombre: 'Test',
        rol: 'rol_invalido',
        area: 'Producción y Logística'
      };

      const response = await request(app)
        .post('/api/empleados')
        .send(empleadoInvalido);

      expect(response.status).toBe(400);
      expect(response.body.mensaje).toContain('inválido');
    });
  });

  describe('GET /api/empleados', () => {
    it('debe retornar lista de empleados', async () => {
      const response = await request(app).get('/api/empleados');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});