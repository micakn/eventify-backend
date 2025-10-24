// Tarea valida tipos contra el catálogo de Area
import mongoose from 'mongoose';
import Area from './AreaModel.js';

const TareaSchema = new mongoose.Schema({
  titulo: { type: String, required: true, trim: true },
  descripcion: { type: String, trim: true },
  estado: { type: String, enum: ['pendiente', 'en proceso', 'finalizada'], default: 'pendiente' },
  fechaInicio: { type: Date },
  fechaFin: { type: Date },
  prioridad: { type: String, enum: ['alta', 'media', 'baja'], default: 'media' },

  // Relación de clasificación
  area: { type: mongoose.Schema.Types.ObjectId, ref: 'Area', required: true },
  tipo: { type: String, required: true, trim: true }, // debe existir en area.tipos

  // Asignaciones
  empleadoAsignado: { type: mongoose.Schema.Types.ObjectId, ref: 'Empleado' },
  eventoAsignado:   { type: mongoose.Schema.Types.ObjectId, ref: 'Evento' },
  clienteAsignado:  { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente' }, // consigna: evento o cliente

  // Horas
  horasEstimadas: { type: Number, default: 0 },
  horasReales: { type: Number, default: 0 },
}, { timestamps: true });

// Validación: tipo ∈ tipos del área
TareaSchema.pre('validate', async function (next) {
  try {
    if (!this.area || !this.tipo) return next();
    const areaDoc = await Area.findById(this.area).lean();
    if (!areaDoc) return next(new Error('Área inexistente'));
    if (!areaDoc.tipos?.includes(this.tipo)) {
      return next(new Error(`Tipo "${this.tipo}" no válido para el área "${areaDoc.nombre}"`));
    }
    next();
  } catch (e) { next(e); }
});

const Tarea = mongoose.models.Tarea || mongoose.model('Tarea', TareaSchema);
export default Tarea;
