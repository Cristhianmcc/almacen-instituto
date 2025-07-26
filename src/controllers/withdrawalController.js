const { supabase } = require('../services/supabaseClient');
const { validateWithdrawal } = require('../middleware/validation');
const { successResponse, errorResponse, notFoundResponse } = require('../utils/responseUtils');
const { getCurrentDate } = require('../utils/dateUtils');

class WithdrawalController {
  /**
   * Obtener todas las bajas
   */
  async getAllWithdrawals(req, res) {
    try {
      const { 
        page = 1, 
        limit = 50, 
        fechaDesde = null,
        fechaHasta = null,
        motivo = null 
      } = req.query;

      const offset = (page - 1) * limit;

      let query = supabase
        .from('bajas')
        .select(`
          *,
          productos (
            id,
            codigo_item,
            nombre_item,
            nombre_marca,
            stock_actual
          )
        `, { count: 'exact' });

      // Aplicar filtros
      if (fechaDesde) {
        query = query.gte('fecha_baja', fechaDesde);
      }

      if (fechaHasta) {
        query = query.lte('fecha_baja', fechaHasta);
      }

      if (motivo) {
        query = query.ilike('motivo_baja', `%${motivo}%`);
      }

      // Aplicar ordenamiento y paginación
      query = query
        .order('fecha_baja', { ascending: false })
        .range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      res.json(successResponse(data, 'Bajas obtenidas exitosamente', {
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }));

    } catch (error) {
      console.error('Error al obtener bajas:', error);
      res.status(500).json(errorResponse('Error al obtener bajas', error.message));
    }
  }

  /**
   * Registrar nueva baja
   */
  async createWithdrawal(req, res) {
    try {
      const { error: validationError } = validateWithdrawal(req.body);
      if (validationError) {
        return res.status(400).json(errorResponse(
          'Error de validación',
          validationError.details.map(d => d.message)
        ));
      }

      const { producto_id, cantidad_baja, motivo_baja, usuario, observaciones } = req.body;

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

      // Verificar que hay suficiente stock
      if (producto.stock_actual < cantidad_baja) {
        return res.status(400).json(errorResponse(
          'Stock insuficiente',
          `No hay suficiente stock. Stock actual: ${producto.stock_actual}, Cantidad solicitada: ${cantidad_baja}`
        ));
      }

      // Actualizar stock del producto
      const nuevoStock = producto.stock_actual - cantidad_baja;
      const { error: updateError } = await supabase
        .from('productos')
        .update({ 
          stock_actual: nuevoStock,
          estado: nuevoStock === 0 ? 'baja' : producto.estado,
          updated_at: getCurrentDate()
        })
        .eq('id', producto_id);

      if (updateError) throw updateError;

      // Registrar la baja
      const { data, error } = await supabase
        .from('bajas')
        .insert([{
          producto_id,
          cantidad_baja,
          motivo_baja,
          fecha_baja: getCurrentDate(),
          usuario: usuario || 'Sistema',
          observaciones: observaciones || ''
        }])
        .select(`
          *,
          productos (
            codigo_item,
            nombre_item,
            nombre_marca
          )
        `)
        .single();

      if (error) throw error;

      // Registrar movimiento de salida por baja
      const { error: movementError } = await supabase
        .from('movimientos')
        .insert([{
          producto_id,
          tipo_movimiento: 'salida',
          cantidad: cantidad_baja,
          fecha_movimiento: getCurrentDate(),
          usuario: usuario || 'Sistema',
          observaciones: `Baja registrada - ${motivo_baja}`,
          stock_anterior: producto.stock_actual,
          stock_posterior: nuevoStock,
          stock_post_movimiento: nuevoStock
        }]);

      if (movementError) {
        console.warn('Error al registrar movimiento:', movementError);
        // No fallar por error en movimiento, pero log el error
      }

      res.status(201).json(successResponse(data, 'Baja registrada exitosamente'));

    } catch (error) {
      console.error('Error al registrar baja:', error);
      res.status(500).json(errorResponse('Error al registrar baja', error.message));
    }
  }

  /**
   * Obtener estadísticas de bajas
   */
  async getWithdrawalStats(req, res) {
    try {
      const hoy = new Date().toISOString().split('T')[0];
      const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
      const inicioAno = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];

      // Bajas del día
      const { data: bajasHoy, error: errorHoy } = await supabase
        .from('bajas')
        .select('motivo_baja')
        .gte('fecha_baja', hoy)
        .lte('fecha_baja', hoy + 'T23:59:59');

      if (errorHoy) throw errorHoy;

      // Bajas del mes
      const { data: bajasMes, error: errorMes } = await supabase
        .from('bajas')
        .select('motivo_baja')
        .gte('fecha_baja', inicioMes);

      if (errorMes) throw errorMes;

      // Bajas del año
      const { data: bajasAno, error: errorAno } = await supabase
        .from('bajas')
        .select('motivo_baja')
        .gte('fecha_baja', inicioAno);

      if (errorAno) throw errorAno;

      // Agrupar por motivo
      const groupByMotivo = (bajas) => {
        const grupos = {};
        bajas.forEach(baja => {
          grupos[baja.motivo_baja] = (grupos[baja.motivo_baja] || 0) + 1;
        });
        return grupos;
      };

      const estadisticas = {
        hoy: {
          total: bajasHoy.length,
          porMotivo: groupByMotivo(bajasHoy)
        },
        mes: {
          total: bajasMes.length,
          porMotivo: groupByMotivo(bajasMes)
        },
        ano: {
          total: bajasAno.length,
          porMotivo: groupByMotivo(bajasAno)
        }
      };

      res.json(successResponse(estadisticas, 'Estadísticas de bajas obtenidas exitosamente'));

    } catch (error) {
      console.error('Error al obtener estadísticas de bajas:', error);
      res.status(500).json(errorResponse('Error al obtener estadísticas de bajas', error.message));
    }
  }

  /**
   * Obtener productos dados de baja
   */
  async getWithdrawnProducts(req, res) {
    try {
      const { 
        page = 1, 
        limit = 50,
        search = '' 
      } = req.query;

      const offset = (page - 1) * limit;

      let query = supabase
        .from('productos')
        .select('*', { count: 'exact' })
        .eq('estado', 'baja');

      if (search) {
        query = query.or(`nombre_item.ilike.%${search}%,codigo_item.ilike.%${search}%`);
      }

      query = query
        .order('updated_at', { ascending: false })
        .range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      res.json(successResponse(data, 'Productos dados de baja obtenidos exitosamente', {
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }));

    } catch (error) {
      console.error('Error al obtener productos dados de baja:', error);
      res.status(500).json(errorResponse('Error al obtener productos dados de baja', error.message));
    }
  }
}

module.exports = new WithdrawalController();
