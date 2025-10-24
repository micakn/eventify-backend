// controllers/empleadoController.js

// -------------------- CONTROLADOR DE EMPLEADOS --------------------
import EmpleadoModel from '../models/EmpleadoModel.js';

// Roles y áreas válidos para validación
const ROLES = ['administrador', 'planner', 'coordinador'];
const AREAS = ['Producción y Logística', 'Planificación y Finanzas', 'Atención al Cliente', 'Administración'];

// -------------------- LISTAR TODOS LOS EMPLEADOS --------------------
// GET /empleados
async function listEmpleados(req, res) {
  try {
    const empleados = await EmpleadoModel.getAll();
    res.json(empleados);
  } catch (error) {
    console.error('Error al listar empleados:', error);
    res.status(500).json({ mensaje: 'Error al obtener empleados' });
  }
}

// -------------------- OBTENER EMPLEADO POR ID --------------------
// GET /empleados/:id
async function getEmpleado(req, res) {
  try {
    const empleado = await EmpleadoModel.getById(req.params.id);
    if (!empleado) return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    res.json(empleado);
  } catch (error) {
    console.error('Error al obtener empleado:', error);
    res.status(500).json({ mensaje: 'Error al obtener empleado' });
  }
}

// -------------------- CREAR NUEVO EMPLEADO --------------------
// POST /empleados
async function addEmpleado(req, res) {
  try {
    const empleado = req.body;
    if (!empleado.nombre || !empleado.rol || !empleado.area) {
      return res.status(400).json({ mensaje: 'Nombre, rol y área son obligatorios' });
    }
    if (!ROLES.includes(empleado.rol)) {
      return res.status(400).json({ mensaje: 'Rol inválido' });
    }
    if (!AREAS.includes(empleado.area)) {
      return res.status(400).json({ mensaje: 'Área inválida' });
    }

    const nuevoEmpleado = await EmpleadoModel.add(empleado);
    res.status(201).json({ mensaje: 'Empleado creado', empleado: nuevoEmpleado });
  } catch (error) {
    console.error('Error al crear empleado:', error);
    res.status(500).json({ mensaje: 'Error al crear empleado' });
  }
}

// -------------------- ACTUALIZAR COMPLETAMENTE EMPLEADO --------------------
// PUT /empleados/:id
async function updateEmpleado(req, res) {
  try {
    const empleado = req.body;
    if (empleado.rol && !ROLES.includes(empleado.rol)) {
      return res.status(400).json({ mensaje: 'Rol inválido' });
    }
    if (empleado.area && !AREAS.includes(empleado.area)) {
      return res.status(400).json({ mensaje: 'Área inválida' });
    }

    const actualizado = await EmpleadoModel.update(req.params.id, empleado);
    if (!actualizado) return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    res.json({ mensaje: 'Empleado actualizado', empleado: actualizado });
  } catch (error) {
    console.error('Error al actualizar empleado:', error);
    res.status(500).json({ mensaje: 'Error al actualizar empleado' });
  }
}

// -------------------- ACTUALIZAR PARCIALMENTE EMPLEADO --------------------
// PATCH /empleados/:id
async function patchEmpleado(req, res) {
  try {
    const campos = req.body;
    if (campos.rol && !ROLES.includes(campos.rol)) {
      return res.status(400).json({ mensaje: 'Rol inválido' });
    }
    if (campos.area && !AREAS.includes(campos.area)) {
      return res.status(400).json({ mensaje: 'Área inválida' });
    }

    const actualizado = await EmpleadoModel.patch(req.params.id, campos);
    if (!actualizado) return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    res.json({ mensaje: 'Empleado actualizado parcialmente', empleado: actualizado });
  } catch (error) {
    console.error('Error al actualizar parcialmente empleado:', error);
    res.status(500).json({ mensaje: 'Error al actualizar parcialmente empleado' });
  }
}

// -------------------- ELIMINAR EMPLEADO --------------------
// DELETE /empleados/:id
async function deleteEmpleado(req, res) {
  try {
    const eliminado = await EmpleadoModel.remove(req.params.id);
    if (!eliminado) return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    res.json({ mensaje: 'Empleado eliminado', empleado: eliminado });
  } catch (error) {
    console.error('Error al eliminar empleado:', error);
    res.status(500).json({ mensaje: 'Error al eliminar empleado' });
  }
}

export default { listEmpleados, getEmpleado, addEmpleado, updateEmpleado, patchEmpleado, deleteEmpleado };
