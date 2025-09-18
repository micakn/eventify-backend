const fs = require('fs'); // Importamos fs para manejar archivos
const EVENTOS_FILE = './db/eventos.json'; // Archivo de eventos

class EventoModel {
  constructor() {
    // Al crear la instancia, leemos todos los eventos del archivo JSON
    this.eventos = JSON.parse(fs.readFileSync(EVENTOS_FILE, 'utf-8'));
  }

  // Guardar cambios en el archivo JSON
  _save() {
    fs.writeFileSync(EVENTOS_FILE, JSON.stringify(this.eventos, null, 2));
  }

  // Devuelve todos los eventos
  getAll() {
    return this.eventos;
  }

  // Devuelve un evento por ID
  getById(id) {
    return this.eventos.find(ev => String(ev.id) === String(id));
  }

  // Agrega un nuevo evento
  add(evento) {
    const nuevo = {
      id: Date.now(),                  // ID único basado en timestamp
      nombre: evento.nombre || 'Sin nombre',
      descripcion: evento.descripcion || '',
      fechaInicio: evento.fechaInicio || null,
      fechaFin: evento.fechaFin || null,
      lugar: evento.lugar || ''
    };
    this.eventos.push(nuevo); // Agregamos al array
    this._save();             // Guardamos cambios
    return nuevo;             // Devolvemos el evento creado
  }

  // Reemplaza completamente un evento (PUT)
  update(id, evento) {
    const index = this.eventos.findIndex(ev => String(ev.id) === String(id));
    if (index === -1) return null;

    this.eventos[index] = {
      id: this.eventos[index].id,
      nombre: evento.nombre || this.eventos[index].nombre,
      descripcion: evento.descripcion || this.eventos[index].descripcion,
      fechaInicio: evento.fechaInicio || this.eventos[index].fechaInicio,
      fechaFin: evento.fechaFin || this.eventos[index].fechaFin,
      lugar: evento.lugar || this.eventos[index].lugar
    };

    this._save(); // Guardamos cambios
    return this.eventos[index]; // Devolvemos el evento actualizado
  }

  // Actualiza parcialmente un evento (PATCH)
  patch(id, campos) {
    const index = this.eventos.findIndex(ev => String(ev.id) === String(id));
    if (index === -1) return null;

    this.eventos[index] = { ...this.eventos[index], ...campos };
    this._save();
    return this.eventos[index];
  }

  // Elimina un evento por ID
  remove(id) {
    const index = this.eventos.findIndex(ev => String(ev.id) === String(id));
    if (index === -1) return null;

    const eliminado = this.eventos[index]; // Guardamos el evento eliminado
    this.eventos.splice(index, 1);         // Lo removemos del array
    this._save();                           // Guardamos cambios
    return eliminado;                       // Devolvemos el evento eliminado
  }
}

// Exportamos una instancia de la clase para usarla directamente
module.exports = new EventoModel();

