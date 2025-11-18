// controllers/TareaWebController.js
import TareaModel from '../models/TareaModel.js';
import EmpleadoModel from '../models/EmpleadoModel.js';
import EventoModel from '../models/EventoModel.js';

const TareaWebController = {
  /**
   * Listar todas las tareas
   */
  async listarTareas(req, res) {
    try {
      const tareas = await TareaModel.getAll();

      res.render('tareas/index', {
        title: 'Tareas - Eventify',
        tareas,
        currentPath: req.baseUrl || req.path
      });
    } catch (error) {
      console.error('Error al cargar tareas:', error);
      res.status(500).render('error', { 
        title: 'Error', 
        message: 'Error al cargar la lista de tareas' 
      });
    }
  },

  /**
   * Mostrar formulario para crear tarea
   */
  async mostrarFormularioCrear(req, res) {
    try {
      const [empleados, eventos] = await Promise.all([
        EmpleadoModel.getAll(),
        EventoModel.getAll()
      ]);

      res.render('tareas/form', {
        title: 'Nueva Tarea - Eventify',
        formTitle: 'Nueva Tarea',
        tarea: null,
        formAction: '/tareas/crear',
        empleados,
        eventos
      });
    } catch (error) {
      console.error('Error al mostrar formulario:', error);
      res.redirect('/tareas');
    }
  },

  /**
   * Crear tarea
   */
  async crearTarea(req, res) {
    try {
      const {
        titulo,
        descripcion,
        estado,
        fechaInicio,
        fechaFin,
        prioridad,
        area,
        tipo,
        empleadoAsignado,
        eventoAsignado,
        horasEstimadas,
        horasReales
      } = req.body;

      if (!titulo || !area || !tipo) {
        const [empleados, eventos] = await Promise.all([
          EmpleadoModel.getAll(),
          EventoModel.getAll()
        ]);

        return res.render('tareas/form', {
          title: 'Nueva Tarea - Eventify',
          formTitle: 'Nueva Tarea',
          tarea: req.body,
          formAction: '/tareas/crear',
          empleados,
          eventos,
          error: 'Título, área y tipo son obligatorios'
        });
      }

      const nuevaTarea = await TareaModel.add({
        titulo,
        descripcion: descripcion || '',
        estado: estado || 'pendiente',
        fechaInicio: fechaInicio ? new Date(fechaInicio) : null,
        fechaFin: fechaFin ? new Date(fechaFin) : null,
        prioridad: prioridad || 'media',
        area,
        tipo,
        empleadoAsignado: empleadoAsignado || null,
        eventoAsignado: eventoAsignado || null,
        horasEstimadas: horasEstimadas ? parseInt(horasEstimadas) : 0,
        horasReales: horasReales ? parseInt(horasReales) : 0
      });

      if (!nuevaTarea) {
        throw new Error('No se pudo crear la tarea');
      }

      res.redirect('/tareas');
    } catch (error) {
      console.error('Error al crear tarea:', error);
      
      const [empleados, eventos] = await Promise.all([
        EmpleadoModel.getAll(),
        EventoModel.getAll()
      ]);

      res.render('tareas/form', {
        title: 'Nueva Tarea - Eventify',
        formTitle: 'Nueva Tarea',
        tarea: req.body,
        formAction: '/tareas/crear',
        empleados,
        eventos,
        error: 'Error al crear la tarea: ' + error.message
      });
    }
  },

  /**
   * Mostrar formulario para editar tarea
   */
  async mostrarFormularioEditar(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || id === 'undefined') {
        return res.redirect('/tareas');
      }
      
      const [tarea, empleados, eventos] = await Promise.all([
        TareaModel.getById(id),
        EmpleadoModel.getAll(),
        EventoModel.getAll()
      ]);
      
      if (!tarea) {
        return res.redirect('/tareas');
      }

      res.render('tareas/form', {
        title: 'Editar Tarea - Eventify',
        formTitle: 'Editar Tarea',
        tarea: tarea,
        formAction: `/tareas/editar/${id}`,
        empleados,
        eventos
      });
    } catch (error) {
      console.error('Error al mostrar formulario de edición:', error);
      res.redirect('/tareas');
    }
  },

  /**
   * Actualizar tarea
   */
  async actualizarTarea(req, res) {
    try {
      const { id } = req.params;
      const {
        titulo,
        descripcion,
        estado,
        fechaInicio,
        fechaFin,
        prioridad,
        area,
        tipo,
        empleadoAsignado,
        eventoAsignado,
        horasEstimadas,
        horasReales
      } = req.body;

      const datosActualizados = {
        titulo,
        descripcion: descripcion || '',
        estado: estado || 'pendiente',
        fechaInicio: fechaInicio ? new Date(fechaInicio) : null,
        fechaFin: fechaFin ? new Date(fechaFin) : null,
        prioridad: prioridad || 'media',
        area,
        tipo,
        empleadoAsignado: empleadoAsignado || null,
        eventoAsignado: eventoAsignado || null,
        horasEstimadas: horasEstimadas ? parseInt(horasEstimadas) : 0,
        horasReales: horasReales ? parseInt(horasReales) : 0
      };

      const tareaActualizada = await TareaModel.update(id, datosActualizados);
      
      if (!tareaActualizada) {
        throw new Error('No se pudo actualizar la tarea');
      }

      res.redirect('/tareas');
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
      
      const [empleados, eventos] = await Promise.all([
        EmpleadoModel.getAll(),
        EventoModel.getAll()
      ]);

      res.render('tareas/form', {
        title: 'Editar Tarea - Eventify',
        formTitle: 'Editar Tarea',
        tarea: req.body,
        formAction: `/tareas/editar/${req.params.id}`,
        empleados,
        eventos,
        error: 'Error al actualizar la tarea: ' + error.message
      });
    }
  },

  /**
   * Eliminar tarea
   */
  async eliminarTarea(req, res) {
    try {
      const { id } = req.params;
      
      const resultado = await TareaModel.remove(id);
      
      if (!resultado) {
        throw new Error('No se pudo eliminar la tarea');
      }

      res.redirect('/tareas');
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
      res.redirect('/tareas');
    }
    },

  /**
   * Mostrar detalle de una tarea (vista)
   */
  async mostrarTarea(req, res) {
    try {
      const { id } = req.params;
      if (!id || id === 'undefined') return res.redirect('/tareas');

      const tarea = await TareaModel.getById(id);
      if (!tarea) return res.redirect('/tareas');

      res.render('tareas/show', {
        title: `Tarea - ${tarea.titulo}`,
        currentPath: '/tareas',
        tarea
      });
    } catch (error) {
      console.error('Error al mostrar tarea:', error);
      res.redirect('/tareas');
    }
  }
};

export default TareaWebController;