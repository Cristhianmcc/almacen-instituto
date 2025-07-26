# Thunder Client - Colecciones con 12 Endpoints

Para **máxima compatibilidad** con Thunder Client versión gratuita: **12 endpoints por colección**.

## 📦 Parte 1: Operaciones Esenciales (12 endpoints)
**Archivo:** `thunder-client-15-endpoints.json`
**Incluye:**
- 🏥 Health Check
- 📦 Productos (GET, POST, PUT)
- 🔄 Movimientos (GET, Entrada, Salida)
- 🚨 Alertas (GET, POST)
- 📦 Sobrantes (GET, POST)
- 📉 Bajas (GET, POST)

## 📦 Parte 2: Reportes y Funciones Avanzadas (12 endpoints)
**Archivo:** `thunder-client-12-parte-2.json`
**Incluye:**
- 📊 Dashboard completo
- 📊 Reportes (Inventario, Movimientos, Filtros)
- 📊 Reportes especiales (Stock bajo, Vencidos)
- 🔍 Búsqueda de productos
- 📦 Operaciones adicionales (PUT/DELETE)

## 🚀 Instrucciones de Import

1. **Importa Parte 1:**
   - Thunder Client → Collections → Import
   - Selecciona `thunder-client-15-endpoints.json`
   - ✅ **12 endpoints** (debe importar sin problemas)

2. **Importa Parte 2:**
   - Thunder Client → Collections → Import
   - Selecciona `thunder-client-12-parte-2.json`
   - ✅ **12 endpoints** (debe importar sin problemas)

## ✅ Cobertura
- **24 endpoints principales** cubiertos
- **12 endpoints por colección** (muy por debajo del límite)
- **Funcionalidad crítica** del backend incluida

## 📋 Secuencia de Pruebas

### Parte 1 (Operaciones básicas):
1. 🏥 Health Check
2. 📦 Crear producto
3. 📦 Listar productos
4. 🔄 Crear entrada/salida
5. 🚨 Generar alertas
6. 📦 Crear sobrante
7. 📉 Registrar baja

### Parte 2 (Reportes y avanzado):
1. 📊 Ver dashboard
2. 📊 Reportes de inventario
3. 📊 Filtros por fecha
4. 🔍 Buscar productos
5. 📦 Actualizar registros

Con **12 endpoints máximo** por colección, Thunder Client debería aceptarlas sin problemas.
