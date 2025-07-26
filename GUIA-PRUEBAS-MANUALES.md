# 🧪 GUÍA COMPLETA PARA PRUEBAS MANUALES DEL API

## 🎯 **OPCIÓN 1: Thunder Client (RECOMENDADO) - Ya instalado**

### **Cómo importar la colección:**
1. Abre VS Code
2. Ve a la barra lateral izquierda → ícono de Thunder Client (⚡)
3. Click en "Collections" 
4. Click en "Import" → "Import from File"
5. Selecciona el archivo: `thunder-client-collection.json` 
6. ¡Ya tienes todos los 30 endpoints organizados por carpetas!

### **Orden recomendado de pruebas:**
1. **🏥 Health Check** - Verificar que el servidor funciona
2. **📦 PRODUCTOS** - Probar todos los endpoints (7 pruebas)
3. **🔄 MOVIMIENTOS** - Entradas y salidas (5 pruebas)  
4. **🚨 ALERTAS** - Generar y gestionar alertas (5 pruebas)
5. **📦 SOBRANTES** - Crear y marcar sobrantes (5 pruebas)
6. **📉 BAJAS** - Registrar bajas (4 pruebas)
7. **📊 REPORTES** - Ver todos los reportes (4 pruebas)

---

## 🎯 **OPCIÓN 2: Postman (Alternativa)**

### **Instalación:**
- Descarga: https://www.postman.com/downloads/
- O usa la versión web: https://web.postman.com/

### **Importar colección en Postman:**
1. Abre Postman
2. Click "Import" → "Upload Files"
3. Selecciona `thunder-client-collection.json`
4. La colección se importará automáticamente

---

## 🎯 **OPCIÓN 3: cURL (Línea de comandos)**

Si prefieres línea de comandos, aquí tienes algunos ejemplos:

```bash
# Health Check
curl http://localhost:3003/api/health

# GET Productos
curl http://localhost:3003/api/products

# POST Crear Producto
curl -X POST http://localhost:3003/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "codigo_item": "CURL001",
    "nombre_item": "Producto desde cURL",
    "nombre_marca": "TestBrand",
    "nombre_medida": "Unidad",
    "mayor": 15.50,
    "sub_cta": "CURL",
    "stock_actual": 50
  }'

# POST Registrar Entrada
curl -X POST http://localhost:3003/api/movements/entry \
  -H "Content-Type: application/json" \
  -d '{
    "producto_id": 2,
    "cantidad": 10,
    "usuario": "Usuario cURL",
    "observaciones": "Entrada desde cURL"
  }'

# POST Registrar Baja
curl -X POST http://localhost:3003/api/withdrawals \
  -H "Content-Type: application/json" \
  -d '{
    "producto_id": 3,
    "cantidad_baja": 2,
    "motivo_baja": "Producto dañado",
    "usuario": "Usuario cURL"
  }'
```

---

## 📋 **LISTA DE VERIFICACIÓN MANUAL**

### ✅ **PRODUCTOS (7 endpoints)**
- [ ] GET /api/products - Lista productos
- [ ] GET /api/products/:id - Producto específico
- [ ] GET /api/products/low-stock - Bajo stock
- [ ] GET /api/products/expiring - Por vencer
- [ ] POST /api/products - Crear producto
- [ ] PUT /api/products/:id - Actualizar producto
- [ ] DELETE /api/products/:id - Eliminar producto

### ✅ **MOVIMIENTOS (5 endpoints)**
- [ ] GET /api/movements - Lista movimientos
- [ ] GET /api/movements/stats - Estadísticas
- [ ] GET /api/movements/product/:id - Por producto
- [ ] POST /api/movements/entry - Registrar entrada
- [ ] POST /api/movements/exit - Registrar salida

### ✅ **ALERTAS (5 endpoints)**
- [ ] GET /api/alerts - Lista alertas
- [ ] GET /api/alerts/stats - Estadísticas
- [ ] POST /api/alerts/generate - Generar alertas
- [ ] PUT /api/alerts/:id/resolve - Resolver alerta
- [ ] PUT /api/alerts/:id/ignore - Ignorar alerta

### ✅ **SOBRANTES (5 endpoints)**
- [ ] GET /api/surplus - Lista sobrantes
- [ ] GET /api/surplus/stats - Estadísticas
- [ ] GET /api/surplus/report - Reporte envío
- [ ] POST /api/surplus - Crear sobrante
- [ ] PUT /api/surplus/:id/sent - Marcar enviado

### ✅ **BAJAS (4 endpoints)**
- [ ] GET /api/withdrawals - Lista bajas
- [ ] GET /api/withdrawals/stats - Estadísticas
- [ ] GET /api/withdrawals/products - Productos dados de baja
- [ ] POST /api/withdrawals - Registrar baja

### ✅ **REPORTES (4 endpoints)**
- [ ] GET /api/reports/dashboard - Dashboard
- [ ] GET /api/reports/inventory - Inventario
- [ ] GET /api/reports/movements - Movimientos
- [ ] GET /api/reports/siga - SIGA

---

## 🔍 **QUÉ VERIFICAR EN CADA PRUEBA:**

### ✅ **Respuestas exitosas (200/201):**
- Status code correcto
- Campo `"success": true`
- Datos en campo `"data"`
- Timestamp presente
- Mensaje descriptivo

### ❌ **Respuestas de error (400/404/500):**
- Status code correcto
- Campo `"success": false`
- Mensaje de error claro
- Detalles del error si aplica

### 📊 **Datos específicos a verificar:**
- **Productos**: Todos los campos obligatorios presentes
- **Movimientos**: Stock anterior/posterior calculado correctamente
- **Alertas**: Estados y tipos válidos
- **Sobrantes**: Destino por defecto "DEPARTAMENTAL_LIMA"
- **Bajas**: Reducción de stock automática
- **Reportes**: Datos agregados consistentes

---

## 🚀 **MI RECOMENDACIÓN:**

**Usa Thunder Client** porque:
- ✅ Ya está instalado en tu VS Code
- ✅ Colección ya creada y organizada
- ✅ Interfaz visual amigable
- ✅ Guarda automáticamente las respuestas
- ✅ No necesitas cambiar de aplicación

**¡Empieza probando y me cuentas qué tal te va!** 🎯
