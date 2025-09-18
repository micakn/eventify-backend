const router = express.Router();
const controller = require('../controllers/tareaController');

router.get('/', controller.getTareas);
router.get('/:id', controller.getTarea);
router.post('/', controller.addTarea);
router.put('/:id', controller.putTarea);
router.patch('/:id', controller.patchTarea);
router.delete('/:id', controller.deleteTarea);

module.exports = router;