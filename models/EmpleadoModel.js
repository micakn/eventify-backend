const fs = require('fs'); // Importamos el módulo fs para leer y escribir archivos
const EMPLEADOS_FILE = './db/empleados.json'; // Archivo de empleados

class EmpleadoModel {
  constructor() {
    // Al crear la instancia, leemos todos los empleados del archivo JSON
    this.empleados = JSON.parse(fs.readFileSync(EMPLEADOS_FILE, 'utf-8'));
  }

  // Método interno para guardar cambios en el archivo JSON
  _save() {
    fs.writeFileSync(EMPLEADOS_FILE, JSON.stringify(this.empleados, null, 2));
    // null, 2 -> para que el JSON quede formateado bonito (indentación 2 espacios)
  }

  // Devuelve todos los empleados
  getAll() {
    return this.empleados;
  }

  // Devuelve un empleado por ID
  getById(id) {
    return this.empleados.find(e => String(e.id) === String(id));
  }

  // Agrega un nuevo empleado
  add(empleado) {
    const nuevo = {
      id: Date.now(),                  // ID único basado en timestamp
      nombre: empleado.nombre || 'Sin nombre',
      puesto: empleado.puesto || '',
      email: empleado.email || '',
      telefono: empleado.telefono || ''
    };
    this.empleados.push(nuevo); // Agregamos al array
    this._save();               // Guardamos cambios
    return nuevo;               // Devolvemos el empleado creado
  }

  // Reemplaza completamente un empleado (PUT)
  update(id, empleado) {
    const index = this.empleados.findIndex(e => String(e.id) === String(id));
    if (index === -1) return null;

    this.empleados[index] = {
      id: this.empleados[index].id,                     // conservamos el ID
      nombre: empleado.nombre || this.empleados[index].nombre,
      puesto: empleado.puesto || this.empleados[index].puesto,
      email: empleado.email || this.empleados[index].email,
      telefono: empleado.telefono || this.empleados[index].telefono
    };

    this._save(); // Guardamos cambios
    return this.empleados[index]; // Devolvemos el empleado actualizado
  }

  // Actualiza parcialmente un empleado (PATCH)
  patch(id, campos) {
    const index = this.empleados.findIndex(e => String(e.id) === String(id));
    if (index === -1) return null;

    this.empleados[index] = { ...this.empleados[index], ...campos };
    this._save();
    return this.empleados[index];
  }

  // Elimina un empleado por ID
  remove(id) {
    const index = this.empleados.findIndex(e => String(e.id) === String(id));
    if (index === -1) return null;

    const eliminado = this.empleados[index]; // Guardamos el empleado eliminado
    this.empleados.splice(index, 1);         // Lo removemos del array
    this._save();                            // Guardamos cambios
    return eliminado;                        // Devolvemos el empleado eliminado
  }
}

// Exportamos una instancia de la clase para usarla directamente
module.exports = new EmpleadoModel();

