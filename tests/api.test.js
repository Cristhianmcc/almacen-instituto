const request = require('supertest');
const app = require('../src/app');

describe('API Health Check', () => {
  test('GET /api/health should return 200', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('data');
  });

  test('GET /api/info should return system information', async () => {
    const response = await request(app)
      .get('/api/info')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toHaveProperty('instituteName');
    expect(response.body.data).toHaveProperty('features');
  });
});

describe('Products API', () => {
  test('GET /api/products should return products list', async () => {
    const response = await request(app)
      .get('/api/products')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test('POST /api/products should create a new product', async () => {
    const newProduct = {
      codigo_item: 'TEST001',
      nombre_item: 'Producto de Prueba',
      nombre_marca: 'Marca Test',
      nombre_medida: 'Unidad',
      stock_actual: 10
    };

    const response = await request(app)
      .post('/api/products')
      .send(newProduct)
      .expect('Content-Type', /json/)
      .expect(201);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toHaveProperty('codigo_item', 'TEST001');
  });

  test('POST /api/products with invalid data should return 400', async () => {
    const invalidProduct = {
      codigo_item: '',
      nombre_item: '',
      stock_actual: -1
    };

    const response = await request(app)
      .post('/api/products')
      .send(invalidProduct)
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('error');
  });
});

describe('Movements API', () => {
  test('GET /api/movements should return movements list', async () => {
    const response = await request(app)
      .get('/api/movements')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test('GET /api/movements/stats should return movement statistics', async () => {
    const response = await request(app)
      .get('/api/movements/stats')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toHaveProperty('hoy');
    expect(response.body.data).toHaveProperty('mes');
  });
});

describe('Alerts API', () => {
  test('GET /api/alerts should return alerts list', async () => {
    const response = await request(app)
      .get('/api/alerts')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test('GET /api/alerts/stats should return alert statistics', async () => {
    const response = await request(app)
      .get('/api/alerts/stats')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toHaveProperty('pendientes');
  });
});

describe('Reports API', () => {
  test('GET /api/reports/dashboard should return dashboard data', async () => {
    const response = await request(app)
      .get('/api/reports/dashboard')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toHaveProperty('productos');
    expect(response.body.data).toHaveProperty('movimientos');
    expect(response.body.data).toHaveProperty('alertas');
  });
});

describe('Error Handling', () => {
  test('GET /api/nonexistent should return 404', async () => {
    const response = await request(app)
      .get('/api/nonexistent')
      .expect('Content-Type', /json/)
      .expect(404);

    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('error', 'Ruta no encontrada');
  });
});
