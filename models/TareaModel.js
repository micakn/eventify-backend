const fs = require('fs').promises; // Usamos promesas nativas
const TAREAS_FILE = './db/tareas.json';

class TareaModel {
  constructor() {}

  // -------------------- MÉTODOS AUXILIARES --------------------
  // Leer tareas desde el JSON de forma asíncrona
  async _load() {
    try {
      const data = await fs.readFile(TAREAS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // Si no existe el archivo o hay error, devolvemos arreglo vacío
      return [];
    }
  }

  // Guardar tareas en el JSON de forma asíncrona
  async _save(tareas) {
    try {
      await fs.writeFile(TAREAS_FILE, JSON.stringify(tareas, null, 2));
    } catch (error) {
      throw new Error('Error al guardar tareas');
    }
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
      id: Date.now(),                   // ID único
      titulo: tarea.titulo || 'Sin título',
      descripcion: tarea.descripcion || '',
      estado: tarea.estado || 'pendiente',  // pendiente | en proceso | finalizada
      fechaInicio: tarea.fechaInicio || null,
      fechaFin: tarea.fechaFin || null,
      prioridad: tarea.prioridad || 'media', 
      area: tarea.area || 'Producción y Logística', 
      tipo: tarea.tipo || null,         // Tipo de tarea según área
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

    tareas[index] = {
      ...tareas[index],
      ...tarea, // Sobrescribimos con los nuevos campos
      id: tareas[index].id // Mantenemos el ID original
    };

    await this._save(tareas);
    return tareas[index];
  }

  // Actualizar parcialmente (PATCH) -> llamamos a update
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

module.exports = new TareaModel();
