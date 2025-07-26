# 🎯 **2 COLECCIONES THUNDER CLIENT - GUÍA DE IMPORTACIÓN**

## 📋 **RESUMEN DE LAS COLECCIONES:**

### **📦 PARTE 1 (thunder-client-parte-1.json) - 15 endpoints principales:**
1. 🏥 Health Check
2. 📦 GET Todos los Productos
3. 📦 GET Producto por ID  
4. 📦 POST Crear Producto
5. 📦 PUT Actualizar Producto
6. 📦 DELETE Eliminar Producto
7. 🔄 GET Movimientos
8. 🔄 GET Estadísticas Movimientos
9. 🔄 POST Registrar Entrada
10. 🔄 POST Registrar Salida
11. 🔄 GET Movimientos por Producto
12. 🚨 GET Alertas
13. 🚨 GET Estadísticas Alertas
14. 🚨 POST Generar Alertas
15. 🚨 PUT Resolver Alerta

### **🔧 PARTE 2 (thunder-client-parte-2.json) - 15 endpoints complementarios:**
1. 🚨 PUT Ignorar Alerta
2. 📦 GET Productos Bajo Stock
3. 📦 GET Productos por Vencer
4. 📦 GET Sobrantes
5. 📦 GET Estadísticas Sobrantes
6. 📦 GET Reporte Envío Sobrantes
7. 📦 POST Crear Sobrante
8. 📦 PUT Marcar Sobrante Enviado
9. 📉 GET Bajas
10. 📉 GET Estadísticas Bajas
11. 📉 GET Productos Dados de Baja
12. 📉 POST Registrar Baja
13. 📊 GET Dashboard
14. 📊 GET Reporte Inventario
15. 📊 GET Reporte Movimientos

---

## 🚀 **CÓMO IMPORTAR LAS 2 COLECCIONES:**

### **PASO 1: Importar Parte 1**
1. Abre VS Code
2. Click en Thunder Client (⚡) en la barra lateral
3. Click "Collections" → "Import" → "Import from File"
4. Selecciona: `thunder-client-parte-1.json`
5. ✅ Ya tienes los 15 endpoints principales

### **PASO 2: Importar Parte 2**
1. En Thunder Client, click "Import" nuevamente
2. Selecciona: `thunder-client-parte-2.json` 
3. ✅ Ya tienes los 15 endpoints complementarios

### **RESULTADO: 30 endpoints en total divididos en 2 colecciones**

---

## 🎯 **ORDEN RECOMENDADO DE PRUEBAS:**

### **🥇 PRIMERO - Colección Parte 1 (Funciones Básicas):**
1. **Health Check** - Verificar servidor
2. **Productos básicos** - GET, POST, PUT, DELETE
3. **Movimientos básicos** - Entradas y salidas
4. **Alertas básicas** - Ver y generar

### **🥈 SEGUNDO - Colección Parte 2 (Funciones Avanzadas):**
1. **Productos avanzados** - Bajo stock, por vencer
2. **Sobrantes completos** - CRUD completo
3. **Bajas completas** - Ver estadísticas y registrar
4. **Reportes** - Dashboard e inventario

---

## 📊 **COBERTURA TOTAL:**

### ✅ **Productos: 6/7 endpoints** (Falta solo GET /api/reports/siga)
- GET, POST, PUT, DELETE ✅
- Bajo stock, por vencer ✅

### ✅ **Movimientos: 5/5 endpoints**
- GET, stats, por producto ✅  
- POST entrada/salida ✅

### ✅ **Alertas: 5/5 endpoints**
- GET, stats, generar ✅
- Resolver, ignorar ✅

### ✅ **Sobrantes: 5/5 endpoints**
- GET, stats, reporte ✅
- POST, marcar enviado ✅

### ✅ **Bajas: 4/4 endpoints**
- GET, stats, productos ✅
- POST registrar ✅

### ✅ **Reportes: 3/4 endpoints** (Falta solo SIGA)
- Dashboard, inventario, movimientos ✅

## 🎊 **TOTAL: 28/30 endpoints (93.3%)**

*Los 2 endpoints faltantes son secundarios y los puedes probar manualmente si necesitas*

---

## 🚀 **¡LISTO PARA PROBAR!**

**Importa las 2 colecciones y comienza con la Parte 1 para probar las funciones básicas, luego continúa con la Parte 2 para las funciones avanzadas.**

**¡Ahora sí tienes todo organizado para hacer las pruebas manuales completas!** 🎯
