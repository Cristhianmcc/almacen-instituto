# 🚀 URLs para Testing Manual - Almacén Instituto

## 📋 Lista Completa de Endpoints (30 total)

### 🏥 Health Check
```
GET http://localhost:3003/api/health
```

### 📦 Productos (6 endpoints)
```
GET    http://localhost:3003/api/products
GET    http://localhost:3003/api/products/2
POST   http://localhost:3003/api/products
PUT    http://localhost:3003/api/products/2
DELETE http://localhost:3003/api/products/999
GET    http://localhost:3003/api/products/search?q=producto
```

### 🔄 Movimientos (4 endpoints)
```
GET  http://localhost:3003/api/movements
GET  http://localhost:3003/api/movements/product/2
POST http://localhost:3003/api/movements/entry
POST http://localhost:3003/api/movements/exit
```

### 🚨 Alertas (4 endpoints)
```
GET    http://localhost:3003/api/alerts
POST   http://localhost:3003/api/alerts/generate
PUT    http://localhost:3003/api/alerts/1
DELETE http://localhost:3003/api/alerts/1
```

### 📦 Sobrantes (4 endpoints)
```
GET    http://localhost:3003/api/surplus
POST   http://localhost:3003/api/surplus
PUT    http://localhost:3003/api/surplus/1
DELETE http://localhost:3003/api/surplus/1
```

### 📉 Bajas (4 endpoints)
```
GET    http://localhost:3003/api/withdrawals
POST   http://localhost:3003/api/withdrawals
PUT    http://localhost:3003/api/withdrawals/1
DELETE http://localhost:3003/api/withdrawals/1
```

### 📊 Reportes (7 endpoints)
```
GET http://localhost:3003/api/reports/dashboard
GET http://localhost:3003/api/reports/inventory
GET http://localhost:3003/api/reports/movements
GET http://localhost:3003/api/reports/movements/date?fecha_inicio=2025-01-01&fecha_fin=2025-12-31
GET http://localhost:3003/api/reports/movements/type?tipo=entrada
GET http://localhost:3003/api/reports/low-stock
GET http://localhost:3003/api/reports/expired
```

### 🔧 Endpoints Adicionales (2 endpoints)
```
DELETE http://localhost:3003/api/surplus/1
DELETE http://localhost:3003/api/alerts/1
```

---

## 📝 JSON Bodies para POST/PUT

### POST Crear Producto:
```json
{
  "codigo_item": "MANUAL001",
  "nombre_item": "Producto Manual",
  "nombre_marca": "Test",
  "nombre_medida": "Unidad",
  "mayor": 25.50,
  "sub_cta": "MAN",
  "stock_actual": 100,
  "fecha_vencimiento": "2026-12-31"
}
```

### PUT Actualizar Producto:
```json
{
  "nombre_item": "Producto Actualizado",
  "mayor": 35.00
}
```

### POST Entrada:
```json
{
  "producto_id": 2,
  "cantidad": 15,
  "usuario": "Usuario Manual",
  "observaciones": "Entrada manual"
}
```

### POST Salida:
```json
{
  "producto_id": 2,
  "cantidad": 5,
  "usuario": "Usuario Manual",
  "observaciones": "Salida manual"
}
```

### POST Crear Sobrante:
```json
{
  "producto_id": 3,
  "cantidad": 8,
  "observaciones": "Sobrante manual"
}
```

### POST Registrar Baja:
```json
{
  "producto_id": 4,
  "cantidad_baja": 3,
  "motivo_baja": "Producto dañado",
  "usuario": "Usuario Manual",
  "observaciones": "Baja manual"
}
```

### PUT Actualizar Alerta:
```json
{
  "estado": "resuelto"
}
```

---

## 🎯 Orden de Pruebas Recomendado

1. **Health Check** ✅
2. **Crear Producto** → guarda el ID que devuelve
3. **Listar Productos** → verifica que aparece
4. **Crear Entrada** → usa el ID del producto
5. **Crear Salida** → usa el ID del producto
6. **Generar Alertas** → genera alertas automáticas
7. **Ver Dashboard** → resumen del sistema
8. **Ver Inventario** → estado actual
9. **Crear Sobrante** → registra sobrante
10. **Registrar Baja** → registra baja con cantidad_baja

¡Copia y pega estas URLs directamente en Thunder Client, Postman, o cualquier cliente REST!
