const { validateProduct, validateMovement } = require('../src/middleware/validation');
const { formatDate, isExpired, getDaysUntil } = require('../src/utils/dateUtils');

describe('Validation Middleware', () => {
  describe('Product Validation', () => {
    test('should validate a correct product', () => {
      const validProduct = {
        codigo_item: 'PROD001',
        nombre_item: 'Producto Test',
        nombre_medida: 'Unidad',
        stock_actual: 100
      };

      const { error } = validateProduct(validProduct);
      expect(error).toBeUndefined();
    });

    test('should reject product with empty required fields', () => {
      const invalidProduct = {
        codigo_item: '',
        nombre_item: '',
        nombre_medida: '',
        stock_actual: 'invalid'
      };

      const { error } = validateProduct(invalidProduct);
      expect(error).toBeDefined();
      expect(error.details.length).toBeGreaterThan(0);
    });

    test('should reject product with negative stock', () => {
      const invalidProduct = {
        codigo_item: 'PROD001',
        nombre_item: 'Producto Test',
        nombre_medida: 'Unidad',
        stock_actual: -5
      };

      const { error } = validateProduct(invalidProduct);
      expect(error).toBeDefined();
    });
  });

  describe('Movement Validation', () => {
    test('should validate a correct movement', () => {
      const validMovement = {
        producto_id: 1,
        tipo_movimiento: 'entrada',
        cantidad: 50
      };

      const { error } = validateMovement(validMovement);
      expect(error).toBeUndefined();
    });

    test('should reject movement with invalid type', () => {
      const invalidMovement = {
        producto_id: 1,
        tipo_movimiento: 'invalid',
        cantidad: 50
      };

      const { error } = validateMovement(invalidMovement);
      expect(error).toBeDefined();
    });

    test('should reject movement with negative quantity', () => {
      const invalidMovement = {
        producto_id: 1,
        tipo_movimiento: 'entrada',
        cantidad: -10
      };

      const { error } = validateMovement(invalidMovement);
      expect(error).toBeDefined();
    });
  });
});

describe('Date Utils', () => {
  describe('formatDate', () => {
    test('should format date correctly', () => {
      const date = new Date('2024-01-15');
      const formatted = formatDate(date);
      expect(formatted).toBe('15/01/2024');
    });

    test('should return empty string for null date', () => {
      const formatted = formatDate(null);
      expect(formatted).toBe('');
    });
  });

  describe('isExpired', () => {
    test('should return true for expired date', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const expired = isExpired(yesterday);
      expect(expired).toBe(true);
    });

    test('should return false for future date', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const expired = isExpired(tomorrow);
      expect(expired).toBe(false);
    });

    test('should return false for null date', () => {
      const expired = isExpired(null);
      expect(expired).toBe(false);
    });
  });

  describe('getDaysUntil', () => {
    test('should calculate days until future date', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);
      
      const days = getDaysUntil(futureDate);
      expect(days).toBe(5);
    });

    test('should return negative for past date', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 3);
      
      const days = getDaysUntil(pastDate);
      expect(days).toBe(-3);
    });

    test('should return null for null date', () => {
      const days = getDaysUntil(null);
      expect(days).toBeNull();
    });
  });
});
