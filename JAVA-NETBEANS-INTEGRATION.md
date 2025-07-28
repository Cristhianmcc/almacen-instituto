# 🔗 INTEGRACIÓN NETBEANS CON BACKEND NODE.JS

## 📋 ESTRUCTURA RECOMENDADA PARA TU PROYECTO JAVA

```
SistemaAlmacen/
├── src/
│   └── almacen/
│       ├── config/
│       │   └── ApiConfig.java          # Configuración de la API
│       ├── models/
│       │   ├── Producto.java           # Modelo Producto
│       │   ├── Movimiento.java         # Modelo Movimiento
│       │   ├── Alerta.java             # Modelo Alerta
│       │   └── ApiResponse.java        # Respuesta estándar
│       ├── services/
│       │   ├── ApiClient.java          # Cliente HTTP base
│       │   ├── ProductoService.java    # Servicio de productos
│       │   ├── MovimientoService.java  # Servicio de movimientos
│       │   └── AlertaService.java      # Servicio de alertas
│       ├── gui/
│       │   ├── MainFrame.java          # Ventana principal
│       │   ├── ProductosPanel.java     # Panel de productos
│       │   └── MovimientosPanel.java   # Panel de movimientos
│       └── SistemaAlmacen.java         # Clase principal
```

## 🎯 PASO 1: CONFIGURACIÓN DE LA API

### Archivo: `config/ApiConfig.java`

```java
package almacen.config;

public class ApiConfig {
    // URL base de tu backend (cambiar cuando subas a Render)
    public static final String BASE_URL = "http://localhost:3003/api";
    
    // Endpoints principales
    public static final String PRODUCTS_ENDPOINT = BASE_URL + "/products";
    public static final String MOVEMENTS_ENDPOINT = BASE_URL + "/movements";
    public static final String ALERTS_ENDPOINT = BASE_URL + "/alerts";
    public static final String REPORTS_ENDPOINT = BASE_URL + "/reports";
    public static final String SURPLUS_ENDPOINT = BASE_URL + "/surplus";
    public static final String WITHDRAWALS_ENDPOINT = BASE_URL + "/withdrawals";
    
    // Headers comunes
    public static final String CONTENT_TYPE = "application/json";
    public static final String ACCEPT = "application/json";
    
    // Timeout en segundos
    public static final int CONNECTION_TIMEOUT = 30;
    public static final int READ_TIMEOUT = 30;
}
```

## 🎯 PASO 2: MODELOS DE DATOS

### Archivo: `models/Producto.java`

```java
package almacen.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class Producto {
    private int id;
    
    @JsonProperty("codigo_item")
    private String codigoItem;
    
    @JsonProperty("nombre_item")
    private String nombreItem;
    
    @JsonProperty("nombre_marca")
    private String nombreMarca;
    
    @JsonProperty("orden_compra")
    private String ordenCompra;
    
    @JsonProperty("nombre_medida")
    private String nombreMedida;
    
    private double mayor;
    
    @JsonProperty("sub_cta")
    private String subCta;
    
    @JsonProperty("stock_actual")
    private int stockActual;
    
    @JsonProperty("fecha_ingreso")
    private LocalDate fechaIngreso;
    
    @JsonProperty("fecha_vencimiento")
    private LocalDate fechaVencimiento;
    
    private String estado;
    
    @JsonProperty("created_at")
    private LocalDateTime createdAt;
    
    @JsonProperty("updated_at")
    private LocalDateTime updatedAt;
    
    // Constructor vacío
    public Producto() {}
    
    // Constructor completo
    public Producto(String codigoItem, String nombreItem, String nombreMarca, 
                   String ordenCompra, String nombreMedida, double mayor, 
                   String subCta, int stockActual, LocalDate fechaIngreso, 
                   LocalDate fechaVencimiento, String estado) {
        this.codigoItem = codigoItem;
        this.nombreItem = nombreItem;
        this.nombreMarca = nombreMarca;
        this.ordenCompra = ordenCompra;
        this.nombreMedida = nombreMedida;
        this.mayor = mayor;
        this.subCta = subCta;
        this.stockActual = stockActual;
        this.fechaIngreso = fechaIngreso;
        this.fechaVencimiento = fechaVencimiento;
        this.estado = estado;
    }
    
    // Getters y Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    
    public String getCodigoItem() { return codigoItem; }
    public void setCodigoItem(String codigoItem) { this.codigoItem = codigoItem; }
    
    public String getNombreItem() { return nombreItem; }
    public void setNombreItem(String nombreItem) { this.nombreItem = nombreItem; }
    
    public String getNombreMarca() { return nombreMarca; }
    public void setNombreMarca(String nombreMarca) { this.nombreMarca = nombreMarca; }
    
    public String getOrdenCompra() { return ordenCompra; }
    public void setOrdenCompra(String ordenCompra) { this.ordenCompra = ordenCompra; }
    
    public String getNombreMedida() { return nombreMedida; }
    public void setNombreMedida(String nombreMedida) { this.nombreMedida = nombreMedida; }
    
    public double getMayor() { return mayor; }
    public void setMayor(double mayor) { this.mayor = mayor; }
    
    public String getSubCta() { return subCta; }
    public void setSubCta(String subCta) { this.subCta = subCta; }
    
    public int getStockActual() { return stockActual; }
    public void setStockActual(int stockActual) { this.stockActual = stockActual; }
    
    public LocalDate getFechaIngreso() { return fechaIngreso; }
    public void setFechaIngreso(LocalDate fechaIngreso) { this.fechaIngreso = fechaIngreso; }
    
    public LocalDate getFechaVencimiento() { return fechaVencimiento; }
    public void setFechaVencimiento(LocalDate fechaVencimiento) { this.fechaVencimiento = fechaVencimiento; }
    
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    @Override
    public String toString() {
        return "Producto{" +
               "id=" + id +
               ", codigoItem='" + codigoItem + '\'' +
               ", nombreItem='" + nombreItem + '\'' +
               ", stockActual=" + stockActual +
               ", estado='" + estado + '\'' +
               '}';
    }
}
```

### Archivo: `models/ApiResponse.java`

```java
package almacen.models;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import java.util.List;
import java.util.ArrayList;

public class ApiResponse {
    private boolean success;
    private String message;
    private Object data;  // Cambiado a Object
    private int total;
    private String error;
    
    private static final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule());
    
    // Constructor vacío
    public ApiResponse() {}
    
    // Getters básicos
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public Object getData() { return data; }
    public void setData(Object data) { this.data = data; }
    
    public int getTotal() { return total; }
    public void setTotal(int total) { this.total = total; }
    
    public String getError() { return error; }
    public void setError(String error) { this.error = error; }
    
    // Método para convertir data a lista de objetos específicos
    @SuppressWarnings("unchecked")
    public <T> List<T> getDataAsList(Class<T> clazz) {
        if (data == null) return new ArrayList<>();
        
        if (data instanceof List) {
            List<Object> list = (List<Object>) data;
            List<T> result = new ArrayList<>();
            
            for (Object item : list) {
                result.add(objectMapper.convertValue(item, clazz));
            }
            return result;
        }
        return new ArrayList<>();
    }
    
    // Método para convertir data a objeto específico
    public <T> T getDataAsObject(Class<T> clazz) {
        if (data == null) return null;
        return objectMapper.convertValue(data, clazz);
    }
}
```

## 🎯 PASO 3: CLIENTE HTTP BASE

### Archivo: `services/ApiClient.java`

```java
package almacen.services;

import almacen.config.ApiConfig;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

public class ApiClient {
    private static final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(ApiConfig.CONNECTION_TIMEOUT))
            .build();
    
    private static final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule());
    
    // GET Request
    public static String get(String url) throws IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", ApiConfig.CONTENT_TYPE)
                .header("Accept", ApiConfig.ACCEPT)
                .timeout(Duration.ofSeconds(ApiConfig.READ_TIMEOUT))
                .GET()
                .build();
        
        HttpResponse<String> response = httpClient.send(request, 
                HttpResponse.BodyHandlers.ofString());
        
        if (response.statusCode() >= 200 && response.statusCode() < 300) {
            return response.body();
        } else {
            throw new RuntimeException("HTTP Error: " + response.statusCode() + 
                                     " - " + response.body());
        }
    }
    
    // POST Request
    public static String post(String url, Object data) throws IOException, InterruptedException {
        String jsonData = objectMapper.writeValueAsString(data);
        
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", ApiConfig.CONTENT_TYPE)
                .header("Accept", ApiConfig.ACCEPT)
                .timeout(Duration.ofSeconds(ApiConfig.READ_TIMEOUT))
                .POST(HttpRequest.BodyPublishers.ofString(jsonData))
                .build();
        
        HttpResponse<String> response = httpClient.send(request, 
                HttpResponse.BodyHandlers.ofString());
        
        if (response.statusCode() >= 200 && response.statusCode() < 300) {
            return response.body();
        } else {
            throw new RuntimeException("HTTP Error: " + response.statusCode() + 
                                     " - " + response.body());
        }
    }
    
    // PUT Request
    public static String put(String url, Object data) throws IOException, InterruptedException {
        String jsonData = objectMapper.writeValueAsString(data);
        
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", ApiConfig.CONTENT_TYPE)
                .header("Accept", ApiConfig.ACCEPT)
                .timeout(Duration.ofSeconds(ApiConfig.READ_TIMEOUT))
                .PUT(HttpRequest.BodyPublishers.ofString(jsonData))
                .build();
        
        HttpResponse<String> response = httpClient.send(request, 
                HttpResponse.BodyHandlers.ofString());
        
        if (response.statusCode() >= 200 && response.statusCode() < 300) {
            return response.body();
        } else {
            throw new RuntimeException("HTTP Error: " + response.statusCode() + 
                                     " - " + response.body());
        }
    }
    
    // DELETE Request
    public static String delete(String url) throws IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", ApiConfig.CONTENT_TYPE)
                .header("Accept", ApiConfig.ACCEPT)
                .timeout(Duration.ofSeconds(ApiConfig.READ_TIMEOUT))
                .DELETE()
                .build();
        
        HttpResponse<String> response = httpClient.send(request, 
                HttpResponse.BodyHandlers.ofString());
        
        if (response.statusCode() >= 200 && response.statusCode() < 300) {
            return response.body();
        } else {
            throw new RuntimeException("HTTP Error: " + response.statusCode() + 
                                     " - " + response.body());
        }
    }
    
    // Convertir JSON a Object
    public static <T> T fromJson(String json, Class<T> clazz) throws IOException {
        return objectMapper.readValue(json, clazz);
    }
    
    // Convertir Object a JSON
    public static String toJson(Object obj) throws IOException {
        return objectMapper.writeValueAsString(obj);
    }
}
```

## 🎯 PASO 4: SERVICIO DE PRODUCTOS

### Archivo: `services/ProductoService.java`

```java
package almacen.services;

import almacen.config.ApiConfig;
import almacen.models.Producto;
import almacen.models.ApiResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import java.io.IOException;
import java.util.List;

public class ProductoService {
    private static final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule());
    
    // Obtener todos los productos
    public static List<Producto> getAllProducts() throws IOException, InterruptedException {
        String response = ApiClient.get(ApiConfig.PRODUCTS_ENDPOINT);
        
        ApiResponse apiResponse = objectMapper.readValue(response, ApiResponse.class);
        
        return apiResponse.getDataAsList(Producto.class);
    }
    
    // Obtener producto por ID
    public static Producto getProductById(int id) throws IOException, InterruptedException {
        String url = ApiConfig.PRODUCTS_ENDPOINT + "/" + id;
        String response = ApiClient.get(url);
        
        ApiResponse apiResponse = objectMapper.readValue(response, ApiResponse.class);
        
        return apiResponse.getDataAsObject(Producto.class);
    }
    
    // Crear nuevo producto
    public static Producto createProduct(Producto producto) throws IOException, InterruptedException {
        String response = ApiClient.post(ApiConfig.PRODUCTS_ENDPOINT, producto);
        
        ApiResponse apiResponse = objectMapper.readValue(response, ApiResponse.class);
        
        return apiResponse.getDataAsObject(Producto.class);
    }
    
    // Actualizar producto
    public static Producto updateProduct(int id, Producto producto) throws IOException, InterruptedException {
        String url = ApiConfig.PRODUCTS_ENDPOINT + "/" + id;
        String response = ApiClient.put(url, producto);
        
        ApiResponse apiResponse = objectMapper.readValue(response, ApiResponse.class);
        
        return apiResponse.getDataAsObject(Producto.class);
    }
    
    // Eliminar producto
    public static boolean deleteProduct(int id) throws IOException, InterruptedException {
        String url = ApiConfig.PRODUCTS_ENDPOINT + "/" + id;
        String response = ApiClient.delete(url);
        
        ApiResponse apiResponse = objectMapper.readValue(response, ApiResponse.class);
        
        return apiResponse.isSuccess();
    }
    
    // Obtener productos con stock bajo
    public static List<Producto> getLowStockProducts() throws IOException, InterruptedException {
        String url = ApiConfig.PRODUCTS_ENDPOINT + "/low-stock";
        String response = ApiClient.get(url);
        
        ApiResponse apiResponse = objectMapper.readValue(response, ApiResponse.class);
        
        return apiResponse.getDataAsList(Producto.class);
    }
    
    // Obtener productos próximos a vencer
    public static List<Producto> getExpiringProducts() throws IOException, InterruptedException {
        String url = ApiConfig.PRODUCTS_ENDPOINT + "/expiring";
        String response = ApiClient.get(url);
        
        ApiResponse apiResponse = objectMapper.readValue(response, ApiResponse.class);
        
        return apiResponse.getDataAsList(Producto.class);
    }
}
```

## 🎯 PASO 5: EJEMPLO DE USO

### Archivo: `SistemaAlmacen.java` (main class)

```java
package almacen;

import almacen.models.Producto;
import almacen.services.ProductoService;
import java.time.LocalDate;
import java.util.List;

public class SistemaAlmacen {

    public static void main(String[] args) {
        System.out.println("🚀 Iniciando Sistema de Almacén...");
        
        try {
            // Test 1: Obtener todos los productos
            System.out.println("\n📦 Obteniendo todos los productos:");
            List<Producto> productos = ProductoService.getAllProducts();
            
            if (productos != null && !productos.isEmpty()) {
                System.out.println("✅ Se encontraron " + productos.size() + " productos:");
                
                for (Producto p : productos) {
                    System.out.println("  - " + p.getCodigoItem() + ": " + 
                                     p.getNombreItem() + " (Stock: " + 
                                     p.getStockActual() + ")");
                }
            } else {
                System.out.println("❌ No se encontraron productos");
            }
            
            // Test 2: Crear un nuevo producto
            System.out.println("\n➕ Creando nuevo producto de prueba:");
            Producto nuevoProducto = new Producto(
                "TEST001", 
                "Producto de Prueba Java", 
                "Marca Test", 
                "ORD-001", 
                "Unidad", 
                15.50, 
                "SUB-TEST", 
                100, 
                LocalDate.now(), 
                LocalDate.now().plusMonths(6), 
                "activo"
            );
            
            Producto creado = ProductoService.createProduct(nuevoProducto);
            System.out.println("✅ Producto creado: " + creado.toString());
            
            // Test 3: Obtener productos con stock bajo
            System.out.println("\n⚠️ Productos con stock bajo:");
            List<Producto> stockBajo = ProductoService.getLowStockProducts();
            
            if (stockBajo != null && !stockBajo.isEmpty()) {
                for (Producto p : stockBajo) {
                    System.out.println("  - " + p.getNombreItem() + 
                                     " (Stock: " + p.getStockActual() + ")");
                }
            } else {
                System.out.println("✅ No hay productos con stock bajo");
            }
            
        } catch (Exception e) {
            System.err.println("❌ Error conectando con el backend:");
            System.err.println("   " + e.getMessage());
            System.err.println("\n🔧 Verifica que:");
            System.err.println("   - El backend esté corriendo en http://localhost:3003");
            System.err.println("   - No haya problemas de firewall");
            System.err.println("   - La base de datos esté conectada");
        }
    }
}
```

## 🎯 PRÓXIMOS PASOS:

1. **Copia estos archivos** a tu proyecto NetBeans
2. **Asegúrate** de que tu backend esté corriendo (`npm run dev`)
3. **Ejecuta** la clase principal para probar la conexión
4. **Si funciona**, podemos continuar con la interfaz gráfica

## ⚠️ NOTAS IMPORTANTES:

- **Java 11+** requerido para HttpClient
- **Jackson** para manejo de JSON
- **Cambiar URL** cuando subas a Render
- **Manejo de errores** incluido

¿Quieres que continuemos con la interfaz gráfica o necesitas ayuda con algún paso específico?
