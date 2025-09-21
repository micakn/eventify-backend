import TareaModel from '../models/TareaModel.js';
import EmpleadoModel from '../models/EmpleadoModel.js';
import EventoModel from '../models/EventoModel.js';

// -------------------- ÁREAS Y TIPOS DE TAREAS --------------------
// Definimos las áreas y los tipos de tareas permitidos para cada una
const AREAS = {
  "Producción y Logística": ["Coordinación con proveedores", "Montaje de escenario", "Verificación técnica previa"],
  "Planificación y Finanzas": ["Carga y control del presupuesto", "Firma de contratos", "Seguimiento del cronograma"]
};

// -------------------- LISTAR Y FILTRAR TAREAS --------------------
// GET /tareas
// Devuelve todas las tareas o las filtra según query params
async function listTareas(req, res) {
  try {
    let tareas = await TareaModel.getAll();
    const { estado, prioridad, fechaInicio, fechaFin, empleadoAsignado, eventoAsignado } = req.query;

    // Filtrar por estado
    if (estado) {
      tareas = tareas.filter(t => t.estado === estado);
    }

    // Filtrar por prioridad
    if (prioridad) {
      tareas = tareas.filter(t => t.prioridad === prioridad);
    }

    // Filtrar por rango de fechas
    if (fechaInicio && fechaFin) {
      const inicioFiltro = new Date(fechaInicio);
      const finFiltro = new Date(fechaFin);

      tareas = tareas.filter(t => {
        if (!t.fechaInicio || !t.fechaFin) return false; // descartamos tareas sin fechas
        const tareaInicio = new Date(t.fechaInicio);
        const tareaFin = new Date(t.fechaFin);
        return tareaInicio >= inicioFiltro && tareaFin <= finFiltro;
      });
    }

    // Filtrar por empleado asignado
    if (empleadoAsignado) {
      tareas = tareas.filter(t => String(t.empleadoAsignado) === String(empleadoAsignado));
    }

    // Filtrar por evento asignado
    if (eventoAsignado) {
      tareas = tareas.filter(t => String(t.eventoAsignado) === String(eventoAsignado));
    }

    // Devolver el resultado (si no hay filtros devuelve todas)
    res.json(tareas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener tareas' });
  }
}

// -------------------- OBTENER UNA TAREA POR ID --------------------
// GET /tareas/:id
// Busca y devuelve una tarea según su ID
async function getTarea(req, res) {
  try {
    const tarea = await TareaModel.getById(req.params.id);
    if (!tarea) return res.status(404).json({ mensaje: 'Tarea no encontrada' });
    res.json(tarea);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener tarea' });
  }
}

// -------------------- CREAR NUEVA TAREA --------------------
// POST /tareas
// Crea una tarea nueva validando relaciones y tipo
async function addTarea(req, res) {
  try {
    const tarea = req.body;

    // Verificamos si el empleado asignado existe
    if (tarea.empleadoAsignado) {
      const empleado = await EmpleadoModel.getById(tarea.empleadoAsignado);
      if (!empleado) return res.status(400).json({ mensaje: 'Empleado asignado no existe' });
    }

    // Verificamos si el evento asignado existe
    if (tarea.eventoAsignado) {
      const evento = await EventoModel.getById(tarea.eventoAsignado);
      if (!evento) return res.status(400).json({ mensaje: 'Evento asignado no existe' });
    }

    // Verificamos que el tipo de tarea corresponda al área indicada
    if (tarea.area && tarea.tipo) {
      const tiposPermitidos = AREAS[tarea.area];
      if (!tiposPermitidos || !tiposPermitidos.includes(tarea.tipo)) {
        return res.status(400).json({ mensaje: `Tarea inválida para el área ${tarea.area}` });
      }
    }

    // Creamos la tarea
    const nuevaTarea = await TareaModel.add(tarea);
    res.status(201).json({ mensaje: 'Tarea creada', tarea: nuevaTarea });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear tarea' });
  }
}

// -------------------- REEMPLAZAR UNA TAREA COMPLETA --------------------
// PUT /tareas/:id
// Actualiza todos los campos de una tarea existente
async function updateTarea(req, res) {
  try {
    const tarea = req.body;
    const id = req.params.id;

    // Validamos empleado y evento asignados
    if (tarea.empleadoAsignado) {
      const empleado = await EmpleadoModel.getById(tarea.empleadoAsignado);
      if (!empleado) return res.status(400).json({ mensaje: 'Empleado asignado no existe' });
    }
    if (tarea.eventoAsignado) {
      const evento = await EventoModel.getById(tarea.eventoAsignado);
      if (!evento) return res.status(400).json({ mensaje: 'Evento asignado no existe' });
    }

    // Validamos tipo según área
    if (tarea.area && tarea.tipo) {
      const tiposPermitidos = AREAS[tarea.area];
      if (!tiposPermitidos || !tiposPermitidos.includes(tarea.tipo)) {
        return res.status(400).json({ mensaje: `Tarea inválida para el área ${tarea.area}` });
      }
    }

    // Actualizamos la tarea
    const actualizada = await TareaModel.update(id, tarea);
    if (!actualizada) return res.status(404).json({ mensaje: 'Tarea no encontrada' });

    res.json({ mensaje: 'Tarea actualizada', tarea: actualizada });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar tarea' });
  }
}

// -------------------- ACTUALIZAR PARCIALMENTE --------------------
// PATCH /tareas/:id
// Actualiza solo los campos enviados de una tarea
async function patchTarea(req, res) {
  try {
    const campos = req.body;
    const id = req.params.id;

    // Validaciones parciales
    if (campos.empleadoAsignado) {
      const empleado = await EmpleadoModel.getById(campos.empleadoAsignado);
      if (!empleado) return res.status(400).json({ mensaje: 'Empleado asignado no existe' });
    }
    if (campos.eventoAsignado) {
      const evento = await EventoModel.getById(campos.eventoAsignado);
      if (!evento) return res.status(400).json({ mensaje: 'Evento asignado no existe' });
    }
    if (campos.area && campos.tipo) {
      const tiposPermitidos = AREAS[campos.area];
      if (!tiposPermitidos || !tiposPermitidos.includes(campos.tipo)) {
        return res.status(400).json({ mensaje: `Tarea inválida para el área ${campos.area}` });
      }
    }

    // Actualizamos parcialmente la tarea
    const actualizada = await TareaModel.patch(id, campos);
    if (!actualizada) return res.status(404).json({ mensaje: 'Tarea no encontrada' });

    res.json({ mensaje: 'Tarea actualizada parcialmente', tarea: actualizada });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar tarea parcialmente' });
  }
}

// -------------------- ELIMINAR TAREA --------------------
// DELETE /tareas/:id
// Elimina una tarea según su ID
async function deleteTarea(req, res) {
  try {
    const eliminada = await TareaModel.remove(req.params.id);
    if (!eliminada) return res.status(404).json({ mensaje: 'Tarea no encontrada' });
    res.json({ mensaje: 'Tarea eliminada', tarea: eliminada });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar tarea' });
  }
}

// Exportamos todas las funciones
export default { listTareas, getTarea, addTarea, updateTarea, patchTarea, deleteTarea};






