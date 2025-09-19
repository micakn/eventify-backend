const express = require('express');
const app = express();
const PORT = 3000;

// -------------------- Middleware --------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para recibir datos de formularios

// -------------------- Motor de vistas --------------------
app.set("view engine", "pug");
app.set("views", "./views");

// -------------------- Archivos estáticos --------------------
app.use(express.static('public'));

// -------------------- Middleware para variables globales --------------------
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

// -------------------- Rutas Web (Vistas) --------------------
const clienteWebRoutes = require('./routes/clienteWebRoutes');
app.use('/clientes', clienteWebRoutes);

// -------------------- Rutas API (JSON) --------------------
// Mantenemos las rutas API originales bajo /api
const clienteRoutes = require('./routes/clienteRoutes');
app.use('/api/clientes', clienteRoutes);

// -------------------- Ruta principal --------------------
app.get('/', (req, res) => {
  res.render('index', { 
    title: 'Eventify - Sistema de Gestión',
    currentPath: '/'
  });
});

// -------------------- Manejo de errores --------------------
// Vista de error
app.use('/error', (req, res) => {
  res.render('error', {
    title: 'Error - Eventify',
    message: req.query.message || 'Error desconocido'
  });
});

// Manejo de errores 404
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
  console.log(`- Vista web: http://localhost:${PORT}/clientes`);
  console.log(`- API JSON: http://localhost:${PORT}/api/clientes`);
});
