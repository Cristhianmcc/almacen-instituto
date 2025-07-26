const { supabase } = require('../services/supabaseClient');
const { successResponse, errorResponse } = require('../utils/responseUtils');
const { getCurrentDate, formatDate } = require('../utils/dateUtils');

class ReportController {
  /**
   * Obtener dashboard con estadísticas generales
   */
  async getDashboard(req, res) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

      // Estadísticas de productos
      const { data: productos, error: errorProductos } = await supabase
        .from('productos')
        .select('estado, stock_actual, fecha_vencimiento')
        .neq('estado', 'baja');

      if (errorProductos) throw errorProductos;

      // Estadísticas de movimientos del mes
      const { data: movimientos, error: errorMovimientos } = await supabase
        .from('movimientos')
        .select('tipo_movimiento, cantidad, fecha_movimiento')
        .gte('fecha_movimiento', startOfMonth);

      if (errorMovimientos) throw errorMovimientos;

      // Alertas pendientes
      const { data: alertas, error: errorAlertas } = await supabase
        .from('alertas')
        .select('tipo_alerta')
        .eq('estado_alerta', 'pendiente');

      if (errorAlertas) throw errorAlertas;

      // Procesar estadísticas
      const lowStockThreshold = parseInt(process.env.LOW_STOCK_THRESHOLD) || 10;
      const productosActivos = productos.filter(p => p.estado === 'activo');
      const productosConBajoStock = productosActivos.filter(p => p.stock_actual <= lowStockThreshold);
      const productosProximosVencer = productosActivos.filter(p => {
        if (!p.fecha_vencimiento) return false;
        const diasHastaVencimiento = Math.ceil((new Date(p.fecha_vencimiento) - new Date()) / (1000 * 60 * 60 * 24));
        return diasHastaVencimiento <= 30 && diasHastaVencimiento > 0;
      });

      const totalStock = productosActivos.reduce((sum, p) => sum + p.stock_actual, 0);
      const entradasMes = movimientos.filter(m => m.tipo_movimiento === 'entrada').reduce((sum, m) => sum + m.cantidad, 0);
      const salidasMes = movimientos.filter(m => m.tipo_movimiento === 'salida').reduce((sum, m) => sum + m.cantidad, 0);

      const dashboard = {
        productos: {
          total: productosActivos.length,
          conBajoStock: productosConBajoStock.length,
          proximosVencer: productosProximosVencer.length,
          vencidos: productos.filter(p => p.estado === 'vencido').length,
          totalStock: totalStock
        },
        movimientos: {
          entradasMes: entradasMes,
          salidasMes: salidasMes,
          totalMovimientos: movimientos.length
        },
        alertas: {
          pendientes: alertas.length,
          bajoStock: alertas.filter(a => a.tipo_alerta === 'bajo_stock').length,
          proximoVencimiento: alertas.filter(a => a.tipo_alerta === 'proximo_vencimiento').length,
          vencidos: alertas.filter(a => a.tipo_alerta === 'vencido').length
        },
        fecha: today
      };

      res.json(successResponse(dashboard, 'Dashboard obtenido exitosamente'));

    } catch (error) {
      console.error('Error al obtener dashboard:', error);
      res.status(500).json(errorResponse('Error al obtener dashboard', error.message));
    }
  }

  /**
   * Generar reporte de inventario
   */
  async getInventoryReport(req, res) {
    try {
      const { estado = 'activo', incluirStock = 'true' } = req.query;

      let query = supabase
        .from('productos')
        .select('*');

      if (estado !== 'todos') {
        query = query.eq('estado', estado);
      }

      const { data, error } = await query.order('nombre_item', { ascending: true });

      if (error) throw error;

      const reporte = {
        titulo: 'Reporte de Inventario',
        institucion: process.env.INSTITUTE_NAME || 'Instituto Educativo',
        fecha_generacion: getCurrentDate(),
        filtros: {
          estado: estado,
          incluir_stock: incluirStock === 'true'
        },
        resumen: {
          total_productos: data.length,
          total_stock: data.reduce((sum, p) => sum + (p.stock_actual || 0), 0),
          productos_activos: data.filter(p => p.estado === 'activo').length,
          productos_vencidos: data.filter(p => p.estado === 'vencido').length,
          productos_baja: data.filter(p => p.estado === 'baja').length
        },
        productos: data.map(producto => ({
          codigo: producto.codigo_item,
          nombre: producto.nombre_item,
          marca: producto.nombre_marca,
          orden_compra: producto.orden_compra,
          medida: producto.nombre_medida,
          stock: incluirStock === 'true' ? producto.stock_actual : null,
          fecha_vencimiento: producto.fecha_vencimiento ? formatDate(producto.fecha_vencimiento) : null,
          estado: producto.estado,
          fecha_ingreso: formatDate(producto.fecha_ingreso)
        }))
      };

      res.json(successResponse(reporte, 'Reporte de inventario generado exitosamente'));

    } catch (error) {
      console.error('Error al generar reporte de inventario:', error);
      res.status(500).json(errorResponse('Error al generar reporte de inventario', error.message));
    }
  }

  /**
   * Generar reporte de movimientos
   */
  async getMovementsReport(req, res) {
    try {
      const { 
        fechaDesde, 
        fechaHasta, 
        tipo = 'todos',
        producto_id = null 
      } = req.query;

      let query = supabase
        .from('movimientos')
        .select(`
          *,
          productos (
            codigo_item,
            nombre_item,
            nombre_marca
          )
        `);

      // Aplicar filtros
      if (fechaDesde) {
        query = query.gte('fecha_movimiento', fechaDesde);
      }

      if (fechaHasta) {
        query = query.lte('fecha_movimiento', fechaHasta);
      }

      if (tipo !== 'todos') {
        query = query.eq('tipo_movimiento', tipo);
      }

      if (producto_id) {
        query = query.eq('producto_id', producto_id);
      }

      const { data, error } = await query.order('fecha_movimiento', { ascending: false });

      if (error) throw error;

      const reporte = {
        titulo: 'Reporte de Movimientos',
        institucion: process.env.INSTITUTE_NAME || 'Instituto Educativo',
        fecha_generacion: getCurrentDate(),
        filtros: {
          fecha_desde: fechaDesde || 'Sin filtro',
          fecha_hasta: fechaHasta || 'Sin filtro',
          tipo: tipo,
          producto_id: producto_id || 'Todos'
        },
        resumen: {
          total_movimientos: data.length,
          total_entradas: data.filter(m => m.tipo_movimiento === 'entrada').length,
          total_salidas: data.filter(m => m.tipo_movimiento === 'salida').length,
          cantidad_entradas: data.filter(m => m.tipo_movimiento === 'entrada').reduce((sum, m) => sum + m.cantidad, 0),
          cantidad_salidas: data.filter(m => m.tipo_movimiento === 'salida').reduce((sum, m) => sum + m.cantidad, 0)
        },
        movimientos: data.map(movimiento => ({
          id: movimiento.id,
          tipo: movimiento.tipo_movimiento,
          producto: {
            codigo: movimiento.productos.codigo_item,
            nombre: movimiento.productos.nombre_item,
            marca: movimiento.productos.nombre_marca
          },
          cantidad: movimiento.cantidad,
          fecha: formatDate(movimiento.fecha_movimiento, 'DD/MM/YYYY HH:mm'),
          usuario: movimiento.usuario,
          observaciones: movimiento.observaciones,
          stock_anterior: movimiento.stock_anterior,
          stock_posterior: movimiento.stock_post_movimiento
        }))
      };

      res.json(successResponse(reporte, 'Reporte de movimientos generado exitosamente'));

    } catch (error) {
      console.error('Error al generar reporte de movimientos:', error);
      res.status(500).json(errorResponse('Error al generar reporte de movimientos', error.message));
    }
  }

  /**
   * Generar reporte para SIGA
   */
  async getSigaReport(req, res) {
    try {
      const { fechaDesde, fechaHasta } = req.query;
      const today = new Date().toISOString().split('T')[0];

      // Obtener productos activos
      const { data: productos, error: errorProductos } = await supabase
        .from('productos')
        .select('*')
        .eq('estado', 'activo')
        .order('codigo_item', { ascending: true });

      if (errorProductos) throw errorProductos;

      // Obtener movimientos del período
      let queryMovimientos = supabase
        .from('movimientos')
        .select(`
          *,
          productos (
            codigo_item,
            nombre_item
          )
        `);

      if (fechaDesde) {
        queryMovimientos = queryMovimientos.gte('fecha_movimiento', fechaDesde);
      }

      if (fechaHasta) {
        queryMovimientos = queryMovimientos.lte('fecha_movimiento', fechaHasta);
      }

      const { data: movimientos, error: errorMovimientos } = await queryMovimientos;

      if (errorMovimientos) throw errorMovimientos;

      // Generar reporte compatible con SIGA
      const reporteSiga = {
        encabezado: {
          institucion: process.env.INSTITUTE_NAME || 'Instituto Educativo',
          codigo_institucion: process.env.INSTITUTE_CODE || 'IE001',
          departamental: process.env.DEPARTAMENTAL_LIMA_CODE || 'DEPT_LIMA',
          fecha_reporte: today,
          periodo: {
            desde: fechaDesde || 'Sin filtro',
            hasta: fechaHasta || 'Sin filtro'
          }
        },
        inventario_actual: {
          total_productos: productos.length,
          valor_total_stock: productos.reduce((sum, p) => sum + (p.stock_actual * (p.mayor || 0)), 0),
          productos: productos.map(p => ({
            codigo_item: p.codigo_item,
            nombre_item: p.nombre_item,
            marca: p.nombre_marca,
            orden_compra: p.orden_compra,
            unidad_medida: p.nombre_medida,
            stock_actual: p.stock_actual,
            precio_unitario: p.mayor || 0,
            valor_total: (p.stock_actual * (p.mayor || 0)),
            fecha_ingreso: p.fecha_ingreso,
            fecha_vencimiento: p.fecha_vencimiento,
            subcuenta: p.sub_cta
          }))
        },
        movimientos_periodo: {
          total_entradas: movimientos.filter(m => m.tipo_movimiento === 'entrada').length,
          total_salidas: movimientos.filter(m => m.tipo_movimiento === 'salida').length,
          detalle: movimientos.map(m => ({
            fecha: m.fecha_movimiento,
            tipo: m.tipo_movimiento,
            codigo_item: m.productos.codigo_item,
            nombre_item: m.productos.nombre_item,
            cantidad: m.cantidad,
            observaciones: m.observaciones,
            usuario: m.usuario
          }))
        }
      };

      res.json(successResponse(reporteSiga, 'Reporte SIGA generado exitosamente'));

    } catch (error) {
      console.error('Error al generar reporte SIGA:', error);
      res.status(500).json(errorResponse('Error al generar reporte SIGA', error.message));
    }
  }
}

module.exports = new ReportController();
