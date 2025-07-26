# Thunder Client - Colecciones con 14 Endpoints

Para máxima compatibilidad con Thunder Client versión gratuita, las colecciones tienen **14 endpoints cada una**.

## 📦 Parte 1: Operaciones Básicas (14 endpoints)
**Archivo:** `thunder-client-15-endpoints.json`
**Incluye:**
- 🏥 Health Check
- 📦 CRUD Productos (GET, POST, PUT)
- 🔄 Movimientos (GET, Entrada, Salida)
- 🚨 Alertas (GET, POST)
- 📦 Sobrantes (GET, POST)
- 📉 Bajas (GET, POST)
- 📊 Dashboard

## 📦 Parte 2: Operaciones Avanzadas (14 endpoints)
**Archivo:** `thunder-client-14-parte-2.json`
**Incluye:**
- 📊 Reportes completos (Inventario, Movimientos, Filtros)
- 📊 Reportes especiales (Stock bajo, Productos vencidos)
- 🔍 Búsqueda de productos
- 📦 CRUD adicional (PUT/DELETE Sobrantes)
- 📉 CRUD adicional (PUT/DELETE Bajas)
- 🚨 CRUD adicional (PUT/DELETE Alertas)

## 🚀 Instrucciones de Import

1. **Importa Parte 1:**
   - Thunder Client → Collections → Import
   - Selecciona `thunder-client-15-endpoints.json`

2. **Importa Parte 2:**
   - Thunder Client → Collections → Import
   - Selecciona `thunder-client-14-parte-2.json`

## ✅ Cobertura Total
- **28 endpoints** entre ambas colecciones
- **14 endpoints por colección** (compatible con versión gratuita)
- **Funcionalidad completa** del backend cubierta

## 📋 Orden de Pruebas Recomendado

### Primera Fase (Parte 1):
1. Health Check ✅
2. Crear producto de prueba
3. Listar productos
4. Crear movimientos
5. Generar alertas
6. Ver dashboard

### Segunda Fase (Parte 2):
1. Ver reportes detallados
2. Probar filtros de reportes
3. Buscar productos
4. Actualizar/eliminar registros
