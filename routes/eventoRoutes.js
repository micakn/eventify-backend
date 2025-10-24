// routes/eventoRoutes.js
import express from 'express';
import eventoController from '../controllers/eventoController.js';

const router = express.Router();

router.get('/', eventoController.listEventos);// LISTAR todos los eventos
router.get('/:id', eventoController.getEvento);// OBTENER un evento por ID
router.post('/', eventoController.addEvento);// CREAR un nuevo evento
router.put('/:id', eventoController.updateEvento);// REEMPLAZAR un evento completo
router.patch('/:id', eventoController.patchEvento);// ACTUALIZAR parcialmente un evento
router.delete('/:id', eventoController.deleteEvento);// ELIMINAR un evento

export default router;

