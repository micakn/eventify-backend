const fs = require('fs'); // Para leer/escribir archivos
const TAREAS_FILE = './db/tareas.json'; // Archivo de tareas

class TareaModel {
  constructor() {
    // Leemos tareas del JSON al crear la instancia
    this.tareas = JSON.parse(fs.readFileSync(TAREAS_FILE, 'utf-8'));
  }

  // Guardar cambios en JSON
  _save() {
    fs.writeFileSync(TAREAS_FILE, JSON.stringify(this.tareas, null, 2));
  }

  // -------------------- CRUD --------------------

  // Devuelve todas las tareas
  getAll() {
    return this.tareas;
  }

  // Devuelve una tarea por ID
  getById(id) {
    return this.tareas.find(t => String(t.id) === String(id));
  }

  // Agrega una nueva tarea
  add(tarea) {
    const nueva = {
      id: Date.now(),                   // ID único
      titulo: tarea.titulo || 'Sin título',
      descripcion: tarea.descripcion || '',
      estado: tarea.estado || 'pendiente',          // pendiente | en proceso | finalizada
      fechaInicio: tarea.fechaInicio || null,
      fechaFin: tarea.fechaFin || null,
      prioridad: tarea.prioridad || 'media',       // alta | media | baja
      area: tarea.area || 'Producción y Logística', // Producción y Logística | Planificación y Finanzas
      empleadoAsignado: tarea.empleadoAsignado || null,
      eventoAsignado: tarea.eventoAsignado || null,
      horasEstimadas: Number(tarea.horasEstimadas) || 0,
      horasReales: Number(tarea.horasReales) || 0
    };

    this.tareas.push(nueva);
    this._save();
    return nueva;
  }

  // Reemplaza completamente una tarea (PUT)
  update(id, tarea) {
    const index = this.tareas.findIndex(t => String(t.id) === String(id));
    if (index === -1) return null;

    this.tareas[index] = {
      id: this.tareas[index].id,
      titulo: tarea.titulo || this.tareas[index].titulo,
      descripcion: tarea.descripcion || this.tareas[index].descripcion,
      estado: tarea.estado || this.tareas[index].estado,
      fechaInicio: tarea.fechaInicio || this.tareas[index].fechaInicio,
      fechaFin: tarea.fechaFin || this.tareas[index].fechaFin,
      prioridad: tarea.prioridad || this.tareas[index].prioridad,
      area: tarea.area || this.tareas[index].area,
      empleadoAsignado: tarea.empleadoAsignado || this.tareas[index].empleadoAsignado,
      eventoAsignado: tarea.eventoAsignado || this.tareas[index].eventoAsignado,
      horasEstimadas: Number(tarea.horasEstimadas) || this.tareas[index].horasEstimadas,
      horasReales: Number(tarea.horasReales) || this.tareas[index].horasReales
    };

    this._save();
    return this.tareas[index];
  }

  // Actualiza parcialmente una tarea (PATCH)
  patch(id, campos) {
    const index = this.tareas.findIndex(t => String(t.id) === String(id));
    if (index === -1) return null;

    this.tareas[index] = { ...this.tareas[index], ...campos };
    this._save();
    return this.tareas[index];
  }

  // Elimina una tarea por ID
  remove(id) {
    const index = this.tareas.findIndex(t => String(t.id) === String(id));
    if (index === -1) return null;

    const eliminado = this.tareas[index];
    this.tareas.splice(index, 1);
    this._save();
    return eliminado;
  }
}

module.exports = new TareaModel();
