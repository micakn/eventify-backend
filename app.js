const express = require("express");
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Motor de vistas
app.set("view engine", "pug");
app.set("views", "./views");

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Bienvenido/a a Eventify");
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
