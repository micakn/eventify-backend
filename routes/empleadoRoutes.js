const express = require('express');
const router = express.Router();
const controller = require('../controllers/empleadoController');

router.get('/', controller.getEmpleados);
router.get('/:id', controller.getEmpleado);
router.post('/', controller.addEmpleado);
router.put('/:id', controller.putEmpleado);
router.patch('/:id', controller.patchEmpleado);
router.delete('/:id', controller.deleteEmpleado);

module.exports = router;
