const express = require('express');
const router = express.Router();
const withdrawalController = require('../controllers/withdrawalController');
const { validationMiddleware, withdrawalSchema } = require('../middleware/validation');

// GET /api/withdrawals - Obtener todas las bajas
router.get('/', withdrawalController.getAllWithdrawals);

// GET /api/withdrawals/stats - Obtener estadísticas de bajas
router.get('/stats', withdrawalController.getWithdrawalStats);

// GET /api/withdrawals/products - Obtener productos dados de baja
router.get('/products', withdrawalController.getWithdrawnProducts);


// POST /api/withdrawals - Registrar nueva baja
router.post('/', validationMiddleware(withdrawalSchema), withdrawalController.createWithdrawal);

// PATCH /api/withdrawals/:id - Editar una baja existente
router.patch('/:id', withdrawalController.updateWithdrawal);

module.exports = router;
