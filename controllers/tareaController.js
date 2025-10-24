// -------------------- CONTROLADOR DE TAREAS --------------------
import TareaModel from '../models/TareaModel.js';

// -------------------- ÁREAS Y TIPOS DE TAREAS --------------------
const AREAS = {
  "Producción y Logística": [
    "Coordinación con proveedores",
    "Montaje de escenario o mobiliario",
    "Verificación técnica previa al evento"
  ],
  "Planificación y Finanzas": [
    "Carga y control del presupuesto del evento",
    "Firma de contratos con clientes/proveedores",
    "Seguimiento del cronograma y fechas clave"
  ]
};

// -------------------- LISTAR Y FILTRAR TAREAS --------------------
async function listTareas(req, res) {
  try {
    const { estado, prioridad, fechaInicio, fechaFin, empleadoAsignado, eventoAsignado } = req.query;
    let tareas = await TareaModel.getAll();

    if (estado) tareas = tareas.filter(t => t.estado === estado);
    if (prioridad) tareas = tareas.filter(t => t.prioridad === prioridad);
    if (empleadoAsignado) tareas = tareas.filter(t => String(t.empleadoAsignado?._id) === String(empleadoAsignado));
    if (eventoAsignado) tareas = tareas.filter(t => String(t.eventoAsignado?._id) === String(eventoAsignado));

    if (fechaInicio && fechaFin) {
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);
      tareas = tareas.filter(t => t.fechaInicio && t.fechaFin && t.fechaInicio >= inicio && t.fechaFin <= fin);
    }

    res.json(tareas);
  } catch (error) {
    console.error('Error al listar tareas:', error);
    res.status(500).json({ mensaje: 'Error al obtener tareas' });
  }
}

// -------------------- OBTENER UNA TAREA POR ID --------------------
async function getTarea(req, res) {
  try {
    const tarea = await TareaModel.getById(req.params.id);
    if (!tarea) return res.status(404).json({ mensaje: 'Tarea no encontrada' });
    res.json(tarea);
  } catch (error) {
    console.error('Error al obtener tarea:', error);
    res.status(500).json({ mensaje: 'Error al obtener tarea' });
  }
}

// -------------------- CREAR NUEVA TAREA --------------------
async function addTarea(req, res) {
  try {
    const tarea = req.body;
    if (tarea.area && tarea.tipo) {
      const tipos = AREAS[tarea.area];
      if (!tipos || !tipos.includes(tarea.tipo)) {
        return res.status(400).json({ mensaje: `Tarea inválida para el área ${tarea.area}` });
      }
    }

    const nuevaTarea = await TareaModel.add(tarea);
    res.status(201).json({ mensaje: 'Tarea creada', tarea: nuevaTarea });
  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(500).json({ mensaje: 'Error al crear tarea' });
  }
}

// -------------------- ACTUALIZAR COMPLETAMENTE (PUT) --------------------
async function updateTarea(req, res) {
  try {
    const tarea = req.body;
    const id = req.params.id;
    if (tarea.area && tarea.tipo) {
      const tipos = AREAS[tarea.area];
      if (!tipos || !tipos.includes(tarea.tipo)) {
        return res.status(400).json({ mensaje: `Tarea inválida para el área ${tarea.area}` });
      }
    }
    const actualizada = await TareaModel.update(id, tarea);
    if (!actualizada) return res.status(404).json({ mensaje: 'Tarea no encontrada' });
    res.json({ mensaje: 'Tarea actualizada', tarea: actualizada });
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    res.status(500).json({ mensaje: 'Error al actualizar tarea' });
  }
}

// -------------------- ACTUALIZAR PARCIALMENTE (PATCH) --------------------
async function patchTarea(req, res) {
  try {
    const campos = req.body;
    const id = req.params.id;
    if (campos.area && campos.tipo) {
      const tipos = AREAS[campos.area];
      if (!tipos || !tipos.includes(campos.tipo)) {
        return res.status(400).json({ mensaje: `Tarea inválida para el área ${campos.area}` });
      }
    }
    const actualizada = await TareaModel.patch(id, campos);
    if (!actualizada) return res.status(404).json({ mensaje: 'Tarea no encontrada' });
    res.json({ mensaje: 'Tarea actualizada parcialmente', tarea: actualizada });
  } catch (error) {
    console.error('Error al actualizar tarea parcialmente:', error);
    res.status(500).json({ mensaje: 'Error al actualizar tarea parcialmente' });
  }
}

// -------------------- ELIMINAR TAREA --------------------
async function deleteTarea(req, res) {
  try {
    const eliminada = await TareaModel.remove(req.params.id);
    if (!eliminada) return res.status(404).json({ mensaje: 'Tarea no encontrada' });
    res.json({ mensaje: 'Tarea eliminada', tarea: eliminada });
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    res.status(500).json({ mensaje: 'Error al eliminar tarea' });
  }
}

export default { listTareas, getTarea, addTarea, updateTarea, patchTarea, deleteTarea };
