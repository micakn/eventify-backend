import EventoModel from '../models/EventoModel.js';
import ClienteModel from '../models/ClienteModel.js';
import EmpleadoModel from '../models/EmpleadoModel.js';

const EventoWebController = {
    /**
     * Listar todos los eventos desde MongoDB
     */
    async listarEventos(req, res) {
        try {
            console.log('🔍 Buscando eventos en MongoDB usando EventoModel...');
            
            const eventos = await EventoModel.getAll();
            
            console.log(`Encontrados ${eventos.length} eventos`);
            
            // Transformar los datos para que coincidan con la vista
            const eventosTransformados = eventos.map(evento => ({
                _id: evento.id, // Tu modelo usa 'id' en lugar de '_id'
                nombre: evento.nombre,
                descripcion: evento.descripcion,
                fecha_inicio: evento.fechaInicio, // Transformar fechaInicio → fecha_inicio
                fecha_fin: evento.fechaFin,       // Transformar fechaFin → fecha_fin
                lugar: evento.lugar,
                presupuesto: evento.presupuesto,
                // Agregar tipo y estado
                tipo: evento.tipo || 'corporativo',
                estado: evento.estado || this.determinarEstado(evento.fechaInicio, evento.fechaFin),
                // Datos de las relaciones
                cliente: evento.clienteId ? {
                    id: evento.clienteId.id || evento.clienteId,
                    nombre: evento.clienteId.nombre,
                    empresa: evento.clienteId.empresa
                } : null,
                empleado: evento.empleadoId ? {
                    id: evento.empleadoId.id || evento.empleadoId,
                    nombre: evento.empleadoId.nombre,
                    rol: evento.empleadoId.rol
                } : null
            }));

            res.render('eventos/eventos', {
                title: 'Eventos',
                currentPath: '/eventos',
                eventos: eventosTransformados
            });

        } catch (error) {
            console.error('❌ Error al listar eventos desde MongoDB:', error);
            
            res.render('eventos/eventos', {
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
            // Obtener listas de clientes y empleados
            const [clientes, empleados] = await Promise.all([
                ClienteModel.getAll(),
                EmpleadoModel.getAll()
            ]);

            res.render('eventos/crear-evento', {
                title: 'Crear Evento',
                currentPath: '/eventos',
                actionUrl: '/eventos/crear',
                evento: {},
                clientes: clientes,
                empleados: empleados,
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

            // Validaciones básicas
            if (!nombre || !lugar) {
                return res.redirect('/eventos/crear');
            }

            // Mapear los campos del formulario a tu modelo
            const nuevoEventoData = {
                nombre: nombre,
                descripcion: descripcion || '',
                fechaInicio: fecha_inicio ? new Date(fecha_inicio) : null,
                fechaFin: fecha_fin ? new Date(fecha_fin) : null,
                lugar: lugar,
                presupuesto: precio ? parseFloat(precio) : 0,
                tipo: tipo || 'corporativo',
                estado: estado || 'pendiente',
                clienteId: cliente_id && cliente_id !== '' ? cliente_id : null,
                empleadoId: empleado_id && empleado_id !== '' ? empleado_id : null,
            };

            console.log('Creando evento con datos:', nuevoEventoData);

            // Usar el método add() de tu modelo personalizado
            const nuevoEvento = await EventoModel.add(nuevoEventoData);

            if (!nuevoEvento) {
                throw new Error('No se pudo crear el evento');
            }

            console.log('Evento creado en MongoDB:', nuevoEvento.id);

            res.redirect('/eventos');
            
        } catch (error) {
            console.error('❌ Error al crear evento en MongoDB:', error);

            // Recargar clientes y empleados para mostrar el formulario nuevamente
            const [clientes, empleados] = await Promise.all([
                ClienteModel.getAll(),
                EmpleadoModel.getAll()
            ]);

            res.render('eventos/crear-evento', {
                title: 'Crear Evento',
                currentPath: '/eventos',
                actionUrl: '/eventos/crear',
                evento: req.body,
                clientes: clientes,
                empleados: empleados,
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
            
            console.log('Buscando evento para editar:', id);

            // Verificar que el ID sea válido
            if (!id || id === 'undefined') {
                console.log('❌ ID inválido');
                return res.redirect('/eventos');
            }
            
            const [evento, clientes, empleados] = await Promise.all([
                EventoModel.getById(id),
                ClienteModel.getAll(),
                EmpleadoModel.getAll()
            ]);

            console.log('Evento encontrado:', evento ? evento.nombre : 'No encontrado');
            
            if (!evento) {
                console.log('❌ Evento no encontrado en la base de datos');
                return res.redirect('/eventos');
            }

            console.log('Evento encontrado:', evento.nombre);

            // Transformar los datos para el formulario
            const eventoTranformado = {
                _id: evento.id,
                nombre: evento.nombre,
                descripcion: evento.descripcion,
                fecha_inicio: evento.fechaInicio,
                fecha_fin: evento.fechaFin,
                lugar: evento.lugar,
                precio: evento.presupuesto,
                tipo: evento.tipo || 'corporativo',
                estado: evento.estado || 'pendiente',
                cliente_id: evento.clienteId ? (evento.clienteId.id || evento.clienteId) : '',
                empleado_id: evento.empleadoId ? (evento.empleadoId.id || evento.empleadoId) : ''
            };

            res.render('eventos/editar-evento', {
                title: 'Editar Evento',
                currentPath: '/eventos',
                evento: eventoTranformado,
                clientes: clientes,
                empleados: empleados,
                actionUrl: `/eventos/editar/${id}`
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

            console.log('Actualizando evento:', id);

            // Mapear los campos del formulario a tu modelo
            const datosActualizados = {
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

            // Usar el método update() de tu modelo personalizado
            const eventoActualizado = await EventoModel.update(id, datosActualizados);
            
            if (!eventoActualizado) {
                throw new Error('No se pudo actualizar el evento');
            }

            console.log('✅ Evento actualizado en MongoDB:', id);

            res.redirect('/eventos');
            
        } catch (error) {
            console.error('❌ Error al actualizar evento en MongoDB:', error);

            // Recargar datos para mostrar el formulario con error
            const [clientes, empleados] = await Promise.all([
                ClienteModel.getAll(),
                EmpleadoModel.getAll()
            ]);
            
            res.render('eventos/editar-evento', {
                title: 'Editar Evento',
                currentPath: '/eventos',
                evento: req.body,
                clientes: clientes,
                empleados: empleados,
                actionUrl: `/eventos/editar/${req.params.id}`,
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
            
            console.log('Eliminando evento:', id);
            
            // Usar el método remove() de tu modelo personalizado
            const resultado = await EventoModel.remove(id);
            
            if (!resultado) {
                throw new Error('No se pudo eliminar el evento');
            }

            console.log('✅ Evento eliminado de MongoDB:', id);

            res.redirect('/eventos');
            
        } catch (error) {
            console.error('❌ Error al eliminar evento de MongoDB:', error);
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
    }
};

export default EventoWebController;
