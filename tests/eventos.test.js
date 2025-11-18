// tests/eventos.test.js
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import eventoRoutes from '../routes/eventoRoutes.js';
import ClienteModel from '../models/ClienteModel.js';
import EmpleadoModel from '../models/EmpleadoModel.js';
import { connectMongo, disconnectMongo } from '../db/mongoose.js';

const app = express();
app.use(express.json());

// Mock de autenticación
app.use((req, res, next) => {
  req.usuario = { id: 'test-user', nombre: 'Test User' };
  next();
});

app.use('/api/eventos', eventoRoutes);

describe('API de Eventos', () => {
  let clienteTest;
  let empleadoTest;

  beforeAll(async () => {
    await connectMongo(process.env.MONGODB_URI);
    
    // Crear cliente y empleado para las relaciones
    clienteTest = await ClienteModel.add({
      nombre: 'Cliente Evento Test',
      email: 'cliente-evento@test.com',
      empresa: 'Test SA'
    });

    empleadoTest = await EmpleadoModel.add({
      nombre: 'Empleado Evento Test',
      rol: 'planner',
      area: 'Planificación y Finanzas',
      email: 'empleado-evento@test.com'
    });
  });

  afterAll(async () => {
    if (clienteTest) await ClienteModel.remove(clienteTest.id);
    if (empleadoTest) await EmpleadoModel.remove(empleadoTest.id);
    await disconnectMongo();
  });

  beforeEach(async () => {
    if (mongoose.connection.collections.eventos) {
      await mongoose.connection.collections.eventos.deleteMany({});
    }
  });

  describe('POST /api/eventos', () => {
    it('debe crear un evento completo', async () => {
      const nuevoEvento = {
        nombre: 'Conferencia Anual 2025',
        descripcion: 'Evento corporativo anual',
        fechaInicio: new Date('2025-12-15'),
        fechaFin: new Date('2025-12-16'),
        lugar: 'Hotel Sheraton',
        presupuesto: 50000,
        tipo: 'conferencia',
        estado: 'pendiente',
        clienteId: clienteTest.id,
        empleadoId: empleadoTest.id
      };

      const response = await request(app)
        .post('/api/eventos')
        .send(nuevoEvento);

      expect(response.status).toBe(201);
      expect(response.body.mensaje).toBe('Evento creado');
      expect(response.body.evento.nombre).toBe('Conferencia Anual 2025');
      expect(response.body.evento.tipo).toBe('conferencia');
    });

    it('debe crear evento sin cliente ni empleado asignado', async () => {
      const evento = {
        nombre: 'Evento Simple',
        fechaInicio: new Date('2025-11-20'),
        fechaFin: new Date('2025-11-21'),
        lugar: 'Centro Cultural'
      };

      const response = await request(app)
        .post('/api/eventos')
        .send(evento);

      expect(response.status).toBe(201);
      // Verificar que cuando no hay cliente asociado, el campo quede en null
      expect(response.body.evento.clienteId).toBeNull();
    });

    it('debe fallar sin nombre', async () => {
      const eventoInvalido = {
        fechaInicio: new Date('2025-12-01'),
        lugar: 'Sin nombre'
      };

      const response = await request(app)
        .post('/api/eventos')
        .send(eventoInvalido);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/eventos', () => {
    it('debe listar todos los eventos', async () => {
      // Crear varios eventos
      await request(app).post('/api/eventos').send({
        nombre: 'Evento 1',
        fechaInicio: new Date('2025-11-01'),
        fechaFin: new Date('2025-11-02'),
        lugar: 'Lugar 1'
      });

      await request(app).post('/api/eventos').send({
        nombre: 'Evento 2',
        fechaInicio: new Date('2025-11-10'),
        fechaFin: new Date('2025-11-11'),
        lugar: 'Lugar 2'
      });

      const response = await request(app).get('/api/eventos');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });
  });

  describe('PUT /api/eventos/:id', () => {
    it('debe actualizar un evento', async () => {
      const eventoCreado = await request(app).post('/api/eventos').send({
        nombre: 'Evento Original',
        fechaInicio: new Date('2025-12-01'),
        fechaFin: new Date('2025-12-02'),
        lugar: 'Lugar Original',
        estado: 'pendiente'
      });

      const eventoId = eventoCreado.body.evento.id;

      const response = await request(app)
        .put(`/api/eventos/${eventoId}`)
        .send({
          nombre: 'Evento Actualizado',
          fechaInicio: new Date('2025-12-01'),
          fechaFin: new Date('2025-12-02'),
          lugar: 'Nuevo Lugar',
          estado: 'activo'
        });

      expect(response.status).toBe(200);
      expect(response.body.evento.nombre).toBe('Evento Actualizado');
      expect(response.body.evento.estado).toBe('activo');
    });
  });

  describe('GET /api/eventos/:id', () => {
    it('debe obtener un evento con relaciones pobladas', async () => {
      const eventoCreado = await request(app).post('/api/eventos').send({
        nombre: 'Evento con Relaciones',
        fechaInicio: new Date('2025-12-01'),
        fechaFin: new Date('2025-12-02'),
        lugar: 'Centro de Eventos',
        clienteId: clienteTest.id,
        empleadoId: empleadoTest.id
      });

      const eventoId = eventoCreado.body.evento.id;

      const response = await request(app).get(`/api/eventos/${eventoId}`);

      expect(response.status).toBe(200);
      expect(response.body.nombre).toBe('Evento con Relaciones');
      // Verificar que las relaciones están pobladas
      expect(response.body.clienteId).toBeDefined();
      expect(response.body.empleadoId).toBeDefined();
    });
  });
});