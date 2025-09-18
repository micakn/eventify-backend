// Importamos los modelos necesarios
const TareaModel = require('../models/tareaModel');
const EmpleadoModel = require('../models/empleadoModel');
const EventoModel = require('../models/eventoModel');


  // -------------------- LISTAR TODAS LAS TAREAS --------------------
  // GET /tareas
 const listTareas = (req, res) => {
  const tareas = TareaModel.getAll();
  res.json(tareas);
};

  // -------------------- OBTENER UNA TAREA POR ID --------------------
  // GET /tareas/:id
const getTarea = (req, res) => {
  const { id } = req.params;
  const tarea = TareaModel.getById(id);

  if (!tarea) return res.status(404).json({ mensaje: 'Tarea no encontrada' });

  res.json(tarea);
};

  // -------------------- CREAR UNA NUEVA TAREA --------------------
  // POST /tareas
  const addTarea = (req, res) => {
  const tarea = req.body;

  // Validar que el empleado asignado exista
  if (tarea.empleadoAsignado && !EmpleadoModel.getById(tarea.empleadoAsignado)) {
    return res.status(400).json({ mensaje: 'Empleado asignado no existe' });
  }

  // Validar que el evento asignado exista
  if (tarea.eventoAsignado && !EventoModel.getById(tarea.eventoAsignado)) {
    return res.status(400).json({ mensaje: 'Evento asignado no existe' });
  }

  const nuevaTarea = TareaModel.add(tarea);
  res.status(201).json({ mensaje: 'Tarea creada', tarea: nuevaTarea });
};

  // -------------------- REEMPLAZAR UNA TAREA COMPLETA --------------------
  // PUT /tareas/:id
  const updateTarea = (req, res) => {
  const { id } = req.params;
  const tarea = req.body;

  // Validar referencias
  if (tarea.empleadoAsignado && !EmpleadoModel.getById(tarea.empleadoAsignado)) {
    return res.status(400).json({ mensaje: 'Empleado asignado no existe' });
  }
  if (tarea.eventoAsignado && !EventoModel.getById(tarea.eventoAsignado)) {
    return res.status(400).json({ mensaje: 'Evento asignado no existe' });
  }

  const actualizada = TareaModel.update(id, tarea);
  if (!actualizada) return res.status(404).json({ mensaje: 'Tarea no encontrada' });

  res.json({ mensaje: 'Tarea actualizada (PUT)', tarea: actualizada });
};


  // -------------------- ACTUALIZAR PARCIALMENTE UNA TAREA --------------------
  // PATCH /tareas/:id
  const patchTarea = (req, res) => {
  const { id } = req.params;
  const campos = req.body;

  // Validar referencias si se envían
  if (campos.empleadoAsignado && !EmpleadoModel.getById(campos.empleadoAsignado)) {
    return res.status(400).json({ mensaje: 'Empleado asignado no existe' });
  }
  if (campos.eventoAsignado && !EventoModel.getById(campos.eventoAsignado)) {
    return res.status(400).json({ mensaje: 'Evento asignado no existe' });
  }

  const actualizada = TareaModel.patch(id, campos);
  if (!actualizada) return res.status(404).json({ mensaje: 'Tarea no encontrada' });

  res.json({ mensaje: 'Tarea actualizada (PATCH)', tarea: actualizada });
};

  // -------------------- ELIMINAR UNA TAREA --------------------
  // DELETE /tareas/:id
  const deleteTarea = (req, res) => {
  const { id } = req.params;
  const eliminada = TareaModel.remove(id);

  if (!eliminada) return res.status(404).json({ mensaje: 'Tarea no encontrada' });

  res.json({ mensaje: 'Tarea eliminada', tarea: eliminada });
};


// Exportamos todas las funciones para usar en las rutas
module.exports = {listTareas, getTarea, addTarea, updateTarea, patchTarea, deleteTarea};
