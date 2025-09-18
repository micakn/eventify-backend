// Importamos los modelos necesarios
const TareaModel = require('../models/tareaModel');
const EmpleadoModel = require('../models/empleadoModel');
const EventoModel = require('../models/eventoModel');

// Definimos áreas y tareas posibles
const AREAS = {
  "Producción y Logística": ["Coordinación con proveedores", "Montaje de escenario", "Verificación técnica previa"],
  "Planificación y Finanzas": ["Carga y control del presupuesto", "Firma de contratos", "Seguimiento del cronograma"]
};

// -------------------- LISTAR TODAS LAS TAREAS --------------------
// GET /tareas
const listTareas = (req, res) => {
  res.json(TareaModel.getAll());
};

// -------------------- OBTENER UNA TAREA POR ID --------------------
// GET /tareas/:id
const getTarea = (req, res) => {
  const tarea = TareaModel.getById(req.params.id);
  if (!tarea) return res.status(404).json({ mensaje: 'Tarea no encontrada' });
  res.json(tarea);
};

// -------------------- CREAR UNA NUEVA TAREA --------------------
// POST /tareas
const addTarea = (req, res) => {
  const tarea = req.body;

  // Validar empleado asignado
  if (tarea.empleadoAsignado && !EmpleadoModel.getById(tarea.empleadoAsignado)) {
    return res.status(400).json({ mensaje: 'Empleado asignado no existe' });
  }

  // Validar evento asignado
  if (tarea.eventoAsignado && !EventoModel.getById(tarea.eventoAsignado)) {
    return res.status(400).json({ mensaje: 'Evento asignado no existe' });
  }

  // Validar que el tipo de tarea corresponda al área
  if (tarea.area && tarea.tipo) {
    const tiposPermitidos = AREAS[tarea.area];
    if (!tiposPermitidos || !tiposPermitidos.includes(tarea.tipo)) {
      return res.status(400).json({ mensaje: `Tarea inválida para el área ${tarea.area}` });
    }
  }

  const nuevaTarea = TareaModel.add(tarea);
  res.status(201).json({ mensaje: 'Tarea creada', tarea: nuevaTarea });
};

// -------------------- REEMPLAZAR UNA TAREA COMPLETA --------------------
// PUT /tareas/:id
const updateTarea = (req, res) => {
  const { id } = req.params;
  const tarea = req.body;

  // Validaciones
  if (tarea.empleadoAsignado && !EmpleadoModel.getById(tarea.empleadoAsignado)) {
    return res.status(400).json({ mensaje: 'Empleado asignado no existe' });
  }
  if (tarea.eventoAsignado && !EventoModel.getById(tarea.eventoAsignado)) {
    return res.status(400).json({ mensaje: 'Evento asignado no existe' });
  }
  if (tarea.area && tarea.tipo) {
    const tiposPermitidos = AREAS[tarea.area];
    if (!tiposPermitidos || !tiposPermitidos.includes(tarea.tipo)) {
      return res.status(400).json({ mensaje: `Tarea inválida para el área ${tarea.area}` });
    }
  }

  const actualizada = TareaModel.update(id, tarea);
  if (!actualizada) return res.status(404).json({ mensaje: 'Tarea no encontrada' });
  res.json({ mensaje: 'Tarea actualizada', tarea: actualizada });
};

// -------------------- ACTUALIZAR PARCIALMENTE --------------------
// PATCH /tareas/:id
const patchTarea = (req, res) => {
  const { id } = req.params;
  const campos = req.body;

  if (campos.empleadoAsignado && !EmpleadoModel.getById(campos.empleadoAsignado)) {
    return res.status(400).json({ mensaje: 'Empleado asignado no existe' });
  }
  if (campos.eventoAsignado && !EventoModel.getById(campos.eventoAsignado)) {
    return res.status(400).json({ mensaje: 'Evento asignado no existe' });
  }
  if (campos.area && campos.tipo) {
    const tiposPermitidos = AREAS[campos.area];
    if (!tiposPermitidos || !tiposPermitidos.includes(campos.tipo)) {
      return res.status(400).json({ mensaje: `Tarea inválida para el área ${campos.area}` });
    }
  }

  const actualizada = TareaModel.patch(id, campos);
  if (!actualizada) return res.status(404).json({ mensaje: 'Tarea no encontrada' });
  res.json({ mensaje: 'Tarea actualizada parcialmente', tarea: actualizada });
};

// -------------------- ELIMINAR TAREA --------------------
// DELETE /tareas/:id
const deleteTarea = (req, res) => {
  const eliminada = TareaModel.remove(req.params.id);
  if (!eliminada) return res.status(404).json({ mensaje: 'Tarea no encontrada' });
  res.json({ mensaje: 'Tarea eliminada', tarea: eliminada });
};

// -------------------- FILTRAR TAREAS --------------------
// GET /tareas/filtro
// Filtros disponibles:
// ● Estado: pendiente, en proceso, finalizada
// ● Prioridad: alta, media, baja
// ● Fecha: creación, inicio, finalización
// ● Empleado asignado
// ● Evento asignado
const filterTareas = (req, res) => {
  let tareas = TareaModel.getAll();
  const { estado, prioridad, tipoFecha, fecha, empleado, evento } = req.query;

  // Filtrar por estado
  if (estado) tareas = tareas.filter(t => t.estado === estado);

  // Filtrar por prioridad
  if (prioridad) tareas = tareas.filter(t => t.prioridad === prioridad);

  // Filtrar por fecha
  if (tipoFecha && fecha) {
    if (tipoFecha === 'creacion') {
      // Filtra tareas creadas en la fecha indicada
      const ts = new Date(fecha).getTime();
      tareas = tareas.filter(t => t.id >= ts && t.id < ts + 24*60*60*1000);
    } else if (tipoFecha === 'inicio') {
      // Filtra por fecha de inicio
      tareas = tareas.filter(t => t.fechaInicio === fecha);
    } else if (tipoFecha === 'fin') {
      // Filtra por fecha de finalización
      tareas = tareas.filter(t => t.fechaFin === fecha);
    }
  }

  // Filtrar por empleado asignado
  if (empleado) tareas = tareas.filter(t => String(t.empleadoAsignado) === String(empleado));

  // Filtrar por evento asignado
  if (evento) tareas = tareas.filter(t => String(t.eventoAsignado) === String(evento));

  res.json(tareas);
};


// Exportamos funciones
module.exports = { listTareas, getTarea, addTarea, updateTarea, patchTarea, deleteTarea, filterTareas };



