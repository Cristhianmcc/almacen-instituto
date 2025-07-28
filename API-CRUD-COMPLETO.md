# 🔗 API REST - MÉTODOS HTTP PARA SISTEMA DE ALMACÉN

## 📋 TABLA DE PRODUCTOS

### 🟢 GET - OBTENER PRODUCTOS

#### 📌 Obtener todos los productos
```java
List<Producto> productos = ProductoService.getAllProducts();
```
**HTTP:** `GET /api/products`

#### 📌 Obtener producto por ID
```java
Producto producto = ProductoService.getProductById(16);
```
**HTTP:** `GET /api/products/16`

#### 📌 Obtener productos con stock bajo
```java
List<Producto> stockBajo = ProductoService.getLowStockProducts();
```
**HTTP:** `GET /api/products/low-stock`

#### 📌 Obtener productos próximos a vencer
```java
List<Producto> proximosVencer = ProductoService.getExpiringProducts();
```
**HTTP:** `GET /api/products/expiring`

### 🔵 POST - CREAR PRODUCTO

```java
// Crear nuevo producto
Producto nuevoProducto = new Producto();
nuevoProducto.setCodigoItem("JAVA008");
nuevoProducto.setNombreItem("Producto Nuevo");
nuevoProducto.setNombreMarca("Marca Test");
nuevoProducto.setOrdenCompra("ORD-008");
nuevoProducto.setNombreMedida("Unidad");
nuevoProducto.setMayor(25.50);
nuevoProducto.setSubCta("TEST-SUB");
nuevoProducto.setStockActual(100);
nuevoProducto.setFechaVencimiento(LocalDate.now().plusMonths(6));
nuevoProducto.setEstado("activo");

Producto creado = ProductoService.createProduct(nuevoProducto);
```
**HTTP:** `POST /api/products`

### 🟡 PUT - ACTUALIZAR PRODUCTO

```java
// Actualizar producto existente
Producto productoActualizar = ProductoService.getProductById(16);
productoActualizar.setNombreItem("Producto Actualizado");
productoActualizar.setStockActual(75);
productoActualizar.setMayor(30.00);

Producto actualizado = ProductoService.updateProduct(16, productoActualizar);
```
**HTTP:** `PUT /api/products/16`

### 🔴 DELETE - ELIMINAR PRODUCTO

```java
// Eliminar producto
boolean eliminado = ProductoService.deleteProduct(16);

if (eliminado) {
    System.out.println("✅ Producto eliminado exitosamente");
} else {
    System.out.println("❌ Error al eliminar producto");
}
```
**HTTP:** `DELETE /api/products/16`

---

## 📋 TABLA DE MOVIMIENTOS

### 🟢 GET - OBTENER MOVIMIENTOS

#### 📌 Obtener todos los movimientos
```java
List<Movimiento> movimientos = MovimientoService.getAllMovements();
```
**HTTP:** `GET /api/movements`

#### 📌 Obtener movimiento por ID
```java
Movimiento movimiento = MovimientoService.getMovementById(5);
```
**HTTP:** `GET /api/movements/5`

#### 📌 Obtener movimientos por producto
```java
List<Movimiento> movimientosProducto = MovimientoService.getMovementsByProduct(16);
```
**HTTP:** `GET /api/movements/product/16`

#### 📌 Obtener movimientos por fecha
```java
List<Movimiento> movimientosFecha = MovimientoService.getMovementsByDate("2025-07-26");
```
**HTTP:** `GET /api/movements/date/2025-07-26`

### 🔵 POST - CREAR MOVIMIENTO

```java
// Crear nuevo movimiento
Movimiento nuevoMovimiento = new Movimiento();
nuevoMovimiento.setProductoId(16);
nuevoMovimiento.setTipoMovimiento("entrada");
nuevoMovimiento.setCantidad(50);
nuevoMovimiento.setMotivo("Compra nueva");
nuevoMovimiento.setUsuario("admin");

Movimiento creado = MovimientoService.createMovement(nuevoMovimiento);
```
**HTTP:** `POST /api/movements`

### 🟡 PUT - ACTUALIZAR MOVIMIENTO

```java
// Actualizar movimiento
Movimiento movimientoActualizar = MovimientoService.getMovementById(5);
movimientoActualizar.setMotivo("Motivo actualizado");

Movimiento actualizado = MovimientoService.updateMovement(5, movimientoActualizar);
```
**HTTP:** `PUT /api/movements/5`

### 🔴 DELETE - ELIMINAR MOVIMIENTO

```java
// Eliminar movimiento
boolean eliminado = MovimientoService.deleteMovement(5);
```
**HTTP:** `DELETE /api/movements/5`

---

## 📋 TABLA DE ALERTAS

### 🟢 GET - OBTENER ALERTAS

#### 📌 Obtener todas las alertas
```java
List<Alerta> alertas = AlertaService.getAllAlerts();
```
**HTTP:** `GET /api/alerts`

#### 📌 Obtener alerta por ID
```java
Alerta alerta = AlertaService.getAlertById(3);
```
**HTTP:** `GET /api/alerts/3`

#### 📌 Obtener alertas activas
```java
List<Alerta> alertasActivas = AlertaService.getActiveAlerts();
```
**HTTP:** `GET /api/alerts/active`

#### 📌 Obtener alertas por tipo
```java
List<Alerta> alertasStock = AlertaService.getAlertsByType("stock_bajo");
```
**HTTP:** `GET /api/alerts/type/stock_bajo`

### 🔵 POST - CREAR ALERTA

```java
// Crear nueva alerta
Alerta nuevaAlerta = new Alerta();
nuevaAlerta.setProductoId(16);
nuevaAlerta.setTipoAlerta("stock_bajo");
nuevaAlerta.setMensaje("Stock crítico detectado");
nuevaAlerta.setNivel("alta");

Alerta creada = AlertaService.createAlert(nuevaAlerta);
```
**HTTP:** `POST /api/alerts`

### 🟡 PUT - ACTUALIZAR ALERTA

```java
// Actualizar alerta
Alerta alertaActualizar = AlertaService.getAlertById(3);
alertaActualizar.setEstado("resuelta");

Alerta actualizada = AlertaService.updateAlert(3, alertaActualizar);
```
**HTTP:** `PUT /api/alerts/3`

### 🔴 DELETE - ELIMINAR ALERTA

```java
// Eliminar alerta
boolean eliminada = AlertaService.deleteAlert(3);
```
**HTTP:** `DELETE /api/alerts/3`

---

## 📋 TABLA DE REPORTES

### 🟢 GET - OBTENER REPORTES

#### 📌 Obtener todos los reportes
```java
List<Reporte> reportes = ReporteService.getAllReports();
```
**HTTP:** `GET /api/reports`

#### 📌 Obtener reporte por ID
```java
Reporte reporte = ReporteService.getReportById(7);
```
**HTTP:** `GET /api/reports/7`

#### 📌 Obtener reportes por tipo
```java
List<Reporte> reportesInventario = ReporteService.getReportsByType("inventario");
```
**HTTP:** `GET /api/reports/type/inventario`

#### 📌 Obtener reportes por fecha
```java
List<Reporte> reportesFecha = ReporteService.getReportsByDate("2025-07-26");
```
**HTTP:** `GET /api/reports/date/2025-07-26`

### 🔵 POST - GENERAR REPORTE

```java
// Generar nuevo reporte
Reporte nuevoReporte = new Reporte();
nuevoReporte.setTipoReporte("inventario");
nuevoReporte.setFechaInicio(LocalDate.now().minusMonths(1));
nuevoReporte.setFechaFin(LocalDate.now());
nuevoReporte.setFormato("PDF");
nuevoReporte.setUsuario("admin");

Reporte generado = ReporteService.generateReport(nuevoReporte);
```
**HTTP:** `POST /api/reports`

### 🟡 PUT - ACTUALIZAR REPORTE

```java
// Actualizar reporte
Reporte reporteActualizar = ReporteService.getReportById(7);
reporteActualizar.setDescripcion("Descripción actualizada");

Reporte actualizado = ReporteService.updateReport(7, reporteActualizar);
```
**HTTP:** `PUT /api/reports/7`

### 🔴 DELETE - ELIMINAR REPORTE

```java
// Eliminar reporte
boolean eliminado = ReporteService.deleteReport(7);
```
**HTTP:** `DELETE /api/reports/7`

---

## 📋 TABLA DE EXCEDENTES (SURPLUS)

### 🟢 GET - OBTENER EXCEDENTES

#### 📌 Obtener todos los excedentes
```java
List<Excedente> excedentes = ExcedenteService.getAllSurplus();
```
**HTTP:** `GET /api/surplus`

#### 📌 Obtener excedente por ID
```java
Excedente excedente = ExcedenteService.getSurplusById(4);
```
**HTTP:** `GET /api/surplus/4`

#### 📌 Obtener excedentes por producto
```java
List<Excedente> excedentesProducto = ExcedenteService.getSurplusByProduct(16);
```
**HTTP:** `GET /api/surplus/product/16`

### 🔵 POST - CREAR EXCEDENTE

```java
// Registrar nuevo excedente
Excedente nuevoExcedente = new Excedente();
nuevoExcedente.setProductoId(16);
nuevoExcedente.setCantidadExcedente(25);
nuevoExcedente.setMotivo("Sobrestock por compra masiva");
nuevoExcedente.setAccionTomada("Redistribuir");

Excedente creado = ExcedenteService.createSurplus(nuevoExcedente);
```
**HTTP:** `POST /api/surplus`

### 🟡 PUT - ACTUALIZAR EXCEDENTE

```java
// Actualizar excedente
Excedente excedenteActualizar = ExcedenteService.getSurplusById(4);
excedenteActualizar.setAccionTomada("Donado");

Excedente actualizado = ExcedenteService.updateSurplus(4, excedenteActualizar);
```
**HTTP:** `PUT /api/surplus/4`

### 🔴 DELETE - ELIMINAR EXCEDENTE

```java
// Eliminar registro de excedente
boolean eliminado = ExcedenteService.deleteSurplus(4);
```
**HTTP:** `DELETE /api/surplus/4`

---

## 📋 TABLA DE RETIROS (WITHDRAWALS)

### 🟢 GET - OBTENER RETIROS

#### 📌 Obtener todos los retiros
```java
List<Retiro> retiros = RetiroService.getAllWithdrawals();
```
**HTTP:** `GET /api/withdrawals`

#### 📌 Obtener retiro por ID
```java
Retiro retiro = RetiroService.getWithdrawalById(8);
```
**HTTP:** `GET /api/withdrawals/8`

#### 📌 Obtener retiros por producto
```java
List<Retiro> retirosProducto = RetiroService.getWithdrawalsByProduct(16);
```
**HTTP:** `GET /api/withdrawals/product/16`

#### 📌 Obtener retiros por usuario
```java
List<Retiro> retirosUsuario = RetiroService.getWithdrawalsByUser("admin");
```
**HTTP:** `GET /api/withdrawals/user/admin`

### 🔵 POST - CREAR RETIRO

```java
// Registrar nuevo retiro
Retiro nuevoRetiro = new Retiro();
nuevoRetiro.setProductoId(16);
nuevoRetiro.setCantidadRetirada(10);
nuevoRetiro.setMotivo("Uso en laboratorio");
nuevoRetiro.setUsuario("profesor1");
nuevoRetiro.setDestino("Lab. Química");

Retiro creado = RetiroService.createWithdrawal(nuevoRetiro);
```
**HTTP:** `POST /api/withdrawals`

### 🟡 PUT - ACTUALIZAR RETIRO

```java
// Actualizar retiro
Retiro retiroActualizar = RetiroService.getWithdrawalById(8);
retiroActualizar.setObservaciones("Retiro completado exitosamente");

Retiro actualizado = RetiroService.updateWithdrawal(8, retiroActualizar);
```
**HTTP:** `PUT /api/withdrawals/8`

### 🔴 DELETE - ELIMINAR RETIRO

```java
// Eliminar registro de retiro
boolean eliminado = RetiroService.deleteWithdrawal(8);
```
**HTTP:** `DELETE /api/withdrawals/8`

---

## 🎯 EJEMPLO DE USO COMPLETO

```java
package almacen;

import almacen.models.*;
import almacen.services.*;
import java.time.LocalDate;
import java.util.List;

public class SistemaAlmacenCompleto {

    public static void main(String[] args) {
        System.out.println("🚀 Sistema de Almacén - CRUD Completo");
        
        try {
            // === PRODUCTOS ===
            System.out.println("\n📦 PRODUCTOS:");
            
            // CREATE
            Producto producto = new Producto();
            producto.setCodigoItem("TEST001");
            producto.setNombreItem("Producto Test");
            producto.setStockActual(100);
            Producto productoCreado = ProductoService.createProduct(producto);
            
            // READ
            List<Producto> productos = ProductoService.getAllProducts();
            System.out.println("Productos: " + productos.size());
            
            // UPDATE
            productoCreado.setStockActual(150);
            Producto productoActualizado = ProductoService.updateProduct(
                productoCreado.getId(), productoCreado);
            
            // DELETE
            boolean eliminado = ProductoService.deleteProduct(productoCreado.getId());
            
            // === MOVIMIENTOS ===
            System.out.println("\n📋 MOVIMIENTOS:");
            
            Movimiento movimiento = new Movimiento();
            movimiento.setProductoId(1);
            movimiento.setTipoMovimiento("entrada");
            movimiento.setCantidad(50);
            
            Movimiento movimientoCreado = MovimientoService.createMovement(movimiento);
            List<Movimiento> movimientos = MovimientoService.getAllMovements();
            
            // === ALERTAS ===
            System.out.println("\n🚨 ALERTAS:");
            
            List<Alerta> alertasActivas = AlertaService.getActiveAlerts();
            System.out.println("Alertas activas: " + alertasActivas.size());
            
            // === REPORTES ===
            System.out.println("\n📊 REPORTES:");
            
            Reporte reporte = new Reporte();
            reporte.setTipoReporte("inventario");
            reporte.setFechaInicio(LocalDate.now().minusMonths(1));
            reporte.setFechaFin(LocalDate.now());
            
            Reporte reporteGenerado = ReporteService.generateReport(reporte);
            
            System.out.println("✅ Todas las operaciones completadas exitosamente!");
            
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
```

---

## 📝 NOTAS IMPORTANTES

1. **Códigos únicos:** Siempre usar códigos diferentes para productos
2. **Fechas:** Usar formato `LocalDate` para fechas (`2025-07-26`)
3. **Estados:** Respetar los estados válidos (`activo`, `inactivo`, etc.)
4. **IDs:** Los IDs se generan automáticamente en CREATE
5. **Validaciones:** El backend valida todos los campos requeridos

## 🔧 CONFIGURACIÓN NECESARIA

- ✅ Jackson dependencies en pom.xml
- ✅ Java 11+ para HttpClient
- ✅ Backend Node.js corriendo en localhost:3003
- ✅ Base de datos PostgreSQL conectada

**¡Tu sistema está listo para manejar todas las operaciones CRUD en todas las tablas!** 🎉
