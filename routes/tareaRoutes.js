const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');

router.get('/', tareaController.listTareas);         // LISTAR todas las tareas
router.get('/:id', tareaController.getTarea);        // OBTENER tarea por ID
router.post('/', tareaController.addTarea);         // CREAR nueva tarea
router.put('/:id', tareaController.updateTarea);    // REMPLAZAR tarea completa
router.patch('/:id', tareaController.patchTarea);   // ACTUALIZAR parcial de tarea
router.delete('/:id', tareaController.deleteTarea); // ELIMINAR tarea
router.get('/filtro', tareaController.filterTareas);// FILTRAR tareas

module.exports = router;

