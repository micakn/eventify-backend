const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');

router.get('/', tareaController.list);// LISTAR todas las tareas 
router.get('/:id', tareaController.getOne);// OBTENER tarea por ID
router.post('/', tareaController.create);// CREAR nueva tarea
router.put('/:id', tareaController.put);// REMPLAZAR tarea completa
router.patch('/:id', tareaController.patch);// ACTUALIZAR parcial de tarea
router.delete('/:id', tareaController.remove);// ELIMINAR tarea

module.exports = router;
