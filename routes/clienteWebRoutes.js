// routes/clienteWebRoutes.js
import express from 'express';
import {
  listClientesWeb,
  showCliente,
  showNewForm,
  createClienteWeb,
  showEditForm,
  updateClienteWeb,
  deleteClienteWeb
} from '../controllers/ClienteWebController.js';

const router = express.Router();

// ----------- Vistas SSR -----------
router.get('/', listClientesWeb);           // Listado
router.get('/nuevo', showNewForm);       // Formulario nuevo
router.post('/', createClienteWeb);         // Crear
router.get('/editar/:id', showEditForm); // Formulario editar
router.get('/:id', showCliente);             // Detalle
router.put('/:id', updateClienteWeb);       // Actualizar
router.delete('/:id', deleteClienteWeb);    // Eliminar

export default router;
