// app.js
// -------------------- Imports --------------------
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';
import dotenv from 'dotenv';

// Importar routers
import tareaRoutes from './routes/tareaRoutes.js';
import empleadoRoutes from './routes/empleadoRoutes.js';
import clienteRoutes from './routes/clienteRoutes.js'; // API
import clienteWebRoutes from './routes/clienteWebRoutes.js'; // Vistas web
import eventoRoutes from './routes/eventoRoutes.js';

// Modelos (usarán Mongoose internamente)
import ClienteModel from './models/ClienteModel.js';
import EmpleadoModel from './models/EmpleadoModel.js';
import EventoModel from './models/EventoModel.js';
import TareaModel from './models/TareaModel.js';

// Conexión a Mongo
import { connectMongo } from './db/mongoose.js';

// -------------------- Configuración --------------------
dotenv.config(); // Cargar variables de entorno

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------- Middlewares --------------------
app.use(express.json()); // Permite recibir JSON
app.use(express.urlencoded({ extended: true })); // Formularios
app.use(methodOverride('_method')); // Permite usar DELETE/PUT desde formularios

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para currentPath (útil en layout)
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

// -------------------- Motor de vistas --------------------
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// -------------------- Rutas --------------------

// Ruta principal
app.get('/', async (req, res) => {
  try {
    const tareas = await TareaModel.getAll();
    const empleados = await EmpleadoModel.getAll();
    const clientes = await ClienteModel.getAll();
    const eventos = await EventoModel.getAll();

    res.render('index', {
      title: 'Eventify - Backend',
      tareas,
      empleados,
      clientes,
      eventos
    });
  } catch (error) {
    console.error('Error al cargar index:', error);
    res.status(500).render('error', { title: 'Error', message: 'Error al cargar la página principal' });
  }
});

// -------------------- Routers --------------------

// Web (vistas Pug)
app.use('/clientes', clienteWebRoutes);

// APIs (para pruebas con Thunder Client)
app.use('/api/clientes', clienteRoutes);
app.use('/api/empleados', empleadoRoutes);
app.use('/api/eventos', eventoRoutes);
app.use('/api/tareas', tareaRoutes);

// -------------------- Manejo de rutas no encontradas --------------------
app.use((req, res) => {
  res.status(404).render('error', { title: '404', message: 'Ruta no encontrada' });
});

// Iniciar servidor SOLO tras conectar a Mongo
connectMongo(process.env.MONGODB_URI)
.then(() => {
app.listen(PORT, () => {
console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
})
.catch((err) => {
console.error('❌ Error conectando a Mongo:', err);
process.exit(1);
});
