const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/eventoController');

router.get('/', eventoController.listEventos);        // LISTAR todos los eventos
router.get('/:id', eventoController.getEvento);       // OBTENER un evento por ID
router.post('/', eventoController.addEvento);         // CREAR un nuevo evento
router.put('/:id', eventoController.updateEvento);    // REEMPLAZAR un evento completo
router.patch('/:id', eventoController.patchEvento);   // ACTUALIZAR parcialmente un evento
router.delete('/:id', eventoController.deleteEvento);// ELIMINAR un evento

module.exports = router;
