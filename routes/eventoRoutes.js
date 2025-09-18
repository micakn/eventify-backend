const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/EventoController');

router.get('/', eventoController.list);// LISTAR todos los eventos
router.get('/:id', eventoController.getOne);// OBTENER un evento por ID
router.post('/', eventoController.create);// CREAR un nuevo evento
router.put('/:id', eventoController.update);// REEMPLAZAR un evento completo
router.patch('/:id', eventoController.patch);// ACTUALIZAR parcialmente un evento
router.delete('/:id', eventoController.remove);// ELIMINAR un evento

module.exports = router;