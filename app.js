// -------------------- Imports --------------------
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';
import dotenv from 'dotenv';

// Importar routers
import tareaRoutes from './routes/tareaRoutes.js';
import empleadoRoutes from './routes/empleadoRoutes.js';
import clienteRoutes from './routes/clienteRoutes.js';
import eventoRoutes from './routes/eventoRoutes.js';

// Importar modelos para renderizar datos en index
import TareaModel from './models/TareaModel.js';
import EmpleadoModel from './models/EmpleadoModel.js';
import ClienteModel from './models/ClienteModel.js';
import EventoModel from './models/EventoModel.js';

// -------------------- Configuración --------------------
dotenv.config(); // Cargar variables de entorno

const app = express();
const PORT = process.env.PORT || 3000; // <-- ahora sí PORT existe

// Configuración de __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------- Middlewares --------------------
app.use(express.json()); // Permite recibir JSON
app.use(express.urlencoded({ extended: true })); // Formularios
app.use(methodOverride('_method')); // Permite usar DELETE/PUT desde formularios

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// -------------------- Motor de vistas --------------------
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// -------------------- Rutas --------------------

// Ruta principal
app.get('/', async (req, res) => {
  try {
    // Obtenemos todos los datos para mostrar en el index
    const tareas = await TareaModel.getAll();
    const empleados = await EmpleadoModel.getAll();
    const clientes = await ClienteModel.getAll();
    const eventos = await EventoModel.getAll();

    // Renderizamos la vista index con los datos
    res.render('index', { 
      title: 'Eventify - Backend', 
      tareas, 
      empleados, 
      clientes, 
      eventos 
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar la página');
  }
});

// Routers de cada módulo
app.use('/tareas', tareaRoutes);
app.use('/empleados', empleadoRoutes);
app.use('/clientes', clienteRoutes);
app.use('/eventos', eventoRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).send('Ruta no encontrada');
});

// -------------------- Iniciar servidor --------------------
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
})





/* kjh// -------------------- Imports --------------------
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';
import dotenv from 'dotenv';

// Importar routers
import tareaRoutes from './routes/tareaRoutes.js';
import empleadoRoutes from './routes/empleadoRoutes.js';
import clienteRoutes from './routes/clienteRoutes.js';
import eventoRoutes from './routes/eventoRoutes.js';

// -------------------- Configuración --------------------
dotenv.config(); // Cargar variables de entorno

const app = express();
const PORT = process.env.PORT || 3000; // <-- ahora sí PORT existe

// Configuración de __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------- Middlewares --------------------
app.use(express.json()); // Permite recibir JSON
app.use(express.urlencoded({ extended: true })); // Formularios
app.use(methodOverride('_method')); // Permite usar DELETE/PUT desde formularios

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// -------------------- Motor de vistas --------------------
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// -------------------- Rutas --------------------

// Ruta principal
app.get('/', (req, res) => {
  res.render('index', { title: 'Eventify - Backend' });
});

// Routers de cada módulo
app.use('/tareas', tareaRoutes);
app.use('/empleados', empleadoRoutes);
app.use('/clientes', clienteRoutes);
app.use('/eventos', eventoRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).render('error', {
    title: '404 - No encontrado',
    message: 'La página que buscas no existe'
  });
});

// Manejo de errores generales
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).render('error', {
    title: 'Error - Eventify',
    message: 'Error interno del servidor'
  });
});

// -------------------- Iniciar servidor --------------------
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
}); */