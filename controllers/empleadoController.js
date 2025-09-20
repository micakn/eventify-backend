import EmpleadoModel from '../models/empleadoModel.js';

// -------------------- LISTAR TODOS LOS EMPLEADOS --------------------
// GET /empleados
// Devuelve todos los empleados almacenados
async function listEmpleados(req, res) {
  try {
    const empleados = await EmpleadoModel.getAll();
    res.json(empleados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener empleados' });
  }
}

// -------------------- OBTENER UN EMPLEADO POR ID --------------------
// GET /empleados/:id
// Busca y devuelve un empleado según su ID
async function getEmpleado(req, res) {
  try {
    const { id } = req.params;
    const empleado = await EmpleadoModel.getById(id);
    if (!empleado) return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    res.json(empleado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener empleado' });
  }
}

// -------------------- CREAR NUEVO EMPLEADO --------------------
// POST /empleados
// Crea un nuevo empleado
async function addEmpleado(req, res) {
  try {
    const empleado = req.body;

    // Validar rol y área permitidos
    const roles = ['administrador', 'planner', 'coordinador'];
    const areas = ['Producción y Logística', 'Planificación y Finanzas', 'Atención al Cliente', 'Administración'];

    if (empleado.rol && !roles.includes(empleado.rol)) {
      return res.status(400).json({ mensaje: 'Rol inválido' });
    }

    if (empleado.area && !areas.includes(empleado.area)) {
      return res.status(400).json({ mensaje: 'Área inválida' });
    }

    const nuevo = await EmpleadoModel.add(empleado);
    res.status(201).json({ mensaje: 'Empleado creado', empleado: nuevo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear empleado' });
  }
}

// -------------------- REEMPLAZAR COMPLETAMENTE UN EMPLEADO --------------------
// PUT /empleados/:id
// Actualiza todos los campos de un empleado existente
async function updateEmpleado(req, res) {
  try {
    const { id } = req.params;
    const empleado = req.body;

    // Validar rol y área permitidos
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
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar empleado' });
  }
}

// -------------------- ACTUALIZAR PARCIALMENTE UN EMPLEADO --------------------
// PATCH /empleados/:id
// Actualiza solo los campos enviados de un empleado
async function patchEmpleado(req, res) {
  try {
    const { id } = req.params;
    const campos = req.body;

    // Validar rol y área permitidos
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
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar empleado parcialmente' });
  }
}

// -------------------- ELIMINAR UN EMPLEADO --------------------
// DELETE /empleados/:id
// Elimina un empleado según su ID
async function deleteEmpleado(req, res) {
  try {
    const { id } = req.params;
    const eliminado = await EmpleadoModel.remove(id);
    if (!eliminado) return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    res.json({ mensaje: 'Empleado eliminado', empleado: eliminado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar empleado' });
  }
}

// Exportamos todas las funciones
export default { listEmpleados, getEmpleado, addEmpleado, updateEmpleado, patchEmpleado, deleteEmpleado };



