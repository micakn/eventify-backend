// Importamos el modelo de Eventos
const EventoModel = require('../models/eventoModel');

// -------------------- LISTAR TODOS LOS EVENTOS --------------------
// GET /eventos
const listEventos = (req, res) => {
  const eventos = EventoModel.getAll();
  res.json(eventos);
};

// -------------------- OBTENER UN EVENTO POR ID --------------------
// GET /eventos/:id
const getEvento = (req, res) => {
  const { id } = req.params;
  const evento = EventoModel.getById(id);

  if (!evento) return res.status(404).json({ mensaje: 'Evento no encontrado' });

  res.json(evento);
};

// -------------------- CREAR NUEVO EVENTO --------------------
// POST /eventos
const addEvento = (req, res) => {
  const evento = req.body;
  const nuevoEvento = EventoModel.add(evento);
  res.status(201).json({ mensaje: 'Evento creado', evento: nuevoEvento });
};

// -------------------- REEMPLAZAR COMPLETAMENTE UN EVENTO --------------------
// PUT /eventos/:id
const updateEvento = (req, res) => {
  const { id } = req.params;
  const evento = req.body;

  const actualizado = EventoModel.update(id, evento);
  if (!actualizado) return res.status(404).json({ mensaje: 'Evento no encontrado' });

  res.json({ mensaje: 'Evento actualizado', evento: actualizado });
};

// -------------------- ACTUALIZAR PARCIALMENTE UN EVENTO --------------------
// PATCH /eventos/:id
const patchEvento = (req, res) => {
  const { id } = req.params;
  const campos = req.body;

  const actualizado = EventoModel.patch(id, campos);
  if (!actualizado) return res.status(404).json({ mensaje: 'Evento no encontrado' });

  res.json({ mensaje: 'Evento actualizado parcialmente', evento: actualizado });
};

// -------------------- ELIMINAR UN EVENTO --------------------
// DELETE /eventos/:id
const deleteEvento = (req, res) => {
  const { id } = req.params;
  const eliminado = EventoModel.remove(id);

  if (!eliminado) return res.status(404).json({ mensaje: 'Evento no encontrado' });

  res.json({ mensaje: 'Evento eliminado', evento: eliminado });
};

// Exportamos las funciones
module.exports = {listEventos, getEvento, addEvento, updateEvento ,patchEvento , deleteEvento};
