const express = require('express');
const router = express.Router();
const controller = require('../controllers/clienteController');

router.get('/', controller.getClientes);
router.get('/:id', controller.getCliente);
router.post('/', controller.addCliente);
router.put('/:id', controller.putCliente);
router.patch('/:id', controller.patchCliente);
router.delete('/:id', controller.deleteCliente);

module.exports = router;