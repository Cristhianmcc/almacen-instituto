// ============================================
// PARCHE: Stock Mínimo Fijo en 50
// ============================================
// Este archivo contiene las funciones modificadas
// para usar un umbral fijo de 50 unidades
// en lugar de buscar el campo stock_minimo
// ============================================

// CONSTANTE: Umbral de stock bajo
const UMBRAL_STOCK_BAJO = 50;

// ==========================================
// REEMPLAZAR EN alertasService.js línea ~135
// ==========================================
async obtenerProductosStockBajo() {
  try {
    console.log(`🔍 Buscando productos con stock_actual < ${UMBRAL_STOCK_BAJO}`);
    
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .lt('stock_actual', UMBRAL_STOCK_BAJO);

    if (error) throw error;
    
    console.log(`📦 Productos encontrados con stock bajo: ${data?.length || 0}`);
    
    return data || [];
  } catch (error) {
    console.error('❌ Error al obtener productos con stock bajo:', error);
    return [];
  }
}

// ==========================================
// REEMPLAZAR EN alertasService.js línea ~148
// ==========================================
async obtenerProductoStockBajoPorId(productoId) {
  try {
    console.log(`🔍 Verificando producto ${productoId} con umbral ${UMBRAL_STOCK_BAJO}`);
    
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('id', productoId)
      .lt('stock_actual', UMBRAL_STOCK_BAJO)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log(`ℹ️ Producto ${productoId} NO tiene stock bajo (stock >= ${UMBRAL_STOCK_BAJO})`);
        return [];
      }
      throw error;
    }
    
    if (data) {
      console.log(`✅ Producto ${data.nombre_item}: stock_actual=${data.stock_actual} < ${UMBRAL_STOCK_BAJO}`);
    }
    
    return data ? [data] : [];
  } catch (error) {
    console.error('❌ Error al obtener producto con stock bajo:', error);
    return [];
  }
}

// ==========================================
// ACTUALIZAR generarHTMLNotificacion
// Reemplazar la celda de stock_minimo
// ==========================================
// BUSCAR (línea ~300):
// <td style="padding: 12px; text-align: center;">${p.stock_minimo || 0}</td>
//
// REEMPLAZAR CON:
// <td style="padding: 12px; text-align: center;">${UMBRAL_STOCK_BAJO}</td>

// BUSCAR (línea ~320):
// <strong>${p.nombre_item}</strong> - Stock: ${p.stock_actual}/${p.stock_minimo}
//
// REEMPLAZAR CON:
// <strong>${p.nombre_item}</strong> - Stock: ${p.stock_actual}/${UMBRAL_STOCK_BAJO}
