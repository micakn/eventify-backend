const express = require('express');
const router = express.Router();
const TareaModel = require('../models/TareaModel');
const EmpleadoModel = require('../models/EmpleadoModel');
const ClienteModel = require('../models/ClienteModel');
const EventoModel = require('../models/EventoModel');

router.get('/', (req, res) => {
  res.render('index', { title: 'Eventify - Backend' });
});

router.get('/tareas', async (req, res) => {
  const tareas = await TareaModel.getAll();
  res.render('tareas', { tareas });
});

router.get('/empleados', async (req, res) => {
  const empleados = await EmpleadoModel.getAll();
  res.render('empleados', { empleados });
});

router.get('/clientes', async (req, res) => {
  const clientes = await ClienteModel.getAll();
  res.render('clientes', { clientes });
});

router.get('/eventos', async (req, res) => {
  const eventos = await EventoModel.getAll();
  res.render('eventos', { eventos });
});

module.exports = router;