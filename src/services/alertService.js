const { supabase } = require('../services/supabaseClient');
const { successResponse, errorResponse } = require('../utils/responseUtils');
const { getCurrentDate, isExpired, getDaysUntil } = require('../utils/dateUtils');

class AlertService {
  /**
   * Generar alertas automáticas
   */
  async generateAutomaticAlerts() {
    try {
      await this.generateLowStockAlerts();
      await this.generateExpirationAlerts();
      await this.generateExpiredProductAlerts();
      return { success: true, message: 'Alertas generadas exitosamente' };
    } catch (error) {
      console.error('Error al generar alertas automáticas:', error);
      throw error;
    }
  }

  /**
   * Generar alertas de stock bajo
   */
  async generateLowStockAlerts() {
    try {
      const threshold = parseInt(process.env.LOW_STOCK_THRESHOLD) || 10;
      const criticalThreshold = parseInt(process.env.CRITICAL_STOCK_THRESHOLD) || 5;

      // Obtener productos con stock bajo
      const { data: lowStockProducts, error } = await supabase
        .from('productos')
        .select('id, codigo_item, nombre_item, stock_actual')
        .eq('estado', 'activo')
        .lte('stock_actual', threshold);

      if (error) throw error;

      for (const product of lowStockProducts) {
        // Verificar si ya existe una alerta pendiente para este producto
        const { data: existingAlert } = await supabase
          .from('alertas')
          .select('id')
          .eq('producto_id', product.id)
          .eq('tipo_alerta', 'bajo_stock')
          .eq('estado_alerta', 'pendiente')
          .single();

        if (!existingAlert) {
          const isCritical = product.stock_actual <= criticalThreshold;
          const description = isCritical 
            ? `CRÍTICO: Stock muy bajo - ${product.stock_actual} unidades restantes`
            : `Stock bajo: ${product.stock_actual} unidades restantes`;

          await supabase
            .from('alertas')
            .insert([{
              producto_id: product.id,
              tipo_alerta: 'bajo_stock',
              descripcion: description,
              fecha_alerta: getCurrentDate(),
              estado_alerta: 'pendiente'
            }]);
        }
      }

      console.log(`✅ Generadas ${lowStockProducts.length} alertas de stock bajo`);
    } catch (error) {
      console.error('Error al generar alertas de stock bajo:', error);
      throw error;
    }
  }

  /**
   * Generar alertas de productos próximos a vencer
   */
  async generateExpirationAlerts() {
    try {
      const alertDays = parseInt(process.env.EXPIRATION_ALERT_DAYS) || 30;
      const today = new Date();
      const alertDate = new Date(today.getTime() + (alertDays * 24 * 60 * 60 * 1000));

      // Obtener productos próximos a vencer
      const { data: expiringProducts, error } = await supabase
        .from('productos')
        .select('id, codigo_item, nombre_item, fecha_vencimiento')
        .eq('estado', 'activo')
        .not('fecha_vencimiento', 'is', null)
        .lte('fecha_vencimiento', alertDate.toISOString().split('T')[0])
        .gt('fecha_vencimiento', today.toISOString().split('T')[0]);

      if (error) throw error;

      for (const product of expiringProducts) {
        const daysUntilExpiration = getDaysUntil(product.fecha_vencimiento);
        
        // Verificar si ya existe una alerta pendiente para este producto
        const { data: existingAlert } = await supabase
          .from('alertas')
          .select('id')
          .eq('producto_id', product.id)
          .eq('tipo_alerta', 'proximo_vencimiento')
          .eq('estado_alerta', 'pendiente')
          .single();

        if (!existingAlert) {
          const description = `Producto próximo a vencer en ${daysUntilExpiration} días (${product.fecha_vencimiento})`;

          await supabase
            .from('alertas')
            .insert([{
              producto_id: product.id,
              tipo_alerta: 'proximo_vencimiento',
              descripcion: description,
              fecha_alerta: getCurrentDate(),
              estado_alerta: 'pendiente'
            }]);
        }
      }

      console.log(`✅ Generadas ${expiringProducts.length} alertas de vencimiento próximo`);
    } catch (error) {
      console.error('Error al generar alertas de vencimiento:', error);
      throw error;
    }
  }

  /**
   * Generar alertas de productos vencidos
   */
  async generateExpiredProductAlerts() {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Obtener productos vencidos
      const { data: expiredProducts, error } = await supabase
        .from('productos')
        .select('id, codigo_item, nombre_item, fecha_vencimiento')
        .eq('estado', 'activo')
        .not('fecha_vencimiento', 'is', null)
        .lt('fecha_vencimiento', today);

      if (error) throw error;

      for (const product of expiredProducts) {
        // Verificar si ya existe una alerta pendiente para este producto
        const { data: existingAlert } = await supabase
          .from('alertas')
          .select('id')
          .eq('producto_id', product.id)
          .eq('tipo_alerta', 'vencido')
          .eq('estado_alerta', 'pendiente')
          .single();

        if (!existingAlert) {
          const description = `Producto VENCIDO desde ${product.fecha_vencimiento}`;

          await supabase
            .from('alertas')
            .insert([{
              producto_id: product.id,
              tipo_alerta: 'vencido',
              descripcion: description,
              fecha_alerta: getCurrentDate(),
              estado_alerta: 'pendiente'
            }]);

          // Cambiar estado del producto a vencido
          await supabase
            .from('productos')
            .update({ estado: 'vencido' })
            .eq('id', product.id);
        }
      }

      console.log(`✅ Generadas ${expiredProducts.length} alertas de productos vencidos`);
    } catch (error) {
      console.error('Error al generar alertas de productos vencidos:', error);
      throw error;
    }
  }

  /**
   * Obtener todas las alertas
   */
  async getAllAlerts(filters = {}) {
    try {
      const { 
        page = 1, 
        limit = 50, 
        tipo = null, 
        estado = 'pendiente',
        producto_id = null 
      } = filters;

      const offset = (page - 1) * limit;

      let query = supabase
        .from('alertas')
        .select(`
          *,
          productos (
            id,
            codigo_item,
            nombre_item,
            nombre_marca,
            stock_actual,
            fecha_vencimiento
          )
        `, { count: 'exact' });

      // Aplicar filtros
      if (tipo) {
        query = query.eq('tipo_alerta', tipo);
      }

      if (estado !== 'todas') {
        query = query.eq('estado_alerta', estado);
      }

      if (producto_id) {
        query = query.eq('producto_id', producto_id);
      }

      // Aplicar ordenamiento y paginación
      query = query
        .order('fecha_alerta', { ascending: false })
        .range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        data,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      };
    } catch (error) {
      console.error('Error al obtener alertas:', error);
      throw error;
    }
  }

  /**
   * Marcar alerta como resuelta
   */
  async resolveAlert(alertId) {
    try {
      const { data, error } = await supabase
        .from('alertas')
        .update({ 
          estado_alerta: 'resuelta',
          fecha_resolucion: getCurrentDate()
        })
        .eq('id', alertId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al resolver alerta:', error);
      throw error;
    }
  }

  /**
   * Marcar alerta como ignorada
   */
  async ignoreAlert(alertId) {
    try {
      const { data, error } = await supabase
        .from('alertas')
        .update({ 
          estado_alerta: 'ignorada',
          fecha_resolucion: getCurrentDate()
        })
        .eq('id', alertId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al ignorar alerta:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de alertas
   */
  async getAlertStats() {
    try {
      // Contar alertas por tipo y estado
      const { data: alertCounts, error } = await supabase
        .from('alertas')
        .select('tipo_alerta, estado_alerta')
        .eq('estado_alerta', 'pendiente');

      if (error) throw error;

      const stats = {
        pendientes: {
          bajo_stock: alertCounts.filter(a => a.tipo_alerta === 'bajo_stock').length,
          proximo_vencimiento: alertCounts.filter(a => a.tipo_alerta === 'proximo_vencimiento').length,
          vencido: alertCounts.filter(a => a.tipo_alerta === 'vencido').length,
          total: alertCounts.length
        }
      };

      return stats;
    } catch (error) {
      console.error('Error al obtener estadísticas de alertas:', error);
      throw error;
    }
  }
}

module.exports = new AlertService();
