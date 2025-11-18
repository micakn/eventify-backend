//
// -------------------- MODELO DE EVENTO --------------------
import mongoose from 'mongoose';

// -------------------- CONFIGURACIÓN DEL ESQUEMA --------------------
const EventoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    descripcion: { type: String, trim: true },
    fechaInicio: { type: Date, required: true },
    fechaFin: { type: Date, required: true },
    lugar: { type: String, trim: true },
    presupuesto: { type: Number, default: 0 },
    // Nuevos campos Tipo y Estado
    tipo: { 
      type: String, 
      enum: ['conferencia', 'workshop', 'networking', 'social', 'deportivo', 'cultural', 'educativo', 'corporativo'],
      default: 'corporativo'
    },
    estado: { 
      type: String, 
      enum: ['activo', 'pendiente', 'cancelado', 'finalizado'],
      default: 'pendiente'
    },
    // Nuevos campos para relaciones
    clienteId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Cliente',
      required: false 
    },
    empleadoId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Empleado',
      required: false 
    }
  },
  { timestamps: true }
);

// -------------------- MODELO --------------------
const Evento = mongoose.models.Evento || mongoose.model('Evento', EventoSchema);

// -------------------- FUNCIÓN AUXILIAR --------------------
function toPlain(doc) {
  if (!doc) return null;
  const obj = doc.toObject({ versionKey: false });
  obj.id = String(obj._id);
  
  if (obj.clienteId && typeof obj.clienteId === 'object') {
    obj.clienteIdString = String(obj.clienteId._id || obj.clienteId);
  }
  if (obj.empleadoId && typeof obj.empleadoId === 'object') {
    obj.empleadoIdString = String(obj.empleadoId._id || obj.empleadoId);
  }
  
  return obj;
}

// -------------------- CRUD --------------------
class EventoModel {
  async getAll() {
    try {
      let query = Evento.find().sort({ createdAt: -1 });
      const registered = mongoose.modelNames ? mongoose.modelNames() : Object.keys(mongoose.models || {});
      if (registered.includes('Cliente')) {
        query = query.populate('clienteId', 'nombre email telefono empresa');
      }
      if (registered.includes('Empleado')) {
        query = query.populate('empleadoId', 'nombre rol area');
      }
      const eventos = await query;
      return eventos.map(toPlain);
    } catch (error) {
      console.error('Error al obtener los eventos:', error);
      return [];
    }
  }

  async getById(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      let query = Evento.findById(id);
      const registered = mongoose.modelNames ? mongoose.modelNames() : Object.keys(mongoose.models || {});
      if (registered.includes('Cliente')) {
        query = query.populate('clienteId', 'nombre email telefono empresa');
      }
      if (registered.includes('Empleado')) {
        query = query.populate('empleadoId', 'nombre rol area');
      }
      const evento = await query;
      return evento ? toPlain(evento) : null;
    } catch (error) {
      console.error('Error al obtener evento por ID:', error);
      return null;
    }
  }

  async add(evento) {
    try {
      // Normalizar fechas: intentar convertir a Date y proveer valores por defecto
      let fechaInicio = evento.fechaInicio ? new Date(evento.fechaInicio) : null;
      let fechaFin = evento.fechaFin ? new Date(evento.fechaFin) : null;

      if (!fechaInicio) {
        fechaInicio = new Date();
      }
      if (!fechaFin) {
        // Por defecto, 1 día después de inicio
        fechaFin = new Date(fechaInicio.getTime() + 24 * 60 * 60 * 1000);
      }

      const nuevo = await Evento.create({
        nombre: evento.nombre,
        descripcion: evento.descripcion || '',
        fechaInicio,
        fechaFin,
        lugar: evento.lugar || '',
        presupuesto: Number(evento.presupuesto) || 0,
        tipo: evento.tipo || 'corporativo',
        estado: evento.estado || 'pendiente',
        clienteId: evento.clienteId || null,
        empleadoId: evento.empleadoId || null,
      });

      // Repopular para obtener los datos relacionados
      let query = Evento.findById(nuevo._id);
      const registered = mongoose.modelNames ? mongoose.modelNames() : Object.keys(mongoose.models || {});
      if (registered.includes('Cliente')) {
        query = query.populate('clienteId', 'nombre email telefono empresa');
      }
      if (registered.includes('Empleado')) {
        query = query.populate('empleadoId', 'nombre rol area');
      }
      const eventoPopulado = await query;
      return toPlain(eventoPopulado);
    } catch (error) {
      console.error('Error al agregar evento:', error);
      try {
        process.stderr.write(`EVENTO_ADD_ERROR: ${error.stack || error}\n`);
      } catch (e) {
        // ignore
      }
      return null;
    }
  }

  async update(id, evento) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      let query = Evento.findByIdAndUpdate(id, evento, {
        new: true,
        runValidators: true,
      });
      const registered = mongoose.modelNames ? mongoose.modelNames() : Object.keys(mongoose.models || {});
      if (registered.includes('Cliente')) {
        query = query.populate('clienteId', 'nombre email telefono empresa');
      }
      if (registered.includes('Empleado')) {
        query = query.populate('empleadoId', 'nombre rol area');
      }
      const actualizado = await query;
      return actualizado ? toPlain(actualizado) : null;
    } catch (error) {
      console.error('Error al actualizar evento:', error);
      return null;
    }
  }

  async patch(id, campos) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      let query = Evento.findByIdAndUpdate(
        id,
        { $set: campos },
        { new: true, runValidators: true }
      );
      const registered = mongoose.modelNames ? mongoose.modelNames() : Object.keys(mongoose.models || {});
      if (registered.includes('Cliente')) {
        query = query.populate('clienteId', 'nombre email telefono empresa');
      }
      if (registered.includes('Empleado')) {
        query = query.populate('empleadoId', 'nombre rol area');
      }
      const actualizado = await query;
      return actualizado ? toPlain(actualizado) : null;
    } catch (error) {
      console.error('Error al actualizar parcialmente evento:', error);
      return null;
    }
  }

  async remove(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const eliminado = await Evento.findByIdAndDelete(id);
      return eliminado ? toPlain(eliminado) : null;
    } catch (error) {
      console.error('Error al eliminar evento:', error);
      return null;
    }
  }
}

export default new EventoModel();



