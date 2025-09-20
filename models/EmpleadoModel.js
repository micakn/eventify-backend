import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Ruta del archivo JSON
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const EMPLEADOS_FILE = path.join(__dirname, '../db/empleados.json');

class EmpleadoModel {
  constructor() {}

  // -------------------- MÉTODOS AUXILIARES --------------------
  // Leer empleados desde JSON de forma asíncrona
  async _load() {
    try {
      const data = await fs.readFile(EMPLEADOS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  // Guardar empleados en JSON de forma asíncrona
  async _save(empleados) {
    await fs.writeFile(EMPLEADOS_FILE, JSON.stringify(empleados, null, 2));
  }

  // -------------------- CRUD --------------------
  // Obtener todos los empleados
  async getAll() {
    return await this._load();
  }

  // Obtener un empleado por ID
  async getById(id) {
    const empleados = await this._load();
    return empleados.find(e => String(e.id) === String(id));
  }

  // Agregar un nuevo empleado
  async add(empleado) {
    const empleados = await this._load();
    const nuevo = {
      id: Date.now(),
      nombre: empleado.nombre || 'Sin nombre',
      rol: empleado.rol || 'planner',
      area: empleado.area || 'Producción y Logística',
      email: empleado.email || '',
      telefono: empleado.telefono || ''
    };
    empleados.push(nuevo);
    await this._save(empleados);
    return nuevo;
  }

  // Reemplazar completamente un empleado (PUT)
  async update(id, empleado) {
    const empleados = await this._load();
    const index = empleados.findIndex(e => String(e.id) === String(id));
    if (index === -1) return null;

    empleados[index] = { ...empleados[index], ...empleado, id: empleados[index].id };
    await this._save(empleados);
    return empleados[index];
  }

  // Actualizar parcialmente un empleado (PATCH)
  async patch(id, campos) {
    return this.update(id, campos);
  }

  // Eliminar un empleado
  async remove(id) {
    const empleados = await this._load();
    const index = empleados.findIndex(e => String(e.id) === String(id));
    if (index === -1) return null;

    const eliminado = empleados.splice(index, 1)[0];
    await this._save(empleados);
    return eliminado;
  }
}

export default new EmpleadoModel();




