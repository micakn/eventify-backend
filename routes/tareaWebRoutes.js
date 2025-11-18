// routes/tareaWebRoutes.js
import express from 'express';
import TareaWebController from '../controllers/TareaWebController.js';

const router = express.Router();

// Rutas para tareas
router.get('/', TareaWebController.listarTareas);
router.get('/crear', TareaWebController.mostrarFormularioCrear);
router.post('/crear', TareaWebController.crearTarea);
router.get('/editar/:id', TareaWebController.mostrarFormularioEditar);
router.post('/editar/:id', TareaWebController.actualizarTarea);
router.post('/eliminar/:id', TareaWebController.eliminarTarea);
// Ruta para ver detalle de tarea
router.get('/:id', TareaWebController.mostrarTarea);

export default router;