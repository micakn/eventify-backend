const fs = require('fs'); // Importamos el módulo fs para leer y escribir archivos
const EMPLEADOS_FILE = './db/empleados.json'; // Archivo de empleados
const EVENTOS_FILE = './db/eventos.json';     // Archivo de eventos (para referencias)
const TAREAS_FILE = './db/tareas.json';       // Archivo de tareas

class TareaModel {
  constructor() {
    // Al crear la instancia, leemos todas las tareas del archivo JSON
    this.tareas = JSON.parse(fs.readFileSync(TAREAS_FILE, 'utf-8'));
  }

  // Método interno para guardar cambios en el archivo JSON
  _save() {
    fs.writeFileSync(TAREAS_FILE, JSON.stringify(this.tareas, null, 2));
    // null, 2 -> para que el JSON quede formateado bonito (indentación 2 espacios)
  }

  // Devuelve todas las tareas
  getAll() {
    return this.tareas;
  }

  // Devuelve una tarea por ID
  getById(id) {
    return this.tareas.find(t => String(t.id) === String(id));
    // String(...) para asegurar que el ID coincida aunque venga como número o string
  }

  // Agrega una nueva tarea
  add(tarea) {
    const nueva = {
      id: Date.now(),                  // ID único basado en timestamp
      titulo: tarea.titulo || 'Sin título',         // Valor por defecto si no se envía
      descripcion: tarea.descripcion || '',        // Valor por defecto vacío
      estado: tarea.estado || 'pendiente',         // pendiente | en proceso | finalizada
      fechaInicio: tarea.fechaInicio || null,     // null si no se envía
      fechaFin: tarea.fechaFin || null,           // null si no se envía
      prioridad: tarea.prioridad || 'media',      // alta | media | baja
      empleadoAsignado: tarea.empleadoAsignado || null, // ID del empleado
      eventoAsignado: tarea.eventoAsignado || null,     // ID del evento
      horasEstimadas: Number(tarea.horasEstimadas) || 0, // Número, default 0
      horasReales: Number(tarea.horasReales) || 0       // Número, default 0
    };
    this.tareas.push(nueva); // Agregamos la nueva tarea al array
    this._save();            // Guardamos cambios en el archivo
    return nueva;            // Devolvemos la tarea creada
  }

  // Reemplaza completamente una tarea (PUT)
  update(id, tarea) {
    const index = this.tareas.findIndex(t => String(t.id) === String(id));
    if (index === -1) return null; // Si no se encuentra, devolvemos null

    // Reemplazamos todos los campos, manteniendo ID original
    this.tareas[index] = {
      id: this.tareas[index].id,
      titulo: tarea.titulo || this.tareas[index].titulo,
      descripcion: tarea.descripcion || this.tareas[index].descripcion,
      estado: tarea.estado || this.tareas[index].estado,
      fechaInicio: tarea.fechaInicio || this.tareas[index].fechaInicio,
      fechaFin: tarea.fechaFin || this.tareas[index].fechaFin,
      prioridad: tarea.prioridad || this.tareas[index].prioridad,
      empleadoAsignado: tarea.empleadoAsignado || this.tareas[index].empleadoAsignado,
      eventoAsignado: tarea.eventoAsignado || this.tareas[index].eventoAsignado,
      horasEstimadas: Number(tarea.horasEstimadas) || this.tareas[index].horasEstimadas,
      horasReales: Number(tarea.horasReales) || this.tareas[index].horasReales
    };

    this._save(); // Guardamos cambios
    return this.tareas[index]; // Devolvemos la tarea actualizada
  }

  // Actualiza parcialmente una tarea (PATCH)
  patch(id, campos) {
    const index = this.tareas.findIndex(t => String(t.id) === String(id));
    if (index === -1) return null;

    // Mezclamos los campos enviados con la tarea actual
    this.tareas[index] = { ...this.tareas[index], ...campos };
    this._save();
    return this.tareas[index];
  }

  // Elimina una tarea por ID
  remove(id) {
    const index = this.tareas.findIndex(t => String(t.id) === String(id));
    if (index === -1) return null;

    const eliminado = this.tareas[index]; // Guardamos la tarea eliminada
    this.tareas.splice(index, 1);         // La removemos del array
    this._save();                         // Guardamos cambios en el archivo
    return eliminado;                     // Devolvemos la tarea eliminada
  }
}

// Exportamos una instancia de la clase para usarla directamente
module.exports = new TareaModel();
