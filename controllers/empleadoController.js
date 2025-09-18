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

// -------------------- CREAR UN NUEVO EMPLEADO/ ALTA EMPLEADO --------------------
// POST /empleados
const addEmpleado = (req, res) => {
  const empleado = req.body;

  // Validar rol y área permitidos
  const roles = ['administrador', 'planner', 'coordinador'];
  const areas = ['Producción y Logística', 'Planificación y Finanzas', 'Atención al Cliente', 'Administración'];

  if (!roles.includes(empleado.rol)) {
    return res.status(400).json({ mensaje: 'Rol inválido' });
  }
  if (!areas.includes(empleado.area)) {
    return res.status(400).json({ mensaje: 'Área inválida' });
  }

  const nuevo = EmpleadoModel.add(empleado);
  res.status(201).json({ mensaje: 'Empleado creado', empleado: nuevo });
};

// -------------------- REEMPLAZAR COMPLETAMENTE UN EMPLEADO --------------------
// PUT /empleados/:id
const updateEmpleado = (req, res) => {
  const { id } = req.params;
  const empleado = req.body;

  // Validar rol y área
  const roles = ['administrador', 'planner', 'coordinador'];
  const areas = ['Producción y Logística', 'Planificación y Finanzas', 'Atención al Cliente', 'Administración'];

  if (empleado.rol && !roles.includes(empleado.rol)) {
    return res.status(400).json({ mensaje: 'Rol inválido' });
  }
  if (empleado.area && !areas.includes(empleado.area)) {
    return res.status(400).json({ mensaje: 'Área inválida' });
  }

  const actualizado = EmpleadoModel.update(id, empleado);
  if (!actualizado) return res.status(404).json({ mensaje: 'Empleado no encontrado' });

  res.json({ mensaje: 'Empleado actualizado', empleado: actualizado });
};

// -------------------- ACTUALIZAR PARCIALMENTE UN EMPLEADO --------------------
// PATCH /empleados/:id
const patchEmpleado = (req, res) => {
  const { id } = req.params;
  const campos = req.body;

  // Validar rol y área si se envían
  const roles = ['administrador', 'planner', 'coordinador'];
  const areas = ['Producción y Logística', 'Planificación y Finanzas', 'Atención al Cliente', 'Administración'];

  if (campos.rol && !roles.includes(campos.rol)) {
    return res.status(400).json({ mensaje: 'Rol inválido' });
  }
  if (campos.area && !areas.includes(campos.area)) {
    return res.status(400).json({ mensaje: 'Área inválida' });
  }

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

module.exports = { addEmpleado, listEmpleados, getEmpleado, deleteEmpleado };

