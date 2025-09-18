const fs = require('fs'); // Importamos fs para manejar archivos
const CLIENTES_FILE = './db/clientes.json'; // Archivo de clientes

class ClienteModel {
  constructor() {
    // Al crear la instancia, leemos todos los clientes del archivo JSON
    this.clientes = JSON.parse(fs.readFileSync(CLIENTES_FILE, 'utf-8'));
  }

  // Guardar cambios en el archivo JSON
  _save() {
    fs.writeFileSync(CLIENTES_FILE, JSON.stringify(this.clientes, null, 2));
  }

  // Devuelve todos los clientes
  getAll() {
    return this.clientes;
  }

  // Devuelve un cliente por ID
  getById(id) {
    return this.clientes.find(c => String(c.id) === String(id));
  }

  // Agrega un nuevo cliente
  add(cliente) {
    const nuevo = {
      id: Date.now(),                  // ID único basado en timestamp
      nombre: cliente.nombre || 'Sin nombre',
      email: cliente.email || '',
      telefono: cliente.telefono || '',
      empresa: cliente.empresa || ''
    };
    this.clientes.push(nuevo); // Agregamos al array
    this._save();              // Guardamos cambios
    return nuevo;              // Devolvemos el cliente creado
  }

  // Reemplaza completamente un cliente (PUT)
  update(id, cliente) {
    const index = this.clientes.findIndex(c => String(c.id) === String(id));
    if (index === -1) return null;

    this.clientes[index] = {
      id: this.clientes[index].id,
      nombre: cliente.nombre || this.clientes[index].nombre,
      email: cliente.email || this.clientes[index].email,
      telefono: cliente.telefono || this.clientes[index].telefono,
      empresa: cliente.empresa || this.clientes[index].empresa
    };

    this._save(); // Guardamos cambios
    return this.clientes[index]; // Devolvemos el cliente actualizado
  }

  // Actualiza parcialmente un cliente (PATCH)
  patch(id, campos) {
    const index = this.clientes.findIndex(c => String(c.id) === String(id));
    if (index === -1) return null;

    this.clientes[index] = { ...this.clientes[index], ...campos };
    this._save();
    return this.clientes[index];
  }

  // Elimina un cliente por ID
  remove(id) {
    const index = this.clientes.findIndex(c => String(c.id) === String(id));
    if (index === -1) return null;

    const eliminado = this.clientes[index]; // Guardamos el cliente eliminado
    this.clientes.splice(index, 1);         // Lo removemos del array
    this._save();                           // Guardamos cambios
    return eliminado;                       // Devolvemos el cliente eliminado
  }
}

// Exportamos una instancia de la clase para usarla directamente
module.exports = new ClienteModel();
