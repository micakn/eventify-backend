// Importamos el modelo de Clientes
const ClienteModel = require('../models/clienteModel');

// -------------------- LISTAR TODOS LOS CLIENTES --------------------
// GET /clientes
const listClientes = (req, res) => {
  const clientes = ClienteModel.getAll();
  res.json(clientes);
};

// -------------------- OBTENER UN CLIENTE POR ID --------------------
// GET /clientes/:id
const getCliente = (req, res) => {
  const { id } = req.params;
  const cliente = ClienteModel.getById(id);

  if (!cliente) return res.status(404).json({ mensaje: 'Cliente no encontrado' });

  res.json(cliente);
};

// -------------------- CREAR NUEVO CLIENTE --------------------
// POST /clientes
const addCliente = (req, res) => {
  const cliente = req.body;
  const nuevoCliente = ClienteModel.add(cliente);
  res.status(201).json({ mensaje: 'Cliente creado', cliente: nuevoCliente });
};

// -------------------- REEMPLAZAR COMPLETAMENTE UN CLIENTE --------------------
// PUT /clientes/:id
const updateCliente = (req, res) => {
  const { id } = req.params;
  const cliente = req.body;

  const actualizado = ClienteModel.update(id, cliente);
  if (!actualizado) return res.status(404).json({ mensaje: 'Cliente no encontrado' });

  res.json({ mensaje: 'Cliente actualizado', cliente: actualizado });
};

// -------------------- ACTUALIZAR PARCIALMENTE UN CLIENTE --------------------
// PATCH /clientes/:id
const patchCliente = (req, res) => {
  const { id } = req.params;
  const campos = req.body;

  const actualizado = ClienteModel.patch(id, campos);
  if (!actualizado) return res.status(404).json({ mensaje: 'Cliente no encontrado' });

  res.json({ mensaje: 'Cliente actualizado parcialmente', cliente: actualizado });
};

// -------------------- ELIMINAR UN CLIENTE --------------------
// DELETE /clientes/:id
const deleteCliente = (req, res) => {
  const { id } = req.params;
  const eliminado = ClienteModel.remove(id);

  if (!eliminado) return res.status(404).json({ mensaje: 'Cliente no encontrado' });

  res.json({ mensaje: 'Cliente eliminado', cliente: eliminado });
};

// Exportamos las funciones
module.exports = {listClientes, getCliente, addCliente, updateCliente, patchCliente, deleteCliente};
