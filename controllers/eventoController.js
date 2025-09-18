// Importamos el modelo de Eventos
const EventoModel = require('../models/eventoModel');

// -------------------- LISTAR TODOS LOS EVENTOS --------------------
// GET /eventos
const listEventos = async (req, res) => {
  try {
    const eventos = await EventoModel.getAll();
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener eventos' });
  }
};

// -------------------- OBTENER UN EVENTO POR ID --------------------
// GET /eventos/:id
const getEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const evento = await EventoModel.getById(id);

    if (!evento) return res.status(404).json({ mensaje: 'Evento no encontrado' });

    res.json(evento);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener evento' });
  }
};

// -------------------- CREAR NUEVO EVENTO --------------------
// POST /eventos
const addEvento = async (req, res) => {
  try {
    const evento = req.body;
    const nuevoEvento = await EventoModel.add(evento);
    res.status(201).json({ mensaje: 'Evento creado', evento: nuevoEvento });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear evento' });
  }
};

// -------------------- REEMPLAZAR COMPLETAMENTE UN EVENTO --------------------
// PUT /eventos/:id
const updateEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const evento = req.body;

    const actualizado = await EventoModel.update(id, evento);
    if (!actualizado) return res.status(404).json({ mensaje: 'Evento no encontrado' });

    res.json({ mensaje: 'Evento actualizado', evento: actualizado });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar evento' });
  }
};

// -------------------- ACTUALIZAR PARCIALMENTE UN EVENTO --------------------
// PATCH /eventos/:id
const patchEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const campos = req.body;

    const actualizado = await EventoModel.patch(id, campos);
    if (!actualizado) return res.status(404).json({ mensaje: 'Evento no encontrado' });

    res.json({ mensaje: 'Evento actualizado parcialmente', evento: actualizado });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar evento parcialmente' });
  }
};

// -------------------- ELIMINAR UN EVENTO --------------------
// DELETE /eventos/:id
const deleteEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await EventoModel.remove(id);

    if (!eliminado) return res.status(404).json({ mensaje: 'Evento no encontrado' });

    res.json({ mensaje: 'Evento eliminado', evento: eliminado });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar evento' });
  }
};

// Exportamos las funciones
module.exports = { listEventos, getEvento, addEvento, updateEvento, patchEvento, deleteEvento };

