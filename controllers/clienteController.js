import ClienteModel from '../models/ClienteModel.js';

// -------------------- LISTAR TODOS LOS CLIENTES --------------------
// GET /clientes
// Devuelve todos los clientes almacenados
async function listClientes(req, res) {
  try {
    const clientes = await ClienteModel.getAll();
    res.json(clientes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener clientes' });
  }
}

// -------------------- OBTENER UN CLIENTE POR ID --------------------
// GET /clientes/:id
// Busca y devuelve un cliente según su ID
async function getCliente(req, res) {
  try {
    const { id } = req.params;
    const cliente = await ClienteModel.getById(id);
    if (!cliente) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    res.json(cliente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener cliente' });
  }
}

// -------------------- CREAR NUEVO CLIENTE --------------------
// POST /clientes
// Crea un nuevo cliente
async function addCliente(req, res) {
  try {
    const cliente = req.body;
    const nuevoCliente = await ClienteModel.add(cliente);
    res.status(201).json({ mensaje: 'Cliente creado', cliente: nuevoCliente });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear cliente' });
  }
}

// -------------------- REEMPLAZAR COMPLETAMENTE UN CLIENTE --------------------
// PUT /clientes/:id
// Actualiza todos los campos de un cliente existente
async function updateCliente(req, res) {
  try {
    const { id } = req.params;
    const cliente = req.body;

    const actualizado = await ClienteModel.update(id, cliente);
    if (!actualizado) return res.status(404).json({ mensaje: 'Cliente no encontrado' });

    res.json({ mensaje: 'Cliente actualizado', cliente: actualizado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar cliente' });
  }
}

// -------------------- ACTUALIZAR PARCIALMENTE UN CLIENTE --------------------
// PATCH /clientes/:id
// Actualiza solo los campos enviados de un cliente
async function patchCliente(req, res) {
  try {
    const { id } = req.params;
    const campos = req.body;

    const actualizado = await ClienteModel.patch(id, campos);
    if (!actualizado) return res.status(404).json({ mensaje: 'Cliente no encontrado' });

    res.json({ mensaje: 'Cliente actualizado parcialmente', cliente: actualizado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar cliente parcialmente' });
  }
}

// -------------------- ELIMINAR UN CLIENTE --------------------
// DELETE /clientes/:id
// Elimina un cliente según su ID
async function deleteCliente(req, res) {
  try {
    const { id } = req.params;
    const eliminado = await ClienteModel.remove(id);
    if (!eliminado) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    res.json({ mensaje: 'Cliente eliminado', cliente: eliminado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar cliente' });
  }
}

// Exportamos todas las funciones
export default { listClientes, getCliente, addCliente, updateCliente, patchCliente, deleteCliente };


