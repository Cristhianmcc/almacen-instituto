const express = require('express');
const router = express.Router();
const surplusController = require('../controllers/surplusController');
const { validationMiddleware, surplusSchema } = require('../middleware/validation');

// GET /api/surplus - Obtener todos los sobrantes
router.get('/', surplusController.getAllSurplus);

// GET /api/surplus/stats - Obtener estadísticas de sobrantes
router.get('/stats', surplusController.getSurplusStats);

// GET /api/surplus/report - Generar reporte de sobrantes para envío
router.get('/report', surplusController.generateShipmentReport);

// POST /api/surplus - Registrar nuevo sobrante
router.post('/', validationMiddleware(surplusSchema), surplusController.createSurplus);

// PUT /api/surplus/:id/sent - Marcar sobrante como enviado
router.put('/:id/sent', surplusController.markAsSent);

module.exports = router;
