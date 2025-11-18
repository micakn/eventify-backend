// tests/tareas.test.js
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import tareaRoutes from '../routes/tareaRoutes.js';
import EmpleadoModel from '../models/EmpleadoModel.js';
import EventoModel from '../models/EventoModel.js';
import { connectMongo, disconnectMongo } from '../db/mongoose.js';

const app = express();
app.use(express.json());

// Mock de autenticación
app.use((req, res, next) => {
  req.usuario = { id: 'test-user', nombre: 'Test User' };
  next();
});

app.use('/api/tareas', tareaRoutes);

describe('API de Tareas', () => {
  let empleadoTest;
  let eventoTest;

  beforeAll(async () => {
    await connectMongo(process.env.MONGODB_URI);
    
    // Crear empleado y evento de prueba para las tareas
    empleadoTest = await EmpleadoModel.add({
      nombre: 'Empleado Test',
      rol: 'coordinador',
      area: 'Producción y Logística',
      email: 'empleado@test.com'
    });

    // Crear un evento de prueba para asociarlo a las tareas que se crearán en los tests
    eventoTest = await EventoModel.add({
      nombre: 'Evento Test',
      descripcion: 'Evento de prueba',
      fechaInicio: new Date('2025-12-01'),
      fechaFin: new Date('2025-12-02'),
      lugar: 'Centro de Convenciones'
    });

    // Mostrar IDs creados para diagnóstico en caso de error
    console.log('Empleado Test creado:', empleadoTest?.id);
    console.log('Evento Test creado:', eventoTest?.id);
  });

  afterAll(async () => {
    // Limpiar datos de prueba
    if (empleadoTest) await EmpleadoModel.remove(empleadoTest.id);
    if (eventoTest) await EventoModel.remove(eventoTest.id);
    await disconnectMongo();
  });

  beforeEach(async () => {
    // Limpiar tareas antes de cada test
    if (mongoose.connection.collections.tareas) {
      await mongoose.connection.collections.tareas.deleteMany({});
    }
  });

  describe('POST /api/tareas', () => {
    it('debe crear una tarea válida', async () => {
      // Verificar que los datos existen antes de usarlos
      expect(empleadoTest).not.toBeNull();
      expect(eventoTest).not.toBeNull();
      expect(empleadoTest.id).toBeDefined();
      expect(eventoTest.id).toBeDefined();

      const nuevaTarea = {
        titulo: 'Tarea de Prueba',
        descripcion: 'Descripción de prueba',
        estado: 'pendiente',
        prioridad: 'alta',
        area: 'Producción y Logística',
        tipo: 'Coordinación con proveedores',
        empleadoAsignado: empleadoTest.id,
        eventoAsignado: eventoTest.id,
        horasEstimadas: 8
      };

      const response = await request(app)
        .post('/api/tareas')
        .send(nuevaTarea);

      expect(response.status).toBe(201);
      expect(response.body.mensaje).toBe('Tarea creada');
      expect(response.body.tarea.titulo).toBe('Tarea de Prueba');
    });

    it('debe validar el tipo de tarea según el área', async () => {
      const tareaInvalida = {
        titulo: 'Tarea Inválida',
        area: 'Producción y Logística',
        tipo: 'Carga y control del presupuesto del evento' // Este tipo es de Planificación
      };

      const response = await request(app)
        .post('/api/tareas')
        .send(tareaInvalida);

      expect(response.status).toBe(400);
      expect(response.body.mensaje).toContain('inválida');
    });

    it('debe crear tarea sin empleado asignado', async () => {
      const tarea = {
        titulo: 'Tarea sin empleado',
        area: 'Planificación y Finanzas',
        tipo: 'Firma de contratos con clientes/proveedores',
        estado: 'pendiente',
        prioridad: 'media'
      };

      const response = await request(app)
        .post('/api/tareas')
        .send(tarea);

      expect(response.status).toBe(201);
      expect(response.body.tarea.empleadoAsignado).toBeNull();
    });
  });

  describe('GET /api/tareas', () => {
    beforeEach(async () => {
      // Crear múltiples tareas para filtros
      await request(app).post('/api/tareas').send({
        titulo: 'Tarea Pendiente',
        area: 'Producción y Logística',
        tipo: 'Montaje de escenario o mobiliario',
        estado: 'pendiente',
        prioridad: 'alta'
      });

      await request(app).post('/api/tareas').send({
        titulo: 'Tarea En Proceso',
        area: 'Planificación y Finanzas',
        tipo: 'Seguimiento del cronograma y fechas clave',
        estado: 'en proceso',
        prioridad: 'baja'
      });

      await request(app).post('/api/tareas').send({
        titulo: 'Tarea Finalizada',
        area: 'Producción y Logística',
        tipo: 'Verificación técnica previa al evento',
        estado: 'finalizada',
        prioridad: 'media'
      });
    });

    it('debe listar todas las tareas', async () => {
      const response = await request(app).get('/api/tareas');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(3);
    });

    it('debe filtrar tareas por estado', async () => {
      const response = await request(app)
        .get('/api/tareas')
        .query({ estado: 'pendiente' });

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].estado).toBe('pendiente');
    });

    it('debe filtrar tareas por prioridad', async () => {
      const response = await request(app)
        .get('/api/tareas')
        .query({ prioridad: 'alta' });

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].prioridad).toBe('alta');
    });

    it('debe filtrar tareas por empleado asignado', async () => {
      // Verificar que empleadoTest existe
      expect(empleadoTest).not.toBeNull();
      expect(empleadoTest.id).toBeDefined();

      // Crear tarea con empleado específico
      await request(app).post('/api/tareas').send({
        titulo: 'Tarea con Empleado',
        area: 'Producción y Logística',
        tipo: 'Coordinación con proveedores',
        empleadoAsignado: empleadoTest.id
      });

      const response = await request(app)
        .get('/api/tareas')
        .query({ empleadoAsignado: empleadoTest.id });

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('PUT /api/tareas/:id', () => {
    it('debe actualizar una tarea existente', async () => {
      // Crear tarea
      const tareaCreada = await request(app).post('/api/tareas').send({
        titulo: 'Tarea Original',
        area: 'Producción y Logística',
        tipo: 'Coordinación con proveedores',
        estado: 'pendiente'
      });

      const tareaId = tareaCreada.body.tarea.id;

      // Actualizar tarea
      const response = await request(app)
        .put(`/api/tareas/${tareaId}`)
        .send({
          titulo: 'Tarea Actualizada',
          area: 'Producción y Logística',
          tipo: 'Coordinación con proveedores',
          estado: 'en proceso'
        });

      expect(response.status).toBe(200);
      expect(response.body.tarea.titulo).toBe('Tarea Actualizada');
      expect(response.body.tarea.estado).toBe('en proceso');
    });
  });

  describe('DELETE /api/tareas/:id', () => {
    it('debe eliminar una tarea existente', async () => {
      // Crear tarea
      const tareaCreada = await request(app).post('/api/tareas').send({
        titulo: 'Tarea a Eliminar',
        area: 'Planificación y Finanzas',
        tipo: 'Carga y control del presupuesto del evento'
      });

      const tareaId = tareaCreada.body.tarea.id;

      // Eliminar tarea
      const response = await request(app).delete(`/api/tareas/${tareaId}`);

      expect(response.status).toBe(200);
      expect(response.body.mensaje).toBe('Tarea eliminada');

      // Verificar que no existe
      const verificar = await request(app).get(`/api/tareas/${tareaId}`);
      expect(verificar.status).toBe(404);
    });
  });
});