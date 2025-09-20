import express from 'express';
import tareaController from '../controllers/tareaController.js';

const router = express.Router();

router.get('/', tareaController.listTareas);// LISTAR todas las tareas
router.get('/:id', tareaController.getTarea);// OBTENER tarea por ID
router.post('/', tareaController.addTarea);// CREAR nueva tarea
router.put('/:id', tareaController.updateTarea);// REEMPLAZAR tarea completa
router.patch('/:id', tareaController.patchTarea);// ACTUALIZAR parcial de tarea
router.delete('/:id', tareaController.deleteTarea);// ELIMINAR tarea
router.get('/filtro', tareaController.filterTareas);// FILTRAR tareas

export default router;


