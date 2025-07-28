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
    
    // Buscar productos por nombre
    public static List<Producto> searchProductsByName(String nombre) throws IOException, InterruptedException {
        String url = ApiConfig.PRODUCTS_ENDPOINT + "/search?nombre=" + nombre;
        String response = ApiClient.get(url);
        
        ApiResponse apiResponse = objectMapper.readValue(response, ApiResponse.class);
        
        return apiResponse.getDataAsList(Producto.class);
    }
    
    // Obtener productos por código de item
    public static Producto getProductByCode(String codigo) throws IOException, InterruptedException {
        String url = ApiConfig.PRODUCTS_ENDPOINT + "/code/" + codigo;
        String response = ApiClient.get(url);
        
        ApiResponse apiResponse = objectMapper.readValue(response, ApiResponse.class);
        
        return apiResponse.getDataAsObject(Producto.class);
    }
    
    // Actualizar solo el stock de un producto
    public static Producto updateProductStock(int id, int nuevoStock) throws IOException, InterruptedException {
        String url = ApiConfig.PRODUCTS_ENDPOINT + "/" + id + "/stock";
        
        // Crear objeto con solo el stock
        String jsonData = "{\"stock_actual\": " + nuevoStock + "}";
        
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", ApiConfig.CONTENT_TYPE)
                .header("Accept", ApiConfig.ACCEPT)
                .timeout(Duration.ofSeconds(ApiConfig.READ_TIMEOUT))
                .method("PATCH", HttpRequest.BodyPublishers.ofString(jsonData))
                .build();
        
        HttpResponse<String> httpResponse = HttpClient.newHttpClient()
                .send(request, HttpResponse.BodyHandlers.ofString());
        
        if (httpResponse.statusCode() >= 200 && httpResponse.statusCode() < 300) {
            ApiResponse apiResponse = objectMapper.readValue(httpResponse.body(), ApiResponse.class);
            return apiResponse.getDataAsObject(Producto.class);
        } else {
            throw new RuntimeException("HTTP Error: " + httpResponse.statusCode() + 
                                     " - " + httpResponse.body());
        }
    }
}
