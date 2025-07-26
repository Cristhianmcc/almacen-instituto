const express = require('express');
const router = express.Router();
const alertService = require('../services/alertService');
const { successResponse, errorResponse, notFoundResponse } = require('../utils/responseUtils');

// GET /api/alerts - Obtener todas las alertas
router.get('/', async (req, res) => {
  try {
    const result = await alertService.getAllAlerts(req.query);
    res.json(successResponse(result.data, 'Alertas obtenidas exitosamente', {
      pagination: result.pagination
    }));
  } catch (error) {
    console.error('Error al obtener alertas:', error);
    res.status(500).json(errorResponse('Error al obtener alertas', error.message));
  }
});

// GET /api/alerts/stats - Obtener estadísticas de alertas
router.get('/stats', async (req, res) => {
  try {
    const stats = await alertService.getAlertStats();
    res.json(successResponse(stats, 'Estadísticas de alertas obtenidas exitosamente'));
  } catch (error) {
    console.error('Error al obtener estadísticas de alertas:', error);
    res.status(500).json(errorResponse('Error al obtener estadísticas de alertas', error.message));
  }
});

// POST /api/alerts/generate - Generar alertas automáticamente
router.post('/generate', async (req, res) => {
  try {
    const result = await alertService.generateAutomaticAlerts();
    res.json(successResponse(result, 'Alertas generadas exitosamente'));
  } catch (error) {
    console.error('Error al generar alertas:', error);
    res.status(500).json(errorResponse('Error al generar alertas', error.message));
  }
});

// PUT /api/alerts/:id/resolve - Marcar alerta como resuelta
router.put('/:id/resolve', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await alertService.resolveAlert(id);
    
    if (!result) {
      return res.status(404).json(notFoundResponse('Alerta', id));
    }
    
    res.json(successResponse(result, 'Alerta marcada como resuelta'));
  } catch (error) {
    console.error('Error al resolver alerta:', error);
    res.status(500).json(errorResponse('Error al resolver alerta', error.message));
  }
});

// PUT /api/alerts/:id/ignore - Marcar alerta como ignorada
router.put('/:id/ignore', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await alertService.ignoreAlert(id);
    
    if (!result) {
      return res.status(404).json(notFoundResponse('Alerta', id));
    }
    
    res.json(successResponse(result, 'Alerta marcada como ignorada'));
  } catch (error) {
    console.error('Error al ignorar alerta:', error);
    res.status(500).json(errorResponse('Error al ignorar alerta', error.message));
  }
});

module.exports = router;
