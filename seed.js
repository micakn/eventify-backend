// seed.js
// -------------------- SEED - CARGA INICIAL DE DATOS --------------------
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectMongo, disconnectMongo } from './db/mongoose.js';

dotenv.config();

// -------------------- DEFINICIÓN DE MODELOS TEMPORALES --------------------
const Cliente =
  mongoose.models.Cliente ||
  mongoose.model(
    'Cliente',
    new mongoose.Schema({
      nombre: String,
      email: String,
      telefono: String,
      empresa: String,
      notas: String,
    })
  );

const Empleado =
  mongoose.models.Empleado ||
  mongoose.model(
    'Empleado',
    new mongoose.Schema({
      nombre: String,
      rol: String,
      area: String,
      email: String,
      telefono: String,
    })
  );

const Evento =
  mongoose.models.Evento ||
  mongoose.model(
    'Evento',
    new mongoose.Schema({
      nombre: String,
      descripcion: String,
      fechaInicio: Date,
      fechaFin: Date,
      lugar: String,
      clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente' },
      empleadoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Empleado' },
    })
  );

const Tarea =
  mongoose.models.Tarea ||
  mongoose.model(
    'Tarea',
    new mongoose.Schema({
      titulo: String,
      descripcion: String,
      estado: String,
      fechaInicio: Date,
      fechaFin: Date,
      prioridad: String,
      area: String,
      tipo: String,
      empleadoAsignado: { type: mongoose.Schema.Types.ObjectId, ref: 'Empleado' },
      eventoAsignado: { type: mongoose.Schema.Types.ObjectId, ref: 'Evento' },
      horasEstimadas: Number,
      horasReales: Number,
    })
  );

// -------------------- DATOS --------------------
const clientesSeed = [
  {
    nombre: 'Vitalia S.A.',
    email: 'contacto@vitalia.com',
    telefono: '+5491122334455',
    empresa: 'Vitalia',
    notas: 'Cliente corporativo del sector salud',
  },
  {
    nombre: 'Club Deportivo El Molino',
    email: 'clubelmolino@gmail.com',
    telefono: '+5491166677788',
    empresa: 'Club El Molino',
    notas: 'Cliente institucional con eventos anuales',
  },
  {
    nombre: 'Cultura Viva ONG',
    email: 'info@culturaviva.org',
    telefono: '+5491155522233',
    empresa: 'Cultura Viva',
    notas: 'Organización sin fines de lucro',
  },
  {
    nombre: 'Innovar S.R.L.',
    email: 'proyectos@innovar.com',
    telefono: '+5491188899911',
    empresa: 'Innovar',
    notas: 'Empresa tecnológica que organiza workshops mensuales',
  },
];

const empleadosSeed = [
  {
    nombre: 'Juan Gonzales',
    rol: 'coordinador',
    area: 'Producción y Logística',
    email: 'juan@example.com',
    telefono: '+541122223336',
  },
  {
    nombre: 'Sofía Ramírez',
    rol: 'planner',
    area: 'Planificación y Finanzas',
    email: 'sofia.ramirez@example.com',
    telefono: '+541133366677',
  },
  {
    nombre: 'Alex Lopez',
    rol: 'administrador',
    area: 'Administración',
    email: 'alex@example.com',
    telefono: '+541122223335',
  },
  {
    nombre: 'María Fernández',
    rol: 'planner',
    area: 'Planificación y Finanzas',
    email: 'maria.fernandez@example.com',
    telefono: '+541199955577',
  },
  {
    nombre: 'Gonzalo Pérez',
    rol: 'coordinador',
    area: 'Producción y Logística',
    email: 'gonzalo.perez@example.com',
    telefono: '+541144488899',
  },
];

const eventosSeed = [
  {
    nombre: 'Festival de Innovación',
    descripcion: 'Evento anual con charlas, talleres y networking',
    lugar: 'Centro de Convenciones',
    fechaInicio: new Date('2025-11-10'),
    fechaFin: new Date('2025-11-12'),
  },
  {
    nombre: 'Presentación App Eventify',
    descripcion: 'Lanzamiento del sistema de gestión Eventify',
    lugar: 'Auditorio Principal',
    fechaInicio: new Date('2025-12-01'),
    fechaFin: new Date('2025-12-02'),
  },
  {
    nombre: 'Expo Emprendedores 2025',
    descripcion: 'Feria de emprendimientos y rondas de inversión',
    lugar: 'Parque Tecnológico Buenos Aires',
    fechaInicio: new Date('2025-09-15'),
    fechaFin: new Date('2025-09-18'),
  },
  {
    nombre: 'Foro de Software Libre',
    descripcion: 'Charlas y paneles sobre código abierto y colaboración',
    lugar: 'Centro Cultural San Martín',
    fechaInicio: new Date('2025-08-22'),
    fechaFin: new Date('2025-08-23'),
  },
];

// -------------------- FUNCIÓN PRINCIPAL --------------------
async function seedDB() {
  await connectMongo(process.env.MONGODB_URI);
  console.log('Conectado a MongoDB Atlas');
  console.log('Limpiando base de datos...');

  await Promise.all([
    Cliente.deleteMany(),
    Empleado.deleteMany(),
    Evento.deleteMany(),
    Tarea.deleteMany(),
  ]);

  console.log('Insertando datos base...');
  const clientes = await Cliente.insertMany(clientesSeed);
  const empleados = await Empleado.insertMany(empleadosSeed);
  const eventos = await Evento.insertMany(eventosSeed);

  // Asignar clientes y empleados responsables a eventos (para que en la vista se vean ambas relaciones)
  try {
    await Promise.all([
      Evento.findByIdAndUpdate(eventos[0]._id, { clienteId: clientes[0]._id, empleadoId: empleados[0]._id }),
      Evento.findByIdAndUpdate(eventos[1]._id, { clienteId: clientes[3]._id, empleadoId: empleados[1]._id }),
      Evento.findByIdAndUpdate(eventos[2]._id, { clienteId: clientes[1]._id, empleadoId: empleados[2]._id }),
      Evento.findByIdAndUpdate(eventos[3]._id, { clienteId: clientes[2]._id, empleadoId: empleados[3]._id }),
    ]);
    console.log('Clientes y empleados asignados a eventos en seed');
  } catch (err) {
    console.error('Error asignando clientes/empleados a eventos en seed:', err);
  }

  const tareasSeed = [
    // ---- Producción y Logística ----
    {
      titulo: 'Coordinación con proveedores',
      descripcion: 'Gestionar catering, sonido y mobiliario del evento',
      estado: 'pendiente',
      prioridad: 'alta',
      area: 'Producción y Logística',
      tipo: 'Coordinación con proveedores',
      horasEstimadas: 6,
      empleadoAsignado: empleados[0]._id,
      eventoAsignado: eventos[0]._id,
    },
    {
      titulo: 'Montaje de escenario o mobiliario',
      descripcion: 'Supervisar montaje de escenario principal y señalética',
      estado: 'en proceso',
      prioridad: 'media',
      area: 'Producción y Logística',
      tipo: 'Montaje de escenario o mobiliario',
      horasEstimadas: 8,
      empleadoAsignado: empleados[4]._id,
      eventoAsignado: eventos[2]._id,
    },
    {
      titulo: 'Verificación técnica previa al evento',
      descripcion: 'Revisar iluminación, sonido y conectividad general',
      estado: 'finalizada',
      prioridad: 'alta',
      area: 'Producción y Logística',
      tipo: 'Verificación técnica previa',
      horasEstimadas: 4,
      empleadoAsignado: empleados[4]._id,
      eventoAsignado: eventos[1]._id,
    },
    {
      titulo: 'Supervisión de desmontaje post-evento',
      descripcion: 'Verificar retiro de equipos y mobiliario alquilado',
      estado: 'pendiente',
      prioridad: 'media',
      area: 'Producción y Logística',
      tipo: 'Montaje de escenario o mobiliario',
      horasEstimadas: 5,
      empleadoAsignado: empleados[0]._id,
      eventoAsignado: eventos[3]._id,
    },

    // ---- Planificación y Finanzas ----
    {
      titulo: 'Carga y control del presupuesto del evento',
      descripcion: 'Registrar gastos y controlar desviaciones presupuestarias',
      estado: 'finalizada',
      prioridad: 'alta',
      area: 'Planificación y Finanzas',
      tipo: 'Carga y control del presupuesto del evento',
      horasEstimadas: 5,
      empleadoAsignado: empleados[1]._id,
      eventoAsignado: eventos[1]._id,
    },
    {
      titulo: 'Firma de contratos con clientes/proveedores',
      descripcion: 'Revisar y firmar contratos legales y administrativos',
      estado: 'pendiente',
      prioridad: 'media',
      area: 'Planificación y Finanzas',
      tipo: 'Firma de contratos con clientes/proveedores',
      horasEstimadas: 3,
      empleadoAsignado: empleados[3]._id,
      eventoAsignado: eventos[2]._id,
    },
    {
      titulo: 'Seguimiento del cronograma y fechas clave',
      descripcion: 'Controlar hitos del evento y alertar desvíos',
      estado: 'en proceso',
      prioridad: 'media',
      area: 'Planificación y Finanzas',
      tipo: 'Seguimiento del cronograma y fechas clave',
      horasEstimadas: 4,
      empleadoAsignado: empleados[3]._id,
      eventoAsignado: eventos[0]._id,
    },
    {
      titulo: 'Elaboración de informe financiero post-evento',
      descripcion: 'Analizar costos reales vs estimados y elaborar informe final',
      estado: 'pendiente',
      prioridad: 'alta',
      area: 'Planificación y Finanzas',
      tipo: 'Carga y control del presupuesto del evento',
      horasEstimadas: 4,
      empleadoAsignado: empleados[1]._id,
      eventoAsignado: eventos[3]._id,
    },

    // ---- Administración ----
    {
      titulo: 'Mantenimiento de base de datos de clientes',
      descripcion: 'Actualizar información y contacto de clientes activos',
      estado: 'en proceso',
      prioridad: 'media',
      area: 'Administración',
      tipo: 'Gestión de usuarios del sistema',
      horasEstimadas: 2,
      empleadoAsignado: empleados[2]._id,
      eventoAsignado: eventos[1]._id,
    },
    {
      titulo: 'Control de permisos y accesos de usuarios',
      descripcion: 'Revisar roles y accesos de los empleados del sistema',
      estado: 'pendiente',
      prioridad: 'baja',
      area: 'Administración',
      tipo: 'Control de permisos y accesos',
      horasEstimadas: 3,
      empleadoAsignado: empleados[2]._id,
      eventoAsignado: eventos[2]._id,
    },
  ];

  await Tarea.insertMany(tareasSeed);
  console.log('Tareas cargadas correctamente');

  await disconnectMongo();
  console.log('Conexión cerrada con MongoDB');
}

// -------------------- EJECUCIÓN --------------------
seedDB()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Error al cargar datos:', err);
    process.exit(1);
  });
