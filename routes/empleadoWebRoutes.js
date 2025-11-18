// routes/empleadoWebRoutes.js
import express from 'express';
import EmpleadoWebController from '../controllers/EmpleadoWebController.js';

const router = express.Router();

// Rutas para empleados
router.get('/', EmpleadoWebController.listarEmpleados);
router.get('/crear', EmpleadoWebController.mostrarFormularioCrear);
router.post('/crear', EmpleadoWebController.crearEmpleado);
router.get('/editar/:id', EmpleadoWebController.mostrarFormularioEditar);
router.post('/editar/:id', EmpleadoWebController.actualizarEmpleado);
router.post('/eliminar/:id', EmpleadoWebController.eliminarEmpleado);

export default router;