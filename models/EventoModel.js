// -------------------- MODELO DE EVENTO --------------------
import mongoose from 'mongoose';

// -------------------- CONFIGURACIÓN DEL ESQUEMA --------------------
const EventoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    descripcion: { type: String, trim: true },
    fechaInicio: { type: Date },
    fechaFin: { type: Date },
    lugar: { type: String, trim: true },
    presupuesto: { type: Number, default: 0 },
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
  return obj;
}

// -------------------- CRUD --------------------
class EventoModel {
  async getAll() {
    try {
      const eventos = await Evento.find().sort({ createdAt: -1 });
      return eventos.map(toPlain);
    } catch (error) {
      console.error('Error al obtener los eventos:', error);
      return [];
    }
  }

  async getById(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const evento = await Evento.findById(id);
      return toPlain(evento);
    } catch (error) {
      console.error('Error al obtener evento por ID:', error);
      return null;
    }
  }

  async add(evento) {
    try {
      const nuevo = await Evento.create({
        nombre: evento.nombre,
        descripcion: evento.descripcion || '',
        fechaInicio: evento.fechaInicio || null,
        fechaFin: evento.fechaFin || null,
        lugar: evento.lugar || '',
        presupuesto: Number(evento.presupuesto) || 0,
      });
      return toPlain(nuevo);
    } catch (error) {
      console.error('Error al agregar evento:', error);
      return null;
    }
  }

  async update(id, evento) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const actualizado = await Evento.findByIdAndUpdate(id, evento, {
        new: true,
        runValidators: true,
      });
      return actualizado ? toPlain(actualizado) : null;
    } catch (error) {
      console.error('Error al actualizar evento:', error);
      return null;
    }
  }

  async patch(id, campos) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const actualizado = await Evento.findByIdAndUpdate(
        id,
        { $set: campos },
        { new: true, runValidators: true }
      );
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



