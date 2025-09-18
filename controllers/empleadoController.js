const EmpleadoModel = require('../models/empleadoModel');

// -------------------- LISTAR TODOS LOS EMPLEADOS --------------------
// GET /empleados
const listEmpleados = async (req, res) => {
  try {
    const empleados = await EmpleadoModel.getAll();
    res.json(empleados);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener empleados' });
  }
};

// -------------------- OBTENER UN EMPLEADO POR ID --------------------
// GET /empleados/:id
const getEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    const empleado = await EmpleadoModel.getById(id);

    if (!empleado) return res.status(404).json({ mensaje: 'Empleado no encontrado' });

    res.json(empleado);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener empleado' });
  }
};

// -------------------- CREAR UN NUEVO EMPLEADO --------------------
// POST /empleados
const addEmpleado = async (req, res) => {
  try {
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

    const nuevo = await EmpleadoModel.add(empleado);
    res.status(201).json({ mensaje: 'Empleado creado', empleado: nuevo });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear empleado' });
  }
};

// -------------------- REEMPLAZAR COMPLETAMENTE UN EMPLEADO --------------------
// PUT /empleados/:id
const updateEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    const empleado = req.body;

    const roles = ['administrador', 'planner', 'coordinador'];
    const areas = ['Producción y Logística', 'Planificación y Finanzas', 'Atención al Cliente', 'Administración'];

    if (empleado.rol && !roles.includes(empleado.rol)) {
      return res.status(400).json({ mensaje: 'Rol inválido' });
    }
    if (empleado.area && !areas.includes(empleado.area)) {
      return res.status(400).json({ mensaje: 'Área inválida' });
    }

    const actualizado = await EmpleadoModel.update(id, empleado);
    if (!actualizado) return res.status(404).json({ mensaje: 'Empleado no encontrado' });

    res.json({ mensaje: 'Empleado actualizado', empleado: actualizado });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar empleado' });
  }
};

// -------------------- ACTUALIZAR PARCIALMENTE UN EMPLEADO --------------------
// PATCH /empleados/:id
const patchEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    const campos = req.body;

    const roles = ['administrador', 'planner', 'coordinador'];
    const areas = ['Producción y Logística', 'Planificación y Finanzas', 'Atención al Cliente', 'Administración'];

    if (campos.rol && !roles.includes(campos.rol)) {
      return res.status(400).json({ mensaje: 'Rol inválido' });
    }
    if (campos.area && !areas.includes(campos.area)) {
      return res.status(400).json({ mensaje: 'Área inválida' });
    }

    const actualizado = await EmpleadoModel.patch(id, campos);
    if (!actualizado) return res.status(404).json({ mensaje: 'Empleado no encontrado' });

    res.json({ mensaje: 'Empleado actualizado parcialmente', empleado: actualizado });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar empleado parcialmente' });
  }
};

// -------------------- ELIMINAR UN EMPLEADO --------------------
// DELETE /empleados/:id
const deleteEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await EmpleadoModel.remove(id);

    if (!eliminado) return res.status(404).json({ mensaje: 'Empleado no encontrado' });

    res.json({ mensaje: 'Empleado eliminado', empleado: eliminado });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar empleado' });
  }
};

module.exports = { addEmpleado, listEmpleados, getEmpleado, updateEmpleado, patchEmpleado, deleteEmpleado };


