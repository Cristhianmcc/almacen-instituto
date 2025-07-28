package almacen.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
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
    @JsonFormat(pattern = "yyyy-MM-dd")
    @JsonDeserialize(using = LocalDateDeserializer.class)
    private LocalDate fechaIngreso;
    
    @JsonProperty("fecha_vencimiento")
    @JsonFormat(pattern = "yyyy-MM-dd")
    @JsonDeserialize(using = LocalDateDeserializer.class)
    private LocalDate fechaVencimiento;
    
    private String estado;
    
    @JsonProperty("created_at")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX")
    private String createdAtString;  // Cambiar a String temporalmente
    
    @JsonProperty("updated_at")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX")
    private String updatedAtString;  // Cambiar a String temporalmente
    
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
    
    public String getCreatedAtString() { return createdAtString; }
    public void setCreatedAtString(String createdAtString) { this.createdAtString = createdAtString; }
    
    public String getUpdatedAtString() { return updatedAtString; }
    public void setUpdatedAtString(String updatedAtString) { this.updatedAtString = updatedAtString; }
    
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
