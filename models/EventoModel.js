import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Ruta del archivo JSON
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const EVENTOS_FILE = path.join(__dirname, '../db/eventos.json');

class EventoModel {
  constructor() {}

  // -------------------- MÉTODOS AUXILIARES --------------------
  // Leer eventos desde JSON de forma asíncrona
  async _load() {
    try {
      const data = await fs.readFile(EVENTOS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  // Guardar eventos en JSON de forma asíncrona
  async _save(eventos) {
    await fs.writeFile(EVENTOS_FILE, JSON.stringify(eventos, null, 2));
  }

  // -------------------- CRUD --------------------
  // Obtener todos los eventos
  async getAll() {
    return await this._load();
  }

  // Obtener un evento por ID
  async getById(id) {
    const eventos = await this._load();
    return eventos.find(ev => String(ev.id) === String(id));
  }

  // Agregar un nuevo evento
  async add(evento) {
    const eventos = await this._load();
    const nuevo = {
      id: Date.now(),
      nombre: evento.nombre || 'Sin nombre',
      descripcion: evento.descripcion || '',
      fechaInicio: evento.fechaInicio || null,
      fechaFin: evento.fechaFin || null,
      lugar: evento.lugar || ''
    };
    eventos.push(nuevo);
    await this._save(eventos);
    return nuevo;
  }

  // Reemplazar completamente un evento (PUT)
  async update(id, evento) {
    const eventos = await this._load();
    const index = eventos.findIndex(ev => String(ev.id) === String(id));
    if (index === -1) return null;

    eventos[index] = { ...eventos[index], ...evento, id: eventos[index].id };
    await this._save(eventos);
    return eventos[index];
  }

  // Actualizar parcialmente un evento (PATCH)
  async patch(id, campos) {
    return this.update(id, campos);
  }

  // Eliminar un evento
  async remove(id) {
    const eventos = await this._load();
    const index = eventos.findIndex(ev => String(ev.id) === String(id));
    if (index === -1) return null;

    const eliminado = eventos.splice(index, 1)[0];
    await this._save(eventos);
    return eliminado;
  }
}

export default new EventoModel();



