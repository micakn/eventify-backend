//
import express from 'express';
import clienteController from '../controllers/clienteController.js';

const router = express.Router();

router.get('/', clienteController.listClientes);// LISTAR todos los clientes
router.get('/:id', clienteController.getCliente);// OBTENER un cliente por ID
router.post('/', clienteController.addCliente);// CREAR un nuevo cliente
router.put('/:id', clienteController.updateCliente);// REEMPLAZAR un cliente completo
router.patch('/:id', clienteController.patchCliente);// ACTUALIZAR parcialmente un cliente
router.delete('/:id', clienteController.deleteCliente);// ELIMINAR un cliente

export default router;
