// const express = require('express');
// const router = express.Router();
// const movementController = require('../controllers/movementController');
// const { validationMiddleware, movementSchema, entrySchema, exitSchema } = require('../middleware/validation');

// // GET /api/movements - Obtener todos los movimientos
// router.get('/', movementController.getAllMovements);

// // GET /api/movements/stats - Obtener estadísticas de movimientos
// router.get('/stats', movementController.getMovementStats);

// // POST /api/movements/entry - Registrar entrada de producto
// router.post('/entry', validationMiddleware(entrySchema), movementController.registerEntry);

// // POST /api/movements/exit - Registrar salida de producto
// router.post('/exit', validationMiddleware(exitSchema), movementController.registerExit);

// // GET /api/movements/product/:id - Obtener historial de movimientos de un producto
// router.get('/product/:id', movementController.getProductMovements);

// module.exports = router;
const express = require('express');
const router = express.Router();
const MovementController = require('../controllers/movementController'); // Importa la CLASE, no la instancia
const { validationMiddleware, movementSchema, entrySchema, exitSchema } = require('../middleware/validation');

const movementController = new MovementController(); // Crea la instancia

// GET /api/movements - Obtener todos los movimientos
router.get('/', movementController.getAllMovements.bind(movementController));

// GET /api/movements/stats - Obtener estadísticas de movimientos
router.get('/stats', movementController.getMovementStats.bind(movementController));

// POST /api/movements/entry - Registrar entrada de producto
router.post('/entry', validationMiddleware(entrySchema), movementController.registerEntry.bind(movementController));

// POST /api/movements/exit - Registrar salida de producto
router.post('/exit', validationMiddleware(exitSchema), movementController.registerExit.bind(movementController));

// GET /api/movements/product/:id - Obtener historial de movimientos de un producto
router.get('/product/:id', movementController.getProductMovements.bind(movementController));

module.exports = router;