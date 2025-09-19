const express = require('express');
const router = express.Router();
const clienteWebController = require('../controllers/ClienteWebController');

// Rutas Web para vistas
router.get('/', clienteWebController.listClientesWeb);          // Listar clientes (vista web)
router.get('/nuevo', clienteWebController.showNewForm);        // Formulario nuevo cliente
router.get('/editar/:id', clienteWebController.showEditForm);  // Formulario editar cliente
router.get('/:id', clienteWebController.showCliente);          // Ver detalle cliente

// Rutas para acciones (formularios)
router.post('/', clienteWebController.createClienteWeb);       // Crear cliente (desde form)
router.post('/:id', clienteWebController.updateClienteWeb);    // Actualizar cliente (desde form)
router.post('/:id/eliminar', clienteWebController.deleteClienteWeb); // Eliminar cliente

module.exports = router;
