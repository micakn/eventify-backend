import fs from 'fs/promises'; 
import path from 'path';
import { fileURLToPath } from 'url';

// Ruta del archivo JSON
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TAREAS_FILE = path.join(__dirname, '../db/tareas.json');

class TareaModel {
  constructor() {}

  // -------------------- MÉTODOS AUXILIARES --------------------
  // Leer tareas desde el JSON de forma asíncrona
  async _load() {
    try {
      const data = await fs.readFile(TAREAS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  // Guardar tareas en el JSON de forma asíncrona
  async _save(tareas) {
    await fs.writeFile(TAREAS_FILE, JSON.stringify(tareas, null, 2));
  }

  // -------------------- CRUD --------------------
  // Obtener todas las tareas
  async getAll() {
    return await this._load();
  }

  // Obtener una tarea por ID
  async getById(id) {
    const tareas = await this._load();
    return tareas.find(t => String(t.id) === String(id));
  }

  // Agregar una nueva tarea
  async add(tarea) {
    const tareas = await this._load();
    const nueva = {
      id: Date.now(),
      titulo: tarea.titulo || 'Sin título',
      descripcion: tarea.descripcion || '',
      estado: tarea.estado || 'pendiente',  // pendiente | en proceso | finalizada
      fechaInicio: tarea.fechaInicio || null,
      fechaFin: tarea.fechaFin || null,
      prioridad: tarea.prioridad || 'media', 
      area: tarea.area || 'Producción y Logística', 
      tipo: tarea.tipo || null,
      empleadoAsignado: tarea.empleadoAsignado || null,
      eventoAsignado: tarea.eventoAsignado || null,
      horasEstimadas: Number(tarea.horasEstimadas) || 0,
      horasReales: Number(tarea.horasReales) || 0
    };
    tareas.push(nueva);
    await this._save(tareas);
    return nueva;
  }

  // Reemplazar completamente una tarea (PUT)
  async update(id, tarea) {
    const tareas = await this._load();
    const index = tareas.findIndex(t => String(t.id) === String(id));
    if (index === -1) return null;

    tareas[index] = { ...tareas[index], ...tarea, id: tareas[index].id };
    await this._save(tareas);
    return tareas[index];
  }

  // Actualizar parcialmente (PATCH)
  async patch(id, campos) {
    return this.update(id, campos);
  }

  // Eliminar una tarea
  async remove(id) {
    const tareas = await this._load();
    const index = tareas.findIndex(t => String(t.id) === String(id));
    if (index === -1) return null;

    const eliminado = tareas.splice(index, 1)[0];
    await this._save(tareas);
    return eliminado;
  }
}

export default new TareaModel();
