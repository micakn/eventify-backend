import express from 'express';
import empleadoController from '../controllers/empleadoController.js';

const router = express.Router();

router.get('/', empleadoController.listEmpleados);// LISTAR todos los empleados
router.get('/:id', empleadoController.getEmpleado);// OBTENER empleado por ID
router.post('/', empleadoController.addEmpleado);// CREAR un nuevo empleado
router.put('/:id', empleadoController.updateEmpleado);// REEMPLAZAR un empleado completo
router.patch('/:id', empleadoController.patchEmpleado);// ACTUALIZAR parcialmente un empleado
router.delete('/:id', empleadoController.deleteEmpleado);// ELIMINAR un empleado

export default router;



