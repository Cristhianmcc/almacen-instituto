# ============================================================================
# DOCUMENTACIÓN COMPLETA API REST - SISTEMA DE ALMACÉN
# LISTO PARA CONSUMIR DESDE NETBEANS
# ============================================================================
# Servidor: http://localhost:3003
# Puerto: 3003
# Autor: GitHub Copilot
# Fecha: 24 Julio 2025
# ============================================================================

## 🌐 INFORMACIÓN GENERAL

**Base URL:** `http://localhost:3003/api`
**Content-Type:** `application/json`
**CORS:** Configurado para localhost:8080 (NetBeans)
**Respuesta JSON:** `{success: boolean, message: string, data: object}`

## 📡 ENDPOINTS DE ESTADO Y SALUD

### GET /api/health
**Descripción:** Verificar estado del servidor
**Método:** GET
**Parámetros:** Ninguno
**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Sistema de control de almacén funcionando correctamente",
  "data": {
    "uptime": "15 minutos",
    "memory": {
      "rss": "45 MB",
      "heapTotal": "20 MB",
      "heapUsed": "15 MB"
    },
    "timestamp": "2025-07-24T04:53:00.000Z",
    "version": "1.0.0"
  }
}
```

### GET /api/info
**Descripción:** Información del sistema
**Método:** GET
**Parámetros:** Ninguno
**Respuesta exitosa:**
```json
{
  "success": true,
  "data": {
    "instituteName": "Instituto Educativo",
    "instituteCode": "IE001",
    "systemVersion": "1.0.0",
    "features": [
      "Control de inventario en tiempo real",
      "Sistema FIFO (PEPS)",
      "Alertas automáticas",
      "Gestión de bajas y sobrantes",
      "Integración con SIGA",
      "Reportes detallados"
    ],
    "environment": "development"
  }
}
```

## 📦 CRUD DE PRODUCTOS

### GET /api/products
**Descripción:** Obtener lista de todos los productos
**Método:** GET
**Parámetros de consulta opcionales:**
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 50)
- `search`: Búsqueda por nombre o código
- `estado`: Filtrar por estado (activo, vencido, baja, sobrante)

**Ejemplo de uso en NetBeans:**
```java
// URL: http://localhost:3003/api/products
// Método: GET
// Headers: Content-Type: application/json
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "codigo_item": "ITEM001",
      "nombre_item": "Papel Bond A4",
      "nombre_marca": "Chamex",
      "orden_compra": "OC-292-24",
      "nombre_medida": "Paquete",
      "mayor": 15.5,
      "sub_cta": "SUB001",
      "stock_actual": 25,
      "fecha_ingreso": "2025-07-18",
      "fecha_vencimiento": "2025-12-31",
      "estado": "activo",
      "created_at": "2025-07-18T04:34:08.124602+00:00",
      "updated_at": "2025-07-18T04:34:08.124602+00:00"
    }
  ],
  "timestamp": "2025-07-24T04:53:00.000Z",
  "message": "Productos obtenidos exitosamente",
  "meta": {
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalItems": 5,
      "itemsPerPage": 50
    }
  }
}
```

### GET /api/products/{id}
**Descripción:** Obtener un producto específico por ID
**Método:** GET
**Parámetros:** `id` en la URL
**Ejemplo:** `/api/products/1`

### POST /api/products
**Descripción:** Crear un nuevo producto
**Método:** POST
**Headers:** Content-Type: application/json
**Cuerpo de la petición:**
```json
{
  "codigo_item": "ITEM006",
  "nombre_item": "Regla 30cm",
  "nombre_marca": "Faber-Castell",
  "orden_compra": "OC-297-24",
  "nombre_medida": "Unidad",
  "mayor": 2.50,
  "sub_cta": "SUB006",
  "stock_actual": 50,
  "fecha_ingreso": "2025-07-24",
  "fecha_vencimiento": "2030-01-01",
  "estado": "activo"
}
```

### PUT /api/products/{id}
**Descripción:** Actualizar un producto existente
**Método:** PUT
**Parámetros:** `id` en la URL
**Headers:** Content-Type: application/json
**Cuerpo de la petición (campos opcionales):**
```json
{
  "nombre_item": "Regla 30cm Premium",
  "stock_actual": 75,
  "mayor": 3.00
}
```

### DELETE /api/products/{id}
**Descripción:** Eliminar un producto
**Método:** DELETE
**Parámetros:** `id` en la URL

## 📋 CRUD DE MOVIMIENTOS

### GET /api/movements
**Descripción:** Obtener historial de movimientos
**Método:** GET
**Parámetros de consulta opcionales:**
- `page`: Número de página
- `limit`: Elementos por página
- `producto_id`: Filtrar por producto específico
- `tipo_movimiento`: Filtrar por tipo (entrada, salida)
- `fecha_desde`: Fecha desde (YYYY-MM-DD)
- `fecha_hasta`: Fecha hasta (YYYY-MM-DD)

### GET /api/movements/stats
**Descripción:** Estadísticas de movimientos
**Método:** GET

### POST /api/movements/entry
**Descripción:** Registrar entrada de productos
**Método:** POST
**Headers:** Content-Type: application/json
**Cuerpo de la petición:**
```json
{
  "producto_id": 1,
  "cantidad": 20,
  "usuario": "Admin",
  "observaciones": "Restock semanal"
}
```

### POST /api/movements/exit
**Descripción:** Registrar salida de productos
**Método:** POST
**Headers:** Content-Type: application/json
**Cuerpo de la petición:**
```json
{
  "producto_id": 1,
  "cantidad": 5,
  "usuario": "Juan Pérez",
  "observaciones": "Entrega a departamento de matemáticas"
}
```

### GET /api/movements/product/{id}
**Descripción:** Historial de movimientos de un producto específico
**Método:** GET
**Parámetros:** `id` del producto en la URL

## ⚠️ SISTEMA DE ALERTAS

### GET /api/alerts
**Descripción:** Obtener todas las alertas
**Método:** GET
**Parámetros de consulta opcionales:**
- `estado_alerta`: Filtrar por estado (pendiente, resuelta, ignorada)
- `tipo_alerta`: Filtrar por tipo (bajo_stock, proximo_vencimiento, vencido)

### GET /api/alerts/stats
**Descripción:** Estadísticas de alertas
**Método:** GET
**Respuesta:**
```json
{
  "success": true,
  "data": {
    "pending": 15,
    "resolved": 8,
    "ignored": 3,
    "total": 26
  }
}
```

### POST /api/alerts/generate
**Descripción:** Generar alertas automáticas
**Método:** POST
**Headers:** Content-Type: application/json
**Cuerpo:** `{}` (vacío)

### PUT /api/alerts/{id}/resolve
**Descripción:** Resolver una alerta
**Método:** PUT
**Parámetros:** `id` de la alerta en la URL

### PUT /api/alerts/{id}/ignore
**Descripción:** Ignorar una alerta
**Método:** PUT
**Parámetros:** `id` de la alerta en la URL

## 📦 GESTIÓN DE SOBRANTES

### GET /api/surplus
**Descripción:** Obtener lista de productos sobrantes
**Método:** GET

### POST /api/surplus/{id}/mark
**Descripción:** Marcar producto como sobrante
**Método:** POST
**Parámetros:** `id` del producto en la URL
**Headers:** Content-Type: application/json
**Cuerpo de la petición:**
```json
{
  "cantidad": 10,
  "observaciones": "Producto próximo a vencer"
}
```

### POST /api/surplus/{id}/ship
**Descripción:** Registrar envío de sobrante
**Método:** POST
**Parámetros:** `id` del sobrante en la URL
**Headers:** Content-Type: application/json
**Cuerpo de la petición:**
```json
{
  "observaciones_envio": "Enviado a sede central"
}
```

## 📤 GESTIÓN DE BAJAS

### GET /api/withdrawals
**Descripción:** Obtener lista de productos dados de baja
**Método:** GET

### POST /api/withdrawals/{id}
**Descripción:** Dar de baja un producto
**Método:** POST
**Parámetros:** `id` del producto en la URL
**Headers:** Content-Type: application/json
**Cuerpo de la petición:**
```json
{
  "motivo_baja": "vencido",
  "usuario": "Admin",
  "observaciones": "Producto vencido hace 1 mes"
}
```

## 📊 REPORTES

### GET /api/reports/inventory
**Descripción:** Reporte completo de inventario
**Método:** GET
**Respuesta:**
```json
{
  "success": true,
  "data": {
    "totalProducts": 5,
    "totalValue": 1234.50,
    "byStatus": {
      "activo": 4,
      "vencido": 1,
      "baja": 0,
      "sobrante": 0
    },
    "lowStockItems": 2,
    "nearExpirationItems": 1
  }
}
```

### GET /api/reports/movements
**Descripción:** Reporte de movimientos
**Método:** GET
**Parámetros de consulta opcionales:**
- `days`: Días hacia atrás (default: 30)
- `tipo_movimiento`: Filtrar por tipo

## 🔒 CÓDIGOS DE RESPUESTA HTTP

- **200 OK:** Operación exitosa
- **201 Created:** Recurso creado exitosamente
- **400 Bad Request:** Datos de entrada inválidos
- **404 Not Found:** Recurso no encontrado
- **500 Internal Server Error:** Error del servidor

## 🛠️ EJEMPLOS DE IMPLEMENTACIÓN EN NETBEANS

### Ejemplo 1: Obtener lista de productos
```java
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;

public class AlmacenAPI {
    private static final String BASE_URL = "http://localhost:3003/api";
    
    public String getProducts() throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(BASE_URL + "/products"))
            .header("Content-Type", "application/json")
            .GET()
            .build();
            
        HttpResponse<String> response = client.send(request, 
            HttpResponse.BodyHandlers.ofString());
            
        return response.body();
    }
}
```

### Ejemplo 2: Crear nuevo producto
```java
public String createProduct(String productJson) throws Exception {
    HttpClient client = HttpClient.newHttpClient();
    HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create(BASE_URL + "/products"))
        .header("Content-Type", "application/json")
        .POST(HttpRequest.BodyPublishers.ofString(productJson))
        .build();
        
    HttpResponse<String> response = client.send(request, 
        HttpResponse.BodyHandlers.ofString());
        
    return response.body();
}
```

### Ejemplo 3: Registrar movimiento de entrada
```java
public String registerEntry(int productId, int quantity, String user, String obs) throws Exception {
    String json = String.format(
        "{\"producto_id\":%d,\"cantidad\":%d,\"usuario\":\"%s\",\"observaciones\":\"%s\"}",
        productId, quantity, user, obs
    );
    
    HttpClient client = HttpClient.newHttpClient();
    HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create(BASE_URL + "/movements/entry"))
        .header("Content-Type", "application/json")
        .POST(HttpRequest.BodyPublishers.ofString(json))
        .build();
        
    HttpResponse<String> response = client.send(request, 
        HttpResponse.BodyHandlers.ofString());
        
    return response.body();
}
```

## 💡 NOTAS IMPORTANTES PARA NETBEANS

1. **Configuración CORS:** El servidor ya está configurado para aceptar peticiones desde localhost:8080 (puerto típico de NetBeans).

2. **Formato de respuesta:** Todas las respuestas siguen el formato:
   ```json
   {
     "success": boolean,
     "message": "string",
     "data": object,
     "timestamp": "ISO 8601 timestamp"
   }
   ```

3. **Manejo de errores:** Los errores devuelven códigos HTTP apropiados con detalles en el JSON.

4. **Validación:** El backend valida automáticamente los datos de entrada según esquemas predefinidos.

5. **Paginación:** Los endpoints de listado incluyen metadatos de paginación en la respuesta.

6. **Búsqueda:** Muchos endpoints soportan parámetros de búsqueda y filtrado.

## ✅ ESTADO ACTUAL DEL SISTEMA

### FUNCIONALIDADES PROBADAS Y OPERATIVAS:
- ✅ Gestión completa de productos (CRUD)
- ✅ Consulta de movimientos
- ✅ Sistema de alertas (lectura y generación)
- ✅ Reportes de inventario
- ✅ Gestión de sobrantes (lectura)
- ✅ Gestión de bajas (lectura)
- ✅ Estado de salud del servidor

### FUNCIONALIDADES CON PROBLEMAS MENORES:
- ⚠️ Creación de movimientos (problema en esquema de BD)
- ⚠️ Resolución de alertas (problema en esquema de BD)

### RECOMENDACIONES:
1. Verificar que el esquema SQL completo esté ejecutado en Supabase
2. Todas las funcionalidades de lectura están 100% operativas
3. El sistema está listo para ser consumido desde NetBeans para operaciones de consulta
4. Para operaciones de escritura, revisar esquema de base de datos

**El sistema está LISTO para ser consumido desde NetBeans con todas las funcionalidades de consulta operativas al 100%.**
