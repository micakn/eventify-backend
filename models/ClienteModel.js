// models/ClienteModel.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Ruta del archivo JSON
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLIENTES_FILE = path.join(__dirname, '../db/clientes.json');

class ClienteModel {
  constructor() {}

  // -------------------- MÉTODOS AUXILIARES --------------------
  // Leer clientes desde JSON de forma asíncrona
  async _load() {
    try {
      const data = await fs.readFile(CLIENTES_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  // Guardar clientes en JSON de forma asíncrona
  async _save(clientes) {
    await fs.writeFile(CLIENTES_FILE, JSON.stringify(clientes, null, 2));
  }

  // -------------------- CRUD --------------------
  // Obtener todos los clientes
  async getAll() {
    return await this._load();
  }

  // Obtener un cliente por ID
  async getById(id) {
    const clientes = await this._load();
    return clientes.find(c => String(c.id) === String(id));
  }

  // Agregar un nuevo cliente
  async add(cliente) {
    const clientes = await this._load();
    const nuevo = {
      id: Date.now(),
      nombre: cliente.nombre || 'Sin nombre',
      email: cliente.email || '',
      telefono: cliente.telefono || '',
      empresa: cliente.empresa || ''
    };
    clientes.push(nuevo);
    await this._save(clientes);
    return nuevo;
  }

  // Reemplazar completamente un cliente (PUT)
  async update(id, cliente) {
    const clientes = await this._load();
    const index = clientes.findIndex(c => String(c.id) === String(id));
    if (index === -1) return null;

    clientes[index] = { ...clientes[index], ...cliente, id: clientes[index].id };
    await this._save(clientes);
    return clientes[index];
  }

  // Actualizar parcialmente un cliente (PATCH)
  async patch(id, campos) {
    return this.update(id, campos);
  }

  // Eliminar un cliente
  async remove(id) {
    const clientes = await this._load();
    const index = clientes.findIndex(c => String(c.id) === String(id));
    if (index === -1) return null;

    const eliminado = clientes.splice(index, 1)[0];
    await this._save(clientes);
    return eliminado;
  }
}

export default new ClienteModel();


