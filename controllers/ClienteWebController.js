const ClienteModel = require('../models/ClienteModel');

// Listar todos los clientes (VISTA WEB)
const listClientesWeb = async (req, res) => {
  try {
    const clientes = await ClienteModel.getAll();
    res.render('clientes/index', {
      title: 'Clientes - Eventify',
      clientes: clientes
    });
  } catch (error) {
    console.error('Error al cargar clientes:', error);
    res.status(500).render('error', {
      title: 'Error - Eventify',
      message: 'Error al cargar la lista de clientes'
    });
  }
};

// Mostrar formulario para nuevo cliente
const showNewForm = (req, res) => {
  res.render('clientes/form', {
    title: 'Nuevo Cliente - Eventify',
    formTitle: 'Nuevo Cliente',
    cliente: null,
    formAction: '/clientes'
  });
};

// Mostrar formulario para editar cliente
const showEditForm = async (req, res) => {
  try {
    const cliente = await ClienteModel.getById(req.params.id);
    if (!cliente) {
      return res.status(404).render('error', {
        title: 'Error - Eventify',
        message: 'Cliente no encontrado'
      });
    }

    res.render('clientes/form', {
      title: 'Editar Cliente - Eventify',
      formTitle: 'Editar Cliente',
      cliente: cliente,
      formAction: `/clientes/${cliente.id}`
    });
  } catch (error) {
    console.error('Error al cargar cliente:', error);
    res.status(500).render('error', {
      title: 'Error - Eventify',
      message: 'Error al cargar el cliente'
    });
  }
};

// Mostrar detalles del cliente
const showCliente = async (req, res) => {
  try {
    const cliente = await ClienteModel.getById(req.params.id);
    if (!cliente) {
      return res.status(404).render('error', {
        title: 'Error - Eventify',
        message: 'Cliente no encontrado'
      });
    }

    res.render('clientes/show', {
      title: `${cliente.nombre} - Eventify`,
      cliente: cliente
    });
  } catch (error) {
    console.error('Error al cargar cliente:', error);
    res.status(500).render('error', {
      title: 'Error - Eventify',
      message: 'Error al cargar el cliente'
    });
  }
};

// Crear nuevo cliente (desde formulario web)
const createClienteWeb = async (req, res) => {
  try {
    await ClienteModel.add(req.body);
    res.redirect('/clientes');
  } catch (error) {
    console.error('Error al crear cliente:', error);
    res.status(500).render('error', {
      title: 'Error - Eventify',
      message: 'Error al crear el cliente'
    });
  }
};

// Actualizar cliente (desde formulario web)
const updateClienteWeb = async (req, res) => {
  try {
    const actualizado = await ClienteModel.update(req.params.id, req.body);
    if (!actualizado) {
      return res.status(404).render('error', {
        title: 'Error - Eventify',
        message: 'Cliente no encontrado'
      });
    }
    res.redirect('/clientes');
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    res.status(500).render('error', {
      title: 'Error - Eventify',
      message: 'Error al actualizar el cliente'
    });
  }
};

// Eliminar cliente (desde web)
const deleteClienteWeb = async (req, res) => {
  try {
    const eliminado = await ClienteModel.remove(req.params.id);
    if (!eliminado) {
      return res.status(404).render('error', {
        title: 'Error - Eventify',
        message: 'Cliente no encontrado'
      });
    }
    res.redirect('/clientes');
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    res.status(500).render('error', {
      title: 'Error - Eventify',
      message: 'Error al eliminar el cliente'
    });
  }
};

module.exports = {
  listClientesWeb,
  showNewForm,
  showEditForm,
  showCliente,
  createClienteWeb,
  updateClienteWeb,
  deleteClienteWeb
};
