# 🔧 SOLUCIÓN AL PROBLEMA DE DESERIALIZACIÓN

## ❌ PROBLEMA IDENTIFICADO:
El backend responde correctamente, pero Jackson está deserializando los objetos como `LinkedHashMap` en lugar de `Producto`.

## ✅ SOLUCIÓN:

### 1. Modificar `ApiResponse.java`:

```java
package almacen.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import java.util.List;
import java.util.ArrayList;

public class ApiResponse {
    private boolean success;
    private String message;
    private Object data;  // Cambiamos a Object
    private int total;
    private String error;
    
    private static final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule());
    
    // Constructor vacío
    public ApiResponse() {}
    
    // Getters y Setters
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
    
    // Método para convertir data a objeto específico
    @SuppressWarnings("unchecked")
    public <T> T getDataAsObject(Class<T> clazz) {
        if (data == null) return null;
        return objectMapper.convertValue(data, clazz);
    }
    
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
}
```

### 2. Modificar `ProductoService.java`:

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

## 🎯 PASOS PARA APLICAR LA CORRECCIÓN:

1. **Reemplaza** el contenido de `ApiResponse.java` con el código de arriba
2. **Reemplaza** el contenido de `ProductoService.java` con el código de arriba
3. **Compila y ejecuta** nuevamente

## 🔍 EXPLICACIÓN DEL PROBLEMA:

- Tu backend responde con formato: `{"success": true, "data": [productos...]}`
- Jackson deserializa `data` como `LinkedHashMap` porque no sabe el tipo específico
- La solución usa `ObjectMapper.convertValue()` para convertir correctamente

## ✅ CON ESTA CORRECCIÓN:

- Los productos se deserializarán correctamente como objetos `Producto`
- Mantenemos la flexibilidad para diferentes tipos de respuesta
- El código es más robusto y maneja errores mejor

¿Quieres que te ayude a aplicar estos cambios en tu proyecto NetBeans?
