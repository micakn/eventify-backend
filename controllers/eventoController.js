import EventoModel from '../models/eventoModel.js';

// -------------------- LISTAR TODOS LOS EVENTOS --------------------
// GET /eventos
// Devuelve todos los eventos almacenados
async function listEventos(req, res) {
  try {
    const eventos = await EventoModel.getAll();
    res.json(eventos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener eventos' });
  }
}

// -------------------- OBTENER UN EVENTO POR ID --------------------
// GET /eventos/:id
// Busca y devuelve un evento según su ID
async function getEvento(req, res) {
  try {
    const { id } = req.params;
    const evento = await EventoModel.getById(id);
    if (!evento) return res.status(404).json({ mensaje: 'Evento no encontrado' });
    res.json(evento);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener evento' });
  }
}

// -------------------- CREAR NUEVO EVENTO --------------------
// POST /eventos
// Crea un nuevo evento
async function addEvento(req, res) {
  try {
    const evento = req.body;
    const nuevoEvento = await EventoModel.add(evento);
    res.status(201).json({ mensaje: 'Evento creado', evento: nuevoEvento });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear evento' });
  }
}

// -------------------- REEMPLAZAR COMPLETAMENTE UN EVENTO --------------------
// PUT /eventos/:id
// Actualiza todos los campos de un evento existente
async function updateEvento(req, res) {
  try {
    const { id } = req.params;
    const evento = req.body;
    const actualizado = await EventoModel.update(id, evento);
    if (!actualizado) return res.status(404).json({ mensaje: 'Evento no encontrado' });
    res.json({ mensaje: 'Evento actualizado', evento: actualizado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar evento' });
  }
}

// -------------------- ACTUALIZAR PARCIALMENTE UN EVENTO --------------------
// PATCH /eventos/:id
// Actualiza solo los campos enviados de un evento
async function patchEvento(req, res) {
  try {
    const { id } = req.params;
    const campos = req.body;
    const actualizado = await EventoModel.patch(id, campos);
    if (!actualizado) return res.status(404).json({ mensaje: 'Evento no encontrado' });
    res.json({ mensaje: 'Evento actualizado parcialmente', evento: actualizado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar evento parcialmente' });
  }
}

// -------------------- ELIMINAR UN EVENTO --------------------
// DELETE /eventos/:id
// Elimina un evento según su ID
async function deleteEvento(req, res) {
  try {
    const { id } = req.params;
    const eliminado = await EventoModel.remove(id);
    if (!eliminado) return res.status(404).json({ mensaje: 'Evento no encontrado' });
    res.json({ mensaje: 'Evento eliminado', evento: eliminado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar evento' });
  }
}

// Exportamos todas las funciones
export default { listEventos, getEvento, addEvento, updateEvento, patchEvento, deleteEvento };


