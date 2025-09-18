const express = require('express');
const router = express.Router();
const empleadoController = require('../controllers/EmpleadoController');

router.get('/', empleadoController.list);// LISTAR todos los empleados (para asignar tareas)
router.get('/:id', empleadoController.getOne);// OBTENER empleado por ID
router.post('/', empleadoController.create);// CREAR un nuevo empleado
router.put('/:id', empleadoController.update);// REEMPLAZAR un empleado completo
router.patch('/:id', empleadoController.patch);// ACTUALIZAR parcialmente un empleado
router.delete('/:id', empleadoController.remove);// ELIMINAR un empleado

module.exports = router;

