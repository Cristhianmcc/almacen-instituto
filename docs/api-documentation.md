# Documentación de la API - Sistema de Control de Almacén

## Información General

- **Base URL**: `http://localhost:3000/api`
- **Versión**: v1
- **Formato de respuesta**: JSON
- **Autenticación**: No requerida (por ahora)

## Estructura de Respuestas

### Respuesta Exitosa
```json
{
  "success": true,
  "data": {...},
  "message": "Mensaje descriptivo",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Respuesta de Error
```json
{
  "success": false,
  "error": "Tipo de error",
  "message": "Descripción del error",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Endpoints

### 🏥 Sistema / Salud

#### GET /api/health
Verificar estado del sistema.

**Respuesta:**
```json
{
  "success": true,
  "message": "Sistema funcionando correctamente",
  "data": {
    "uptime": "45 minutos",
    "memory": {...},
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### 📦 Productos

#### GET /api/products
Obtener lista de productos.

**Parámetros de consulta:**
- `page` (int): Página (por defecto: 1)
- `limit` (int): Elementos por página (por defecto: 50)
- `search` (string): Búsqueda por nombre o código
- `estado` (string): Estado del producto ('activo', 'vencido', 'baja', 'sobrante')
- `orderBy` (string): Campo de ordenamiento
- `order` (string): Orden ('asc', 'desc')

#### POST /api/products
Crear nuevo producto.

**Cuerpo de la petición:**
```json
{
  "codigo_item": "PROD001",
  "nombre_item": "Cuaderno Rayado A4",
  "nombre_marca": "Marca A - 292-24",
  "orden_compra": "292-24",
  "nombre_medida": "Unidad",
  "mayor": 2.50,
  "sub_cta": "SUB001",
  "stock_actual": 100,
  "fecha_vencimiento": "2025-12-31"
}
```

#### GET /api/products/:id
Obtener producto por ID.

#### PUT /api/products/:id
Actualizar producto.

#### DELETE /api/products/:id
Dar de baja producto.

#### GET /api/products/low-stock
Obtener productos con stock bajo.

**Parámetros de consulta:**
- `threshold` (int): Umbral de stock bajo (por defecto: 10)

#### GET /api/products/expiring
Obtener productos próximos a vencer.

**Parámetros de consulta:**
- `days` (int): Días de anticipación (por defecto: 30)

### 🔄 Movimientos

#### GET /api/movements
Obtener historial de movimientos.

**Parámetros de consulta:**
- `page`, `limit`: Paginación
- `productId` (int): Filtrar por producto
- `tipo` (string): Tipo de movimiento ('entrada', 'salida')
- `fechaDesde`, `fechaHasta`: Rango de fechas

#### POST /api/movements/entry
Registrar entrada de producto.

**Cuerpo de la petición:**
```json
{
  "producto_id": 1,
  "cantidad": 50,
  "usuario": "Juan Pérez",
  "observaciones": "Ingreso de mercadería"
}
```

#### POST /api/movements/exit
Registrar salida de producto.

**Cuerpo de la petición:**
```json
{
  "producto_id": 1,
  "cantidad": 25,
  "usuario": "María García",
  "observaciones": "Entrega a departamento"
}
```

#### GET /api/movements/stats
Obtener estadísticas de movimientos.

#### GET /api/movements/product/:id
Obtener historial de movimientos de un producto específico.

### 🚨 Alertas

#### GET /api/alerts
Obtener todas las alertas.

**Parámetros de consulta:**
- `page`, `limit`: Paginación
- `tipo` (string): Tipo de alerta ('bajo_stock', 'proximo_vencimiento', 'vencido')
- `estado` (string): Estado de la alerta ('pendiente', 'resuelta', 'ignorada')
- `producto_id` (int): Filtrar por producto

#### GET /api/alerts/stats
Obtener estadísticas de alertas.

#### POST /api/alerts/generate
Generar alertas automáticamente.

#### PUT /api/alerts/:id/resolve
Marcar alerta como resuelta.

#### PUT /api/alerts/:id/ignore
Marcar alerta como ignorada.

### 📉 Bajas

#### GET /api/withdrawals
Obtener lista de bajas.

**Parámetros de consulta:**
- `page`, `limit`: Paginación
- `fechaDesde`, `fechaHasta`: Rango de fechas
- `motivo` (string): Filtrar por motivo

#### POST /api/withdrawals
Registrar nueva baja.

**Cuerpo de la petición:**
```json
{
  "producto_id": 1,
  "motivo_baja": "Producto vencido",
  "usuario": "Admin",
  "observaciones": "Vencimiento detectado en inspección"
}
```

#### GET /api/withdrawals/stats
Obtener estadísticas de bajas.

#### GET /api/withdrawals/products
Obtener productos dados de baja.

### 📊 Sobrantes

#### GET /api/surplus
Obtener lista de sobrantes.

**Parámetros de consulta:**
- `page`, `limit`: Paginación
- `fechaDesde`, `fechaHasta`: Rango de fechas
- `enviado` (boolean): Filtrar por enviados/no enviados

#### POST /api/surplus
Registrar nuevo sobrante.

**Cuerpo de la petición:**
```json
{
  "producto_id": 1,
  "cantidad": 30,
  "observaciones": "Exceso de stock por nueva compra"
}
```

#### PUT /api/surplus/:id/sent
Marcar sobrante como enviado.

#### GET /api/surplus/stats
Obtener estadísticas de sobrantes.

#### GET /api/surplus/report
Generar reporte de sobrantes para envío.

### 📋 Reportes

#### GET /api/reports/dashboard
Obtener dashboard con estadísticas generales.

#### GET /api/reports/inventory
Generar reporte de inventario.

**Parámetros de consulta:**
- `estado` (string): Estado de productos a incluir
- `incluirStock` (boolean): Incluir cantidades de stock

#### GET /api/reports/movements
Generar reporte de movimientos.

**Parámetros de consulta:**
- `fechaDesde`, `fechaHasta`: Rango de fechas
- `tipo` (string): Tipo de movimiento
- `producto_id` (int): Filtrar por producto

#### GET /api/reports/siga
Generar reporte compatible con SIGA.

**Parámetros de consulta:**
- `fechaDesde`, `fechaHasta`: Período del reporte

## Códigos de Estado HTTP

- **200 OK**: Operación exitosa
- **201 Created**: Recurso creado exitosamente
- **400 Bad Request**: Error de validación o petición incorrecta
- **404 Not Found**: Recurso no encontrado
- **409 Conflict**: Conflicto con el estado actual
- **500 Internal Server Error**: Error interno del servidor

## Ejemplos de Uso

### Crear un producto
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "codigo_item": "PROD006",
    "nombre_item": "Marcador Azul",
    "nombre_marca": "Marca F - 297-24",
    "orden_compra": "297-24",
    "nombre_medida": "Unidad",
    "mayor": 1.50,
    "stock_actual": 120,
    "fecha_vencimiento": "2025-10-15"
  }'
```

### Registrar entrada
```bash
curl -X POST http://localhost:3000/api/movements/entry \
  -H "Content-Type: application/json" \
  -d '{
    "producto_id": 1,
    "cantidad": 25,
    "usuario": "Ana Rodríguez",
    "observaciones": "Reposición de stock"
  }'
```

### Obtener dashboard
```bash
curl http://localhost:3000/api/reports/dashboard
```

## Notas Importantes

1. **Lógica FIFO**: Las salidas siguen el principio "Primero en entrar, primero en salir"
2. **Alertas automáticas**: Se generan automáticamente según umbrales configurados
3. **Validación**: Todos los endpoints tienen validación de datos
4. **Auditoria**: Todos los movimientos quedan registrados para trazabilidad
5. **Compatibilidad SIGA**: Los reportes son compatibles con el sistema estatal
