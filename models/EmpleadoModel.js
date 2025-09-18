const fs = require('fs');
const EMPLEADOS_FILE = './db/empleados.json';

class EmpleadoModel {
  constructor() {
    this.empleados = JSON.parse(fs.readFileSync(EMPLEADOS_FILE, 'utf-8'));
  }

  _save() {
    fs.writeFileSync(EMPLEADOS_FILE, JSON.stringify(this.empleados, null, 2));
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
      id: Date.now(),
      nombre: empleado.nombre || 'Sin nombre',
      rol: empleado.rol || 'planner',         // Valor por defecto planner
      area: empleado.area || 'Producción y Logística', // Valor por defecto
      email: empleado.email || '',
      telefono: empleado.telefono || ''
    };
    this.empleados.push(nuevo);
    this._save();
    return nuevo;
  }

  // Reemplaza completamente un empleado (PUT)
  update(id, empleado) {
    const index = this.empleados.findIndex(e => String(e.id) === String(id));
    if (index === -1) return null;

    this.empleados[index] = {
      id: this.empleados[index].id,
      nombre: empleado.nombre || this.empleados[index].nombre,
      rol: empleado.rol || this.empleados[index].rol,
      area: empleado.area || this.empleados[index].area,
      email: empleado.email || this.empleados[index].email,
      telefono: empleado.telefono || this.empleados[index].telefono
    };
    this._save();
    return this.empleados[index];
  }

  // Actualiza parcialmente un empleado (PATCH)
  patch(id, campos) {
    const index = this.empleados.findIndex(e => String(e.id) === String(id));
    if (index === -1) return null;

    this.empleados[index] = { ...this.empleados[index], ...campos };
    this._save();
    return this.empleados[index];
  }

  // Elimina un empleado
  remove(id) {
    const index = this.empleados.findIndex(e => String(e.id) === String(id));
    if (index === -1) return null;

    const eliminado = this.empleados[index];
    this.empleados.splice(index, 1);
    this._save();
    return eliminado;
  }
}

module.exports = new EmpleadoModel();


