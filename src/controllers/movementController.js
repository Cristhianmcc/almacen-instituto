const { supabase } = require('../services/supabaseClient');
const { successResponse, errorResponse, notFoundResponse } = require('../utils/responseUtils');
const { getCurrentDate } = require('../utils/dateUtils');
const alertasService = require('../services/alertasService');

class MovementController {
  /**
   * Obtener todos los movimientos
   */
  async getAllMovements(req, res) {
    try {
      const { 
        page = 1, 
        limit = 50, 
        productId = null,
        tipo = null,
        fechaDesde = null,
        fechaHasta = null,
        orderBy = 'fecha_movimiento',
        order = 'desc'
      } = req.query;

      const offset = (page - 1) * limit;

      let query = supabase
        .from('movimientos')
        .select(`
          *,
          productos (
            id,
            codigo_item,
            nombre_item,
            nombre_marca
          )
        `, { count: 'exact' });

      // Aplicar filtros
      if (productId) {
        query = query.eq('producto_id', productId);
      }

      if (tipo) {
        query = query.eq('tipo_movimiento', tipo);
      }

      if (fechaDesde) {
        query = query.gte('fecha_movimiento', fechaDesde);
      }

      if (fechaHasta) {
        query = query.lte('fecha_movimiento', fechaHasta);
      }

      // Aplicar ordenamiento y paginación
      query = query
        .order(orderBy, { ascending: order === 'asc' })
        .range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      res.json(successResponse(data, 'Movimientos obtenidos exitosamente', {
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }));

    } catch (error) {
      console.error('Error al obtener movimientos:', error);
      res.status(500).json(errorResponse('Error al obtener movimientos', error.message));
    }
  }

  /**
   * Registrar entrada de producto
   */
  async registerEntry(req, res) {
    try {

      const { producto_id, cantidad, observaciones, usuario } = req.body;

      // Verificar que el producto existe
      const { data: producto, error: productError } = await supabase
        .from('productos')
        .select('*')
        .eq('id', producto_id)
        .single();

      if (productError && productError.code === 'PGRST116') {
        return res.status(404).json(notFoundResponse('Producto', producto_id));
      }

      if (productError) throw productError;

      const stockAnterior = producto.stock_actual;
      const stockNuevo = stockAnterior + cantidad;

      // Actualizar stock del producto
      const { error: updateError } = await supabase
        .from('productos')
        .update({ 
          stock_actual: stockNuevo,
          updated_at: getCurrentDate()
        })
        .eq('id', producto_id);

      if (updateError) throw updateError;

      // Si el stock sube por encima del umbral, resolver alertas pendientes
      const lowStockThreshold = parseInt(process.env.LOW_STOCK_THRESHOLD) || 10;
      if (stockAnterior <= lowStockThreshold && stockNuevo > lowStockThreshold) {
        await supabase
          .from('alertas')
          .update({ estado_alerta: 'resuelta', fecha_resolucion: getCurrentDate() })
          .eq('producto_id', producto_id)
          .eq('tipo_alerta', 'bajo_stock')
          .eq('estado_alerta', 'pendiente');
      }

      // Registrar movimiento
      const { data, error } = await supabase
        .from('movimientos')
        .insert([{
          producto_id,
          tipo_movimiento: 'entrada',
          cantidad,
          fecha_movimiento: getCurrentDate(),
          usuario: usuario || 'Sistema',
          observaciones: observaciones || 'Entrada de producto',
          stock_anterior: stockAnterior,
          stock_post_movimiento: stockNuevo
        }])
        .select()
        .single();

      if (error) throw error;

      // Verificar alertas inmediatamente después de la entrada
      console.log(' LLAMANDO verificarAlertasInmediatas para producto:', producto_id);
      await alertasService.verificarAlertasInmediatas(producto_id);
      console.log(' verificarAlertasInmediatas completado');

      res.status(201).json(successResponse(data, 'Entrada registrada exitosamente'));

    } catch (error) {
      console.error('Error al registrar entrada:', error);
      res.status(500).json(errorResponse('Error al registrar entrada', error.message));
    }
  }

  /**
   * Registrar salida de producto con lógica FIFO
   */
  async registerExit(req, res) {
    try {
      const { producto_id, cantidad, observaciones, usuario } = req.body;

      // Verificar que el producto existe y tiene stock suficiente
      const { data: producto, error: productError } = await supabase
        .from('productos')
        .select('*')
        .eq('id', producto_id)
        .single();

      if (productError && productError.code === 'PGRST116') {
        return res.status(404).json(notFoundResponse('Producto', producto_id));
      }

      if (productError) throw productError;

      if (producto.stock_actual < cantidad) {
        return res.status(400).json(errorResponse(
          'Stock insuficiente',
          `Stock actual: ${producto.stock_actual}, Cantidad solicitada: ${cantidad}`
        ));
      }

      const stockAnterior = producto.stock_actual;
      const stockNuevo = stockAnterior - cantidad;

      // Actualizar stock del producto
      const { error: updateError } = await supabase
        .from('productos')
        .update({ 
          stock_actual: stockNuevo,
          updated_at: getCurrentDate()
        })
        .eq('id', producto_id);

      if (updateError) throw updateError;

      

      // Registrar movimiento
      const { data, error } = await supabase
        .from('movimientos')
        .insert([{
          producto_id,
          tipo_movimiento: 'salida',
          cantidad,
          fecha_movimiento: getCurrentDate(),
          usuario: usuario || 'Sistema',
          observaciones: observaciones || 'Salida de producto',
          stock_anterior: stockAnterior,
          stock_post_movimiento: stockNuevo
        }])
        .select()
        .single();

      if (error) throw error;

      // Verificar si el stock queda bajo el umbral y generar alerta
      const lowStockThreshold = parseInt(process.env.LOW_STOCK_THRESHOLD) || 10;
      if (stockNuevo <= lowStockThreshold) {
        await this.generateLowStockAlert(producto_id, stockNuevo);
      }

      // Verificar alertas inmediatamente después de la salida
      console.log(' LLAMANDO verificarAlertasInmediatas para producto:', producto_id);
      await alertasService.verificarAlertasInmediatas(producto_id);
      console.log(' verificarAlertasInmediatas completado');

      res.status(201).json(successResponse(data, 'Salida registrada exitosamente'));

    } catch (error) {
      console.error('Error al registrar salida:', error);
      res.status(500).json(errorResponse('Error al registrar salida', error.message));
    }
  }

  /**
   * Obtener historial de movimientos de un producto
   */
  async getProductMovements(req, res) {
    try {
      const { id } = req.params;
      const { limit = 50, page = 1 } = req.query;
      const offset = (page - 1) * limit;

      const { data, error, count } = await supabase
        .from('movimientos')
        .select(`
          *,
          productos (
            codigo_item,
            nombre_item
          )
        `, { count: 'exact' })
        .eq('producto_id', id)
        .order('fecha_movimiento', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      res.json(successResponse(data, 'Historial de movimientos obtenido exitosamente', {
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }));

    } catch (error) {
      console.error('Error al obtener historial de movimientos:', error);
      res.status(500).json(errorResponse('Error al obtener historial de movimientos', error.message));
    }
  }

  /**
   * Obtener estadísticas de movimientos
   */
  async getMovementStats(req, res) {
    try {
      const { fechaDesde, fechaHasta } = req.query;
      const hoy = new Date().toISOString().split('T')[0];
      const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

      // Movimientos del día
      const { data: movimientosHoy, error: errorHoy } = await supabase
        .from('movimientos')
        .select('tipo_movimiento, cantidad')
        .gte('fecha_movimiento', hoy)
        .lte('fecha_movimiento', hoy + 'T23:59:59');

      if (errorHoy) throw errorHoy;

      // Movimientos del mes
      const { data: movimientosMes, error: errorMes } = await supabase
        .from('movimientos')
        .select('tipo_movimiento, cantidad')
        .gte('fecha_movimiento', inicioMes);

      if (errorMes) throw errorMes;

      // Procesar estadísticas
      const estadisticas = {
        hoy: {
          entradas: movimientosHoy.filter(m => m.tipo_movimiento === 'entrada').reduce((sum, m) => sum + m.cantidad, 0),
          salidas: movimientosHoy.filter(m => m.tipo_movimiento === 'salida').reduce((sum, m) => sum + m.cantidad, 0),
          total: movimientosHoy.length
        },
        mes: {
          entradas: movimientosMes.filter(m => m.tipo_movimiento === 'entrada').reduce((sum, m) => sum + m.cantidad, 0),
          salidas: movimientosMes.filter(m => m.tipo_movimiento === 'salida').reduce((sum, m) => sum + m.cantidad, 0),
          total: movimientosMes.length
        }
      };

      res.json(successResponse(estadisticas, 'Estadísticas de movimientos obtenidas exitosamente'));

    } catch (error) {
      console.error('Error al obtener estadísticas de movimientos:', error);
      res.status(500).json(errorResponse('Error al obtener estadísticas de movimientos', error.message));
    }
  }

  /**
   * Generar alerta de stock bajo (solo si no existe una pendiente)
   */
  async generateLowStockAlert(productId, currentStock) {
    try {
      // Verificar si ya existe una alerta pendiente para este producto
      const { data: existing, error: findError } = await supabase
        .from('alertas')
        .select('*')
        .eq('producto_id', productId)
        .eq('tipo_alerta', 'bajo_stock')
        .eq('estado_alerta', 'pendiente')
        .maybeSingle();

      if (findError) throw findError;
      if (existing) return; // Ya existe una alerta pendiente

      // Crear nueva alerta
      const { data, error } = await supabase
        .from('alertas')
        .insert([{
          producto_id: productId,
          tipo_alerta: 'bajo_stock',
          descripcion: `Stock bajo: ${currentStock} unidades restantes`,
          fecha_alerta: getCurrentDate(),
          estado_alerta: 'pendiente'
        }]);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al generar alerta de stock bajo:', error);
      throw error;
    }
  }
}

module.exports = MovementController;

