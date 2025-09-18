const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/ClienteController');

router.get('/', clienteController.listClientes);       // LISTAR todos los clientes
router.get('/:id', clienteController.getCliente);      // OBTENER un cliente por ID
router.post('/', clienteController.addCliente);        // CREAR un nuevo cliente
router.put('/:id', clienteController.updateCliente);   // REEMPLAZAR un cliente completo
router.patch('/:id', clienteController.patchCliente);  // ACTUALIZAR parcialmente un cliente
router.delete('/:id', clienteController.deleteCliente);// ELIMINAR un cliente

module.exports = router;
