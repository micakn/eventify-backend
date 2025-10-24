import mongoose from 'mongoose';

const EventoSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  descripcion: { type: String, trim: true },
  fechaInicio: { type: Date },
  fechaFin: { type: Date },
  lugar: { type: String, trim: true },
  presupuesto: { type: Number, default: 0 }, // pedido en consigna
}, { timestamps: true });

const Evento = mongoose.models.Evento || mongoose.model('Evento', EventoSchema);
export default Evento;
