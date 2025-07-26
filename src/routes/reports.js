const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// GET /api/reports/dashboard - Obtener dashboard con estadísticas generales
router.get('/dashboard', reportController.getDashboard);

// GET /api/reports/inventory - Generar reporte de inventario
router.get('/inventory', reportController.getInventoryReport);

// GET /api/reports/movements - Generar reporte de movimientos
router.get('/movements', reportController.getMovementsReport);

// GET /api/reports/siga - Generar reporte para SIGA
router.get('/siga', reportController.getSigaReport);

module.exports = router;
