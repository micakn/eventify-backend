// Importamos el modelo de Empleados
const EmpleadoModel = require('../models/empleadoModel');

// -------------------- LISTAR TODOS LOS EMPLEADOS --------------------
// GET /empleados
const listEmpleados = (req, res) => {
  const empleados = EmpleadoModel.getAll();
  res.json(empleados);
};

// -------------------- OBTENER UN EMPLEADO POR ID --------------------
// GET /empleados/:id
const getEmpleado = (req, res) => {
  const { id } = req.params;
  const empleado = EmpleadoModel.getById(id);

  if (!empleado) return res.status(404).json({ mensaje: 'Empleado no encontrado' });

  res.json(empleado);
};

// -------------------- CREAR NUEVO EMPLEADO --------------------
// POST /empleados
const addEmpleado = (req, res) => {
  const empleado = req.body;
  const nuevoEmpleado = EmpleadoModel.add(empleado);
  res.status(201).json({ mensaje: 'Empleado creado', empleado: nuevoEmpleado });
};

// -------------------- REEMPLAZAR COMPLETAMENTE UN EMPLEADO --------------------
// PUT /empleados/:id
const updateEmpleado = (req, res) => {
  const { id } = req.params;
  const empleado = req.body;

  const actualizado = EmpleadoModel.update(id, empleado);
  if (!actualizado) return res.status(404).json({ mensaje: 'Empleado no encontrado' });

  res.json({ mensaje: 'Empleado actualizado', empleado: actualizado });
};

// -------------------- ACTUALIZAR PARCIALMENTE UN EMPLEADO --------------------
// PATCH /empleados/:id
const patchEmpleado = (req, res) => {
  const { id } = req.params;
  const campos = req.body;

  const actualizado = EmpleadoModel.patch(id, campos);
  if (!actualizado) return res.status(404).json({ mensaje: 'Empleado no encontrado' });

  res.json({ mensaje: 'Empleado actualizado parcialmente', empleado: actualizado });
};

// -------------------- ELIMINAR UN EMPLEADO --------------------
// DELETE /empleados/:id
const deleteEmpleado = (req, res) => {
  const { id } = req.params;
  const eliminado = EmpleadoModel.remove(id);

  if (!eliminado) return res.status(404).json({ mensaje: 'Empleado no encontrado' });

  res.json({ mensaje: 'Empleado eliminado', empleado: eliminado });
};

// Exportamos las funciones
module.exports = { listEmpleados, getEmpleado, addEmpleado, updateEmpleado, patchEmpleado, deleteEmpleado};
