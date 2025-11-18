// controllers/EmpleadoWebController.js
import EmpleadoModel from '../models/EmpleadoModel.js';

const EmpleadoWebController = {
  /**
   * Listar todos los empleados
   */
  async listarEmpleados(req, res) {
    try {
      const empleados = await EmpleadoModel.getAll();

      res.render('empleados/index', {
        title: 'Empleados - Eventify',
        empleados,
        currentPath: req.baseUrl || req.path
      });
    } catch (error) {
      console.error('Error al cargar empleados:', error);
      res.status(500).render('error', { 
        title: 'Error', 
        message: 'Error al cargar la lista de empleados' 
      });
    }
  },

  /**
   * Mostrar formulario para crear empleado
   */
  mostrarFormularioCrear(req, res) {
    res.render('empleados/form', {
      title: 'Nuevo Empleado - Eventify',
      formTitle: 'Nuevo Empleado',
      empleado: null,
      formAction: '/empleados/crear'
    });
  },

  /**
   * Crear empleado
   */
  async crearEmpleado(req, res) {
    try {
      const { nombre, rol, area, email, telefono } = req.body;

      if (!nombre || !rol || !area) {
        return res.render('empleados/form', {
          title: 'Nuevo Empleado - Eventify',
          formTitle: 'Nuevo Empleado',
          empleado: req.body,
          formAction: '/empleados/crear',
          error: 'Nombre, rol y área son obligatorios'
        });
      }

      const nuevoEmpleado = await EmpleadoModel.add({
        nombre,
        rol,
        area,
        email: email || '',
        telefono: telefono || ''
      });

      if (!nuevoEmpleado) {
        throw new Error('No se pudo crear el empleado');
      }

      res.redirect('/empleados');
    } catch (error) {
      console.error('Error al crear empleado:', error);
      res.render('empleados/form', {
        title: 'Nuevo Empleado - Eventify',
        formTitle: 'Nuevo Empleado',
        empleado: req.body,
        formAction: '/empleados/crear',
        error: 'Error al crear el empleado: ' + error.message
      });
    }
  },

  /**
   * Mostrar formulario para editar empleado
   */
  async mostrarFormularioEditar(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || id === 'undefined') {
        return res.redirect('/empleados');
      }
      
      const empleado = await EmpleadoModel.getById(id);
      
      if (!empleado) {
        return res.redirect('/empleados');
      }

      res.render('empleados/form', {
        title: 'Editar Empleado - Eventify',
        formTitle: 'Editar Empleado',
        empleado: empleado,
        formAction: `/empleados/editar/${id}`
      });
    } catch (error) {
      console.error('Error al mostrar formulario de edición:', error);
      res.redirect('/empleados');
    }
  },

  /**
   * Actualizar empleado
   */
  async actualizarEmpleado(req, res) {
    try {
      const { id } = req.params;
      const { nombre, rol, area, email, telefono } = req.body;

      const datosActualizados = {
        nombre,
        rol,
        area,
        email: email || '',
        telefono: telefono || ''
      };

      const empleadoActualizado = await EmpleadoModel.update(id, datosActualizados);
      
      if (!empleadoActualizado) {
        throw new Error('No se pudo actualizar el empleado');
      }

      res.redirect('/empleados');
    } catch (error) {
      console.error('Error al actualizar empleado:', error);
      
      res.render('empleados/form', {
        title: 'Editar Empleado - Eventify',
        formTitle: 'Editar Empleado',
        empleado: req.body,
        formAction: `/empleados/editar/${req.params.id}`,
        error: 'Error al actualizar el empleado: ' + error.message
      });
    }
  },

  /**
   * Eliminar empleado
   */
  async eliminarEmpleado(req, res) {
    try {
      const { id } = req.params;
      
      const resultado = await EmpleadoModel.remove(id);
      
      if (!resultado) {
        throw new Error('No se pudo eliminar el empleado');
      }

      res.redirect('/empleados');
    } catch (error) {
      console.error('Error al eliminar empleado:', error);
      res.redirect('/empleados');
    }
  }
};

export default EmpleadoWebController;