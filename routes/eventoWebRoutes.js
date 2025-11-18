// routes/eventoWebRoutes.js
import express from 'express';
import EventoWebController from '../controllers/EventoWebController.js';

const router = express.Router();

// Las rutas ya tienen el prefijo /eventos desde app.js
router.get('/', EventoWebController.listarEventos);                    // GET /eventos
router.get('/crear', EventoWebController.mostrarFormularioCrear);      // GET /eventos/crear
router.post('/crear', EventoWebController.crearEvento);                // POST /eventos/crear
router.get('/editar/:id', EventoWebController.mostrarFormularioEditar);// GET /eventos/editar/:id
router.post('/editar/:id', EventoWebController.actualizarEvento);      // POST /eventos/editar/:id
router.post('/eliminar/:id', EventoWebController.eliminarEvento);      // POST /eventos/eliminar/:id
// Ruta para ver detalle de un evento
router.get('/ver/:id', EventoWebController.mostrarEvento);            // GET /eventos/ver/:id

export default router;