const TareaModel = require('../models/TareaModel');
const EmpleadoModel = require('../models/empleadoModel');
const EventoModel = require('../models/eventoModel');

// Áreas y tareas posibles
const AREAS = {
  "Producción y Logística": ["Coordinación con proveedores", "Montaje de escenario", "Verificación técnica previa"],
  "Planificación y Finanzas": ["Carga y control del presupuesto", "Firma de contratos", "Seguimiento del cronograma"]
};

// -------------------- LISTAR TODAS LAS TAREAS --------------------
const listTareas = async (req, res) => {
  try {
    const tareas = await TareaModel.getAll();
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener tareas' });
  }
};

// -------------------- OBTENER UNA TAREA POR ID --------------------
const getTarea = async (req, res) => {
  try {
    const tarea = await TareaModel.getById(req.params.id);
    if (!tarea) return res.status(404).json({ mensaje: 'Tarea no encontrada' });
    res.json(tarea);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener tarea' });
  }
};

// -------------------- CREAR UNA NUEVA TAREA --------------------
const addTarea = async (req, res) => {
  try {
    const tarea = req.body;

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

    const nuevaTarea = await TareaModel.add(tarea);
    res.status(201).json({ mensaje: 'Tarea creada', tarea: nuevaTarea });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear tarea' });
  }
};

// -------------------- REEMPLAZAR UNA TAREA COMPLETA --------------------
const updateTarea = async (req, res) => {
  try {
    const tarea = req.body;
    const id = req.params.id;

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

    const actualizada = await TareaModel.update(id, tarea);
    if (!actualizada) return res.status(404).json({ mensaje: 'Tarea no encontrada' });

    res.json({ mensaje: 'Tarea actualizada', tarea: actualizada });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar tarea' });
  }
};

// -------------------- ACTUALIZAR PARCIALMENTE --------------------
const patchTarea = async (req, res) => {
  try {
    const campos = req.body;
    const id = req.params.id;

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

    const actualizada = await TareaModel.patch(id, campos);
    if (!actualizada) return res.status(404).json({ mensaje: 'Tarea no encontrada' });

    res.json({ mensaje: 'Tarea actualizada parcialmente', tarea: actualizada });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar tarea parcialmente' });
  }
};

// -------------------- ELIMINAR TAREA --------------------
const deleteTarea = async (req, res) => {
  try {
    const eliminada = await TareaModel.remove(req.params.id);
    if (!eliminada) return res.status(404).json({ mensaje: 'Tarea no encontrada' });
    res.json({ mensaje: 'Tarea eliminada', tarea: eliminada });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar tarea' });
  }
};

// -------------------- FILTRAR TAREAS --------------------
const filterTareas = async (req, res) => {
  try {
    let tareas = await TareaModel.getAll();
    const { estado, prioridad, tipoFecha, fecha, empleado, evento } = req.query;

    // Filtrar por estado
    if (estado) tareas = tareas.filter(t => t.estado === estado);

    // Filtrar por prioridad
    if (prioridad) tareas = tareas.filter(t => t.prioridad === prioridad);

    // Filtrar por fecha
    if (tipoFecha && fecha) {
      if (tipoFecha === 'creacion') {
        const ts = new Date(fecha).getTime();
        tareas = tareas.filter(t => t.id >= ts && t.id < ts + 24*60*60*1000);
      } else if (tipoFecha === 'inicio') {
        tareas = tareas.filter(t => t.fechaInicio === fecha);
      } else if (tipoFecha === 'fin') {
        tareas = tareas.filter(t => t.fechaFin === fecha);
      }
    }

    // Filtrar por empleado asignado
    if (empleado) tareas = tareas.filter(t => String(t.empleadoAsignado) === String(empleado));

    // Filtrar por evento asignado
    if (evento) tareas = tareas.filter(t => String(t.eventoAsignado) === String(evento));

    res.json(tareas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al filtrar tareas' });
  }
};

module.exports = { listTareas, getTarea, addTarea, updateTarea, patchTarea, deleteTarea, filterTareas };




