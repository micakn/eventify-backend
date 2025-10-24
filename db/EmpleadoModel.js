import mongoose from 'mongoose';

const EmpleadoSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  rol:   { type: mongoose.Schema.Types.ObjectId, ref: 'Rol', required: true },
  area:  { type: mongoose.Schema.Types.ObjectId, ref: 'Area', required: true },
  email: { type: String, trim: true },
  telefono: { type: String, trim: true },
}, { timestamps: true });

const Empleado = mongoose.models.Empleado || mongoose.model('Empleado', EmpleadoSchema);
export default Empleado;
