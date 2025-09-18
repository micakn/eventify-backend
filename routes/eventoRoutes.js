const express = require('express');
const router = express.Router();
const controller = require('../controllers/eventoController');

router.get('/', controller.getEventos);
router.get('/:id', controller.getEvento);
router.post('/', controller.addEvento);
router.put('/:id', controller.putEvento);
router.patch('/:id', controller.patchEvento);
router.delete('/:id', controller.deleteEvento);

module.exports = router;