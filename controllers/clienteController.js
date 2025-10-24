// controllers/clienteController.js
// -------------------- CONTROLADOR DE CLIENTES --------------------
import ClienteModel from '../models/ClienteModel.js';

// -------------------- LISTAR TODOS LOS CLIENTES --------------------
// GET /clientes
async function listClientes(req, res) {
  try {
    const clientes = await ClienteModel.getAll();
    res.json(clientes);
  } catch (error) {
    console.error('Error al listar clientes:', error);
    res.status(500).json({ mensaje: 'Error al obtener clientes' });
  }
}

// -------------------- OBTENER CLIENTE POR ID --------------------
// GET /clientes/:id
async function getCliente(req, res) {
  try {
    const cliente = await ClienteModel.getById(req.params.id);
    if (!cliente) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    res.json(cliente);
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    res.status(500).json({ mensaje: 'Error al obtener cliente' });
  }
}

// -------------------- CREAR NUEVO CLIENTE --------------------
// POST /clientes
async function addCliente(req, res) {
  try {
    const cliente = req.body;
    if (!cliente.nombre || !cliente.email) {
      return res.status(400).json({ mensaje: 'Nombre y correo son obligatorios' });
    }
    const nuevoCliente = await ClienteModel.add(cliente);
    res.status(201).json({ mensaje: 'Cliente creado', cliente: nuevoCliente });
  } catch (error) {
    console.error('Error al crear cliente:', error);
    res.status(500).json({ mensaje: 'Error al crear cliente' });
  }
}

// -------------------- ACTUALIZAR CLIENTE COMPLETO --------------------
// PUT /clientes/:id
async function updateCliente(req, res) {
  try {
    const actualizado = await ClienteModel.update(req.params.id, req.body);
    if (!actualizado) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    res.json({ mensaje: 'Cliente actualizado', cliente: actualizado });
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    res.status(500).json({ mensaje: 'Error al actualizar cliente' });
  }
}

// -------------------- ACTUALIZAR PARCIALMENTE CLIENTE --------------------
// PATCH /clientes/:id
async function patchCliente(req, res) {
  try {
    const actualizado = await ClienteModel.patch(req.params.id, req.body);
    if (!actualizado) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    res.json({ mensaje: 'Cliente actualizado parcialmente', cliente: actualizado });
  } catch (error) {
    console.error('Error al actualizar parcialmente cliente:', error);
    res.status(500).json({ mensaje: 'Error al actualizar parcialmente cliente' });
  }
}

// -------------------- ELIMINAR CLIENTE --------------------
// DELETE /clientes/:id
async function deleteCliente(req, res) {
  try {
    const eliminado = await ClienteModel.remove(req.params.id);
    if (!eliminado) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    res.json({ mensaje: 'Cliente eliminado', cliente: eliminado });
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    res.status(500).json({ mensaje: 'Error al eliminar cliente' });
  }
}

export default { listClientes, getCliente, addCliente, updateCliente, patchCliente, deleteCliente };
