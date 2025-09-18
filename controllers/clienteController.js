// Importamos el modelo de Clientes
const ClienteModel = require('../models/ClienteModel');

// -------------------- LISTAR TODOS LOS CLIENTES --------------------
// GET /clientes
const listClientes = async (req, res) => {
  try {
    const clientes = await ClienteModel.getAll();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener clientes' });
  }
};

// -------------------- OBTENER UN CLIENTE POR ID --------------------
// GET /clientes/:id
const getCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await ClienteModel.getById(id);

    if (!cliente) return res.status(404).json({ mensaje: 'Cliente no encontrado' });

    res.json(cliente);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener cliente' });
  }
};

// -------------------- CREAR NUEVO CLIENTE --------------------
// POST /clientes
const addCliente = async (req, res) => {
  try {
    const cliente = req.body;
    const nuevoCliente = await ClienteModel.add(cliente);
    res.status(201).json({ mensaje: 'Cliente creado', cliente: nuevoCliente });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear cliente' });
  }
};

// -------------------- REEMPLAZAR COMPLETAMENTE UN CLIENTE --------------------
// PUT /clientes/:id
const updateCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = req.body;

    const actualizado = await ClienteModel.update(id, cliente);
    if (!actualizado) return res.status(404).json({ mensaje: 'Cliente no encontrado' });

    res.json({ mensaje: 'Cliente actualizado', cliente: actualizado });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar cliente' });
  }
};

// -------------------- ACTUALIZAR PARCIALMENTE UN CLIENTE --------------------
// PATCH /clientes/:id
const patchCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const campos = req.body;

    const actualizado = await ClienteModel.patch(id, campos);
    if (!actualizado) return res.status(404).json({ mensaje: 'Cliente no encontrado' });

    res.json({ mensaje: 'Cliente actualizado parcialmente', cliente: actualizado });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar cliente parcialmente' });
  }
};

// -------------------- ELIMINAR UN CLIENTE --------------------
// DELETE /clientes/:id
const deleteCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await ClienteModel.remove(id);

    if (!eliminado) return res.status(404).json({ mensaje: 'Cliente no encontrado' });

    res.json({ mensaje: 'Cliente eliminado', cliente: eliminado });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar cliente' });
  }
};

// Exportamos las funciones
module.exports = { listClientes, getCliente, addCliente, updateCliente, patchCliente, deleteCliente };

