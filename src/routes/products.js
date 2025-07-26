const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { validationMiddleware, productSchema, productUpdateSchema } = require('../middleware/validation');

// GET /api/products - Obtener todos los productos
router.get('/', productController.getAllProducts);

// GET /api/products/low-stock - Obtener productos con bajo stock
router.get('/low-stock', productController.getLowStockProducts);

// GET /api/products/expiring - Obtener productos próximos a vencer
router.get('/expiring', productController.getExpiringProducts);

// GET /api/products/:id - Obtener producto por ID
router.get('/:id', productController.getProductById);

// POST /api/products - Crear nuevo producto
router.post('/', validationMiddleware(productSchema), productController.createProduct);

// PUT /api/products/:id - Actualizar producto
router.put('/:id', validationMiddleware(productUpdateSchema), productController.updateProduct);

// DELETE /api/products/:id - Eliminar producto (cambiar estado a baja)
router.delete('/:id', productController.deleteProduct);

module.exports = router;
