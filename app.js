const express = require('express');// Importamos el módulo Express
const app = express(); // Inicializamos la app de Express
const PORT = 3000;// Definimos el puerto en el que se ejecutará el servidor

// -------------------- Middleware --------------------
app.use(express.json()); // Permite recibir datos JSON en req.body
app.use(express.urlencoded({ extended: true })); // Para recibir datos de formularios

// -------------------- Motor de vistas --------------------
app.set("view engine", "pug"); // Usamos Pug
app.set("views", "./views");  // Carpeta de vistas

// -------------------- Rutas --------------------

// Ruta principal 
app.get('/', (req, res) => {
  res.render('index', { title: 'Eventify - Backend' });
});

// Routers de cada módulo
const tareaRoutes = require('./routes/tareaRoutes');
app.use('/tareas', tareaRoutes);

const empleadoRoutes = require('./routes/empleadoRoutes');
app.use('/empleados', empleadoRoutes);

const clienteRoutes = require('./routes/clienteRoutes');
app.use('/clientes', clienteRoutes);

const eventoRoutes = require('./routes/eventoRoutes');
app.use('/eventos', eventoRoutes);

// Manejo de rutas no encontradas 
app.use((req, res) => {
  res.status(404).send('Ruta no encontrada');
});

// -------------------- Iniciar servidor --------------------
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
