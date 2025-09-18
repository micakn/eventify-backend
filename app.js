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

// Ruta principal de prueba
app.get('/', (req, res) => {
  res.send('Bienvenido/a a Eventify');
});

// Rutas CRUD (datos en JSON)
const tareaRoutes = require('./routes/tareaRoutes');
app.use('/api/tareas', tareaRoutes); //http://localhost:3000/api/tareas

// Ruta para mostrar tareas en HTML
app.get('/tareas', async (req, res) => {
  const TareaModel = require('./models/TareaModel'); // Modelo que maneja los datos
  const tareas = await TareaModel.getAll();          // Obtenemos todas las tareas
  res.render('tareas', { tareas });                  // Renderizamos la vista
});

// Manejo de rutas no encontradas 
app.use((req, res) => {
  res.status(404).send('Ruta no encontrada');
});

// -------------------- Iniciar servidor --------------------
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
