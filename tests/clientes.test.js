// tests/clientes.test.js
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import clienteRoutes from '../routes/clienteRoutes.js';
import ClienteModel from '../models/ClienteModel.js'; // Importa el modelo Cliente para crear datos de prueba en los tests
import { connectMongo, disconnectMongo } from '../db/mongoose.js';

const app = express();
app.use(express.json());

// Mock de middleware de autenticación para tests
app.use((req, res, next) => {
  req.usuario = { id: 'test-user', nombre: 'Test User' };
  next();
});

app.use('/api/clientes', clienteRoutes);

describe('API de Clientes', () => {
  beforeAll(async () => {
    await connectMongo(process.env.MONGODB_URI);
  });

  afterAll(async () => {
    await disconnectMongo();
  });

  beforeEach(async () => {
    // Limpiar colección de clientes antes de cada prueba
    if (mongoose.connection.collections.clientes) {
      await mongoose.connection.collections.clientes.deleteMany({});
    }
  });

  describe('GET /api/clientes', () => {
    it('debe retornar un array vacío cuando no hay clientes', async () => {
      const response = await request(app).get('/api/clientes');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    it('debe retornar todos los clientes', async () => {
      // Crear clientes de prueba
      await ClienteModel.add({
        nombre: 'Cliente Test 1',
        email: 'test1@example.com',
        telefono: '123456789',
        empresa: 'Test SA'
      });

      const response = await request(app).get('/api/clientes');
      
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].nombre).toBe('Cliente Test 1');
    });
  });

  describe('POST /api/clientes', () => {
    it('debe crear un nuevo cliente con datos válidos', async () => {
      const nuevoCliente = {
        nombre: 'Nuevo Cliente',
        email: 'nuevo@example.com',
        telefono: '987654321',
        empresa: 'Nueva Empresa'
      };

      const response = await request(app)
        .post('/api/clientes')
        .send(nuevoCliente);

      expect(response.status).toBe(201);
      expect(response.body.mensaje).toBe('Cliente creado');
      expect(response.body.cliente.nombre).toBe(nuevoCliente.nombre);
    });

    it('debe fallar al crear cliente sin nombre', async () => {
      const clienteInvalido = {
        email: 'invalido@example.com'
      };

      const response = await request(app)
        .post('/api/clientes')
        .send(clienteInvalido);

      expect(response.status).toBe(400);
      expect(response.body.mensaje).toContain('obligatorios');
    });
  });

  describe('GET /api/clientes/:id', () => {
    it('debe retornar un cliente por ID', async () => {
      const cliente = await ClienteModel.add({
        nombre: 'Cliente Test',
        email: 'test@example.com',
        telefono: '111222333'
      });

      const response = await request(app).get(`/api/clientes/${cliente.id}`);

      expect(response.status).toBe(200);
      expect(response.body.nombre).toBe('Cliente Test');
    });

    it('debe retornar 404 si el cliente no existe', async () => {
      const response = await request(app).get('/api/clientes/507f1f77bcf86cd799439011');

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/clientes/:id', () => {
    it('debe eliminar un cliente existente', async () => {
      const cliente = await ClienteModel.add({
        nombre: 'Cliente a Eliminar',
        email: 'eliminar@example.com'
      });

      const response = await request(app).delete(`/api/clientes/${cliente.id}`);

      expect(response.status).toBe(200);
      expect(response.body.mensaje).toBe('Cliente eliminado');

      // Verificar que realmente se eliminó
      const verificar = await ClienteModel.getById(cliente.id);
      expect(verificar).toBeNull();
    });
  });
});