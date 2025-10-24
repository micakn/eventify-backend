import mongoose from 'mongoose';

const ClienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  email: { type: String, trim: true },
  telefono: { type: String, trim: true },
  empresa: { type: String, trim: true },
  tipo: { type: String, enum: ['empresa', 'individual'], default: 'individual' },
  notas: { type: String, trim: true },
}, { timestamps: true });

const Cliente = mongoose.models.Cliente || mongoose.model('Cliente', ClienteSchema);
export default Cliente;
