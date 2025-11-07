import express from 'express';
import EventoWebController from '../controllers/EventoWebController.js';

const router = express.Router();

// Rutas para eventos
router.get('/eventos', EventoWebController.listarEventos);
router.get('/eventos/crear', EventoWebController.mostrarFormularioCrear);
router.post('/eventos/crear', EventoWebController.crearEvento);
router.get('/eventos/editar/:id', EventoWebController.mostrarFormularioEditar);
router.post('/eventos/editar/:id', EventoWebController.actualizarEvento);
router.post('/eventos/eliminar/:id', EventoWebController.eliminarEvento);

export default router;
