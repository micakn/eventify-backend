// models/UsuarioModel.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UsuarioSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true, 
      trim: true 
    },
    password: { type: String, required: true, minlength: 6 },
    rol: {
      type: String,
      enum: ['administrador', 'planner', 'coordinador'],
      default: 'coordinador',
    },
    area: {
      type: String,
      enum: ['Producción y Logística', 'Planificación y Finanzas', 'Atención al Cliente', 'Administración'],
      required: true,
    },
    activo: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// Encriptar password antes de guardar
UsuarioSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Método para comparar passwords
UsuarioSchema.methods.compararPassword = async function (passwordIngresado) {
  return await bcrypt.compare(passwordIngresado, this.password);
};

const Usuario = mongoose.models.Usuario || mongoose.model('Usuario', UsuarioSchema);

// Función auxiliar para convertir a objeto plano
function toPlain(doc) {
  if (!doc) return null;
  const obj = doc.toObject({ versionKey: false });
  obj.id = String(obj._id);
  delete obj.password; // NUNCA devolver el password
  return obj;
}

class UsuarioModel {
  async getAll() {
    try {
      const usuarios = await Usuario.find({ activo: true }).sort({ createdAt: -1 });
      return usuarios.map(toPlain);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      return [];
    }
  }

  async getById(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const usuario = await Usuario.findById(id);
      return toPlain(usuario);
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return null;
    }
  }

  async getByEmail(email) {
    try {
      const usuario = await Usuario.findOne({ email: email.toLowerCase() });
      return usuario; // Devolvemos el documento completo para poder usar compararPassword
    } catch (error) {
      console.error('Error al buscar usuario por email:', error);
      return null;
    }
  }

  async add(usuario) {
    try {
      const nuevo = await Usuario.create(usuario);
      return toPlain(nuevo);
    } catch (error) {
      console.error('Error al crear usuario:', error);
      return null;
    }
  }

  async update(id, usuario) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      const actualizado = await Usuario.findByIdAndUpdate(id, usuario, {
        new: true,
        runValidators: true,
      });
      return toPlain(actualizado);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      return null;
    }
  }

  async remove(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    try {
      // Soft delete: solo marcamos como inactivo
      const eliminado = await Usuario.findByIdAndUpdate(
        id,
        { activo: false },
        { new: true }
      );
      return toPlain(eliminado);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      return null;
    }
  }
}

export default new UsuarioModel();