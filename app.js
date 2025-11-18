// app.js
// -------------------- Imports --------------------
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'; 
import jwt from 'jsonwebtoken';

// Importar rutas de autenticación
import authRoutes from './routes/authRoutes.js'; 
import { verificarAuth } from './middleware/auth.js'; 

// Importar routers API
import tareaRoutes from './routes/tareaRoutes.js';
import empleadoRoutes from './routes/empleadoRoutes.js';
import clienteRoutes from './routes/clienteRoutes.js';
import eventoRoutes from './routes/eventoRoutes.js';

// Importar routers WEB (vistas)
import clienteWebRoutes from './routes/clienteWebRoutes.js';
import eventoWebRoutes from './routes/eventoWebRoutes.js';
import empleadoWebRoutes from './routes/empleadoWebRoutes.js'; // Rutas web para manejo de empleados (vistas)
import tareaWebRoutes from './routes/tareaWebRoutes.js';       // Rutas web para manejo de tareas (vistas)

// Modelos (usarán Mongoose internamente)
import ClienteModel from './models/ClienteModel.js';
import EmpleadoModel from './models/EmpleadoModel.js';
import EventoModel from './models/EventoModel.js';
import TareaModel from './models/TareaModel.js';
import UsuarioModel from './models/UsuarioModel.js';

// Conexión a Mongo
import { connectMongo } from './db/mongoose.js';

// -------------------- Configuración --------------------
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------- Middlewares --------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser());

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'publics')));

// Middleware global para verificar usuario en TODAS las vistas
app.use(async (req, res, next) => {
  res.locals.currentPath = req.path;
  res.locals.usuario = null;
  
  try {
    const token = req.cookies?.token;
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const usuario = await UsuarioModel.getById(decoded.id);
      
      if (usuario) {
        res.locals.usuario = usuario;
        req.usuario = usuario;
      }
    }
  } catch (error) {
    // Silenciosamente continuar sin usuario
  }
  
  next();
});

// -------------------- Motor de vistas --------------------
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// -------------------- Rutas Públicas --------------------
app.use('/auth', authRoutes);

// -------------------- Ruta Principal --------------------
app.get('/', verificarAuth, async (req, res) => {
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
    res.status(500).render('error', { 
      title: 'Error', 
      message: 'Error al cargar la página principal' 
    });
  }
});

// -------------------- Rutas Web Protegidas --------------------
app.use('/clientes', verificarAuth, clienteWebRoutes);
app.use('/eventos', verificarAuth, eventoWebRoutes);
// Registrar rutas web protegidas (requieren autenticación)
app.use('/empleados', verificarAuth, empleadoWebRoutes);
app.use('/tareas', verificarAuth, tareaWebRoutes);

// -------------------- APIs Protegidas --------------------
app.use('/api/clientes', verificarAuth, clienteRoutes);
app.use('/api/empleados', verificarAuth, empleadoRoutes);
app.use('/api/eventos', verificarAuth, eventoRoutes);
app.use('/api/tareas', verificarAuth, tareaRoutes);

// -------------------- Manejo de rutas no encontradas --------------------
app.use((req, res) => {
  res.status(404).render('error', { 
    title: '404', 
    message: 'Ruta no encontrada' 
  });
});

// -------------------- Iniciar Servidor --------------------
connectMongo(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
          console.log(`Autenticación: http://localhost:${PORT}/auth/login`);
      console.log(`Dashboard: http://localhost:${PORT}/`);
    });
  })
  .catch((err) => {
    console.error('Error conectando a Mongo:', err);
    process.exit(1);
  });