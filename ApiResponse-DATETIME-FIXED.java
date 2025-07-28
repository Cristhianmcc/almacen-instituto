package almacen.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@JsonIgnoreProperties(ignoreUnknown = true)  // Ignora campos desconocidos
public class ApiResponse {
    private boolean success;
    private String message;
    private Object data;
    private int total;
    private String error;
    private LocalDateTime timestamp;  // Campo agregado
    
    private static final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(DeserializationFeature.WRITE_DATES_AS_TIMESTAMPS)
            .disable(DeserializationFeature.ADJUST_DATES_TO_CONTEXT_TIME_ZONE);
    
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
    
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    
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
