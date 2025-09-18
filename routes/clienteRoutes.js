const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/ClienteController');

router.get('/', clienteController.list);// LISTAR todos los clientes
router.get('/:id', clienteController.getOne);// OBTENER un cliente por ID
router.post('/', clienteController.create);// CREAR un nuevo cliente
router.put('/:id', clienteController.update);// REEMPLAZAR un cliente completo
router.patch('/:id', clienteController.patch);// ACTUALIZAR parcialmente un cliente
router.delete('/:id', clienteController.remove);// ELIMINAR un cliente

module.exports = router;