// controllers/eventoController.js
// -------------------- CONTROLADOR DE EVENTOS --------------------
import EventoModel from '../models/EventoModel.js';

// -------------------- LISTAR TODOS LOS EVENTOS --------------------
// GET /eventos
async function listEventos(req, res) {
  try {
    const eventos = await EventoModel.getAll();
    res.json(eventos);
  } catch (error) {
    console.error('Error al listar eventos:', error);
    res.status(500).json({ mensaje: 'Error al obtener eventos' });
  }
}

// -------------------- OBTENER EVENTO POR ID --------------------
// GET /eventos/:id
async function getEvento(req, res) {
  try {
    const evento = await EventoModel.getById(req.params.id);
    if (!evento) return res.status(404).json({ mensaje: 'Evento no encontrado' });
    res.json(evento);
  } catch (error) {
    console.error('Error al obtener evento:', error);
    res.status(500).json({ mensaje: 'Error al obtener evento' });
  }
}

// -------------------- CREAR NUEVO EVENTO --------------------
// POST /eventos
async function addEvento(req, res) {
  try {
    const evento = req.body;
    if (!evento.nombre) {
      return res.status(400).json({ mensaje: 'El nombre del evento es obligatorio' });
    }

    const nuevoEvento = await EventoModel.add(evento);
    res.status(201).json({ mensaje: 'Evento creado', evento: nuevoEvento });
  } catch (error) {
    console.error('Error al crear evento:', error);
    res.status(500).json({ mensaje: 'Error al crear evento' });
  }
}

// -------------------- ACTUALIZAR COMPLETAMENTE EVENTO --------------------
// PUT /eventos/:id
async function updateEvento(req, res) {
  try {
    const actualizado = await EventoModel.update(req.params.id, req.body);
    if (!actualizado) return res.status(404).json({ mensaje: 'Evento no encontrado' });
    res.json({ mensaje: 'Evento actualizado', evento: actualizado });
  } catch (error) {
    console.error('Error al actualizar evento:', error);
    res.status(500).json({ mensaje: 'Error al actualizar evento' });
  }
}

// -------------------- ACTUALIZAR PARCIALMENTE EVENTO --------------------
// PATCH /eventos/:id
async function patchEvento(req, res) {
  try {
    const actualizado = await EventoModel.patch(req.params.id, req.body);
    if (!actualizado) return res.status(404).json({ mensaje: 'Evento no encontrado' });
    res.json({ mensaje: 'Evento actualizado parcialmente', evento: actualizado });
  } catch (error) {
    console.error('Error al actualizar parcialmente evento:', error);
    res.status(500).json({ mensaje: 'Error al actualizar parcialmente evento' });
  }
}

// -------------------- ELIMINAR EVENTO --------------------
// DELETE /eventos/:id
async function deleteEvento(req, res) {
  try {
    const eliminado = await EventoModel.remove(req.params.id);
    if (!eliminado) return res.status(404).json({ mensaje: 'Evento no encontrado' });
    res.json({ mensaje: 'Evento eliminado', evento: eliminado });
  } catch (error) {
    console.error('Error al eliminar evento:', error);
    res.status(500).json({ mensaje: 'Error al eliminar evento' });
  }
}

export default { listEventos, getEvento, addEvento, updateEvento, patchEvento, deleteEvento };



