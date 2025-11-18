// controllers/EventoWebController.js
import EventoModel from '../models/EventoModel.js';
import ClienteModel from '../models/ClienteModel.js';
import EmpleadoModel from '../models/EmpleadoModel.js';
import TareaModel from '../models/TareaModel.js';

const EventoWebController = {
    /**
     * Listar todos los eventos desde MongoDB
     */
    async listarEventos(req, res) {
        try {
            const eventos = await EventoModel.getAll();
            
            // Transformar los datos para que coincidan con la vista
            const eventosTransformados = eventos.map(evento => ({
                _id: evento.id,
                nombre: evento.nombre,
                descripcion: evento.descripcion,
                fecha_inicio: evento.fechaInicio,
                fecha_fin: evento.fechaFin,
                lugar: evento.lugar,
                presupuesto: evento.presupuesto,
                tipo: evento.tipo || 'corporativo',
                estado: evento.estado || this.determinarEstado(evento.fechaInicio, evento.fechaFin),
                cliente: evento.clienteId,
                empleado: evento.empleadoId,
            }));

            // <-- CAMBIO AQUÍ: Renderiza el nuevo archivo 'index.pug'
            res.render('eventos/index', {
                title: 'Eventos',
                currentPath: '/eventos',
                eventos: eventosTransformados
            });

        } catch (error) {
            console.error('Error al listar eventos desde MongoDB:', error);
            
            // <-- CAMBIO AQUÍ: Renderiza el nuevo archivo 'index.pug' en caso de error
            res.render('eventos/index', {
                title: 'Eventos',
                currentPath: '/eventos',
                eventos: [],
                error: 'Error al cargar los eventos desde la base de datos'
            });
        }
    },

    /**
     * Mostrar formulario para crear evento
     */
    async mostrarFormularioCrear(req, res) {
        try {
            const [clientes, empleados] = await Promise.all([
                ClienteModel.getAll(),
                EmpleadoModel.getAll()
            ]);

            // <-- CAMBIO AQUÍ: Renderiza el formulario unificado 'form.pug'
            res.render('eventos/form', {
                title: 'Crear Evento - Eventify',
                formTitle: 'Nuevo Evento',
                evento: null, // No hay evento al crear
                formAction: '/eventos/crear',
                clientes,
                empleados,
            });
        } catch (error) {
            console.error('Error al mostrar formulario de creación:', error);
            res.redirect('/eventos');
        }
    },

    /**
     * Crear nuevo evento en MongoDB
     */
    async crearEvento(req, res) {
        try {
            const {
                nombre,
                descripcion,
                fecha_inicio,
                fecha_fin,
                lugar,
                precio,
                cliente_id,
                empleado_id,
                tipo,
                estado,
            } = req.body;

            // La lógica de creación se mantiene intacta
            const nuevoEventoData = {
                nombre: nombre,
                descripcion: descripcion || '',
                fechaInicio: fecha_inicio ? new Date(fecha_inicio) : null,
                fechaFin: fecha_fin ? new Date(fecha_fin) : null,
                lugar: lugar,
                presupuesto: precio ? parseFloat(precio) : 0,
                tipo: tipo || 'corporativo',
                estado: estado || 'pendiente',
                clienteId: cliente_id || null,
                empleadoId: empleado_id || null,
            };

            await EventoModel.add(nuevoEventoData);
            res.redirect('/eventos');
            
        } catch (error) {
            console.error('Error al crear evento en MongoDB:', error);

            const [clientes, empleados] = await Promise.all([
                ClienteModel.getAll(),
                EmpleadoModel.getAll()
            ]);
            
            // <-- CAMBIO AQUÍ: En caso de error, renderiza 'form.pug' en lugar de 'crear-evento.pug'
            res.render('eventos/form', {
                title: 'Crear Evento - Eventify',
                formTitle: 'Nuevo Evento',
                evento: req.body, // Repopular el formulario con los datos ingresados
                formAction: '/eventos/crear',
                clientes,
                empleados,
                error: 'Error al crear el evento: ' + error.message
            });
        }
    },

    /**
     * Mostrar formulario para editar evento
     */
    async mostrarFormularioEditar(req, res) {
        try {
            const { id } = req.params;
            if (!id || id === 'undefined') {
                return res.redirect('/eventos');
            }
            
            const [evento, clientes, empleados] = await Promise.all([
                EventoModel.getById(id),
                ClienteModel.getAll(),
                EmpleadoModel.getAll()
            ]);
            
            if (!evento) {
                return res.redirect('/eventos');
            }

            // Mapeo simple de IDs para que el 'selected' del formulario funcione
            evento.cliente_id = evento.clienteId ? String(evento.clienteId._id || evento.clienteId) : null;
            evento.empleado_id = evento.empleadoId ? String(evento.empleadoId._id || evento.empleadoId) : null;

            // <-- CAMBIO AQUÍ: Renderiza el formulario unificado 'form.pug'
            res.render('eventos/form', {
                title: 'Editar Evento - Eventify',
                formTitle: 'Editar Evento',
                evento, // El evento encontrado
                formAction: `/eventos/editar/${id}`,
                clientes,
                empleados,
            });
        } catch (error) {
            console.error('Error al mostrar formulario de edición:', error);
            res.redirect('/eventos');
        }
    },

    /**
     * Actualizar evento existente en MongoDB
     */
    async actualizarEvento(req, res) {
        try {
            const { id } = req.params;
            const datosActualizados = req.body; // El cuerpo ya viene con los nombres correctos

            // La lógica de actualización se mantiene intacta
            const eventoData = {
                nombre: datosActualizados.nombre,
                descripcion: datosActualizados.descripcion || '',
                fechaInicio: datosActualizados.fecha_inicio ? new Date(datosActualizados.fecha_inicio) : null,
                fechaFin: datosActualizados.fecha_fin ? new Date(datosActualizados.fecha_fin) : null,
                lugar: datosActualizados.lugar,
                presupuesto: datosActualizados.precio ? parseFloat(datosActualizados.precio) : 0,
                tipo: datosActualizados.tipo || 'corporativo',
                estado: datosActualizados.estado || 'pendiente',
                clienteId: datosActualizados.cliente_id || null,
                empleadoId: datosActualizados.empleado_id || null,
            };

            await EventoModel.update(id, eventoData);
            res.redirect('/eventos');
            
        } catch (error) {
            console.error('Error al actualizar evento en MongoDB:', error);

            const [clientes, empleados] = await Promise.all([
                ClienteModel.getAll(),
                EmpleadoModel.getAll()
            ]);

            const eventoConId = { ...req.body, id: req.params.id };
            
            // <-- CAMBIO AQUÍ: En caso de error, renderiza 'form.pug' en lugar de 'editar-evento.pug'
            res.render('eventos/form', {
                title: 'Editar Evento - Eventify',
                formTitle: 'Editar Evento',
                evento: eventoConId,
                formAction: `/eventos/editar/${req.params.id}`,
                clientes,
                empleados,
                error: 'Error al actualizar el evento: ' + error.message
            });
        }
    },

    /**
     * Eliminar evento de MongoDB
     */
    async eliminarEvento(req, res) {
        try {
            const { id } = req.params;
            await EventoModel.remove(id);
            res.redirect('/eventos');
        } catch (error) {
            console.error('Error al eliminar evento de MongoDB:', error);
            res.redirect('/eventos');
        }
    },

    determinarEstado(fechaInicio, fechaFin) {
        if (!fechaInicio) return 'pendiente';
        const ahora = new Date();
        const inicio = new Date(fechaInicio);
        const fin = fechaFin ? new Date(fechaFin) : null;
        if (fin && fin < ahora) return 'finalizado';
        if (inicio > ahora) return 'pendiente';
        if (inicio <= ahora && (!fin || fin >= ahora)) return 'activo';
        return 'activo';
    },

    /**
     * Mostrar detalle de un solo evento (vista)
     */
    async mostrarEvento(req, res) {
        try {
            const { id } = req.params;
            if (!id || id === 'undefined') return res.redirect('/eventos');

            const evento = await EventoModel.getById(id);
            if (!evento) return res.redirect('/eventos');

            // La lógica para mostrar el detalle no necesita cambios
            res.render('eventos/show', {
                title: `Evento - ${evento.nombre}`,
                currentPath: '/eventos',
                evento
            });
        } catch (error) {
            console.error('Error al mostrar evento:', error);
            res.redirect('/eventos');
        }
    }
};

export default EventoWebController;

