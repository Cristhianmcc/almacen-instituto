const { supabase } = require('../services/supabaseClient');
const { validateSurplus } = require('../middleware/validation');
const { successResponse, errorResponse, notFoundResponse } = require('../utils/responseUtils');
const { getCurrentDate } = require('../utils/dateUtils');

class SurplusController {
  /**
   * Obtener todos los sobrantes
   */
  async getAllSurplus(req, res) {
    try {
      const { 
        page = 1, 
        limit = 50, 
        fechaDesde = null,
        fechaHasta = null,
        enviado = null 
      } = req.query;

      const offset = (page - 1) * limit;

      let query = supabase
        .from('sobrantes')
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
        query = query.gte('fecha_envio', fechaDesde);
      }

      if (fechaHasta) {
        query = query.lte('fecha_envio', fechaHasta);
      }

      if (enviado !== null) {
        if (enviado === 'true') {
          query = query.not('fecha_envio', 'is', null);
        } else if (enviado === 'false') {
          query = query.is('fecha_envio', null);
        }
      }

      // Aplicar ordenamiento y paginación
      query = query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      res.json(successResponse(data, 'Sobrantes obtenidos exitosamente', {
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }));

    } catch (error) {
      console.error('Error al obtener sobrantes:', error);
      res.status(500).json(errorResponse('Error al obtener sobrantes', error.message));
    }
  }

  /**
   * Registrar nuevo sobrante
   */
  async createSurplus(req, res) {
    try {
      const { error: validationError } = validateSurplus(req.body);
      if (validationError) {
        return res.status(400).json(errorResponse(
          'Error de validación',
          validationError.details.map(d => d.message)
        ));
      }

      const { producto_id, cantidad, observaciones } = req.body;

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
      if (producto.stock_actual < cantidad) {
        return res.status(400).json(errorResponse(
          'Stock insuficiente',
          `Stock actual: ${producto.stock_actual}, Cantidad solicitada: ${cantidad}`
        ));
      }

      // Reducir stock del producto
      const nuevoStock = producto.stock_actual - cantidad;
      const { error: updateError } = await supabase
        .from('productos')
        .update({ 
          stock_actual: nuevoStock,
          updated_at: getCurrentDate()
        })
        .eq('id', producto_id);

      if (updateError) throw updateError;

      // Registrar el sobrante
      const { data, error } = await supabase
        .from('sobrantes')
        .insert([{
          producto_id,
          cantidad,
          observaciones: observaciones || '',
          created_at: getCurrentDate()
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

      // Registrar movimiento
      await supabase
        .from('movimientos')
        .insert([{
          producto_id,
          tipo_movimiento: 'salida',
          cantidad,
          fecha_movimiento: getCurrentDate(),
          usuario: 'Sistema',
          observaciones: `Sobrante registrado - ${observaciones}`,
          stock_anterior: producto.stock_actual,
          stock_post_movimiento: nuevoStock
        }]);

      res.status(201).json(successResponse(data, 'Sobrante registrado exitosamente'));

    } catch (error) {
      console.error('Error al registrar sobrante:', error);
      res.status(500).json(errorResponse('Error al registrar sobrante', error.message));
    }
  }

  /**
   * Marcar sobrante como enviado
   */
  async markAsSent(req, res) {
    try {
      const { id } = req.params;
      const { fecha_envio, observaciones_envio } = req.body;

      const { data, error } = await supabase
        .from('sobrantes')
        .update({
          fecha_envio: fecha_envio || getCurrentDate(),
          observaciones_envio: observaciones_envio || '',
          updated_at: getCurrentDate()
        })
        .eq('id', id)
        .select(`
          *,
          productos (
            codigo_item,
            nombre_item,
            nombre_marca
          )
        `)
        .single();

      if (error && error.code === 'PGRST116') {
        return res.status(404).json(notFoundResponse('Sobrante', id));
      }

      if (error) throw error;

      res.json(successResponse(data, 'Sobrante marcado como enviado exitosamente'));

    } catch (error) {
      console.error('Error al marcar sobrante como enviado:', error);
      res.status(500).json(errorResponse('Error al marcar sobrante como enviado', error.message));
    }
  }

  /**
   * Obtener estadísticas de sobrantes
   */
  async getSurplusStats(req, res) {
    try {
      const hoy = new Date().toISOString().split('T')[0];
      const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
      const inicioAno = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];

      // Sobrantes registrados
      const { data: sobrantesRegistrados, error: errorRegistrados } = await supabase
        .from('sobrantes')
        .select('cantidad, fecha_envio')
        .gte('created_at', inicioMes);

      if (errorRegistrados) throw errorRegistrados;

      // Sobrantes enviados
      const { data: sobrantesEnviados, error: errorEnviados } = await supabase
        .from('sobrantes')
        .select('cantidad, fecha_envio')
        .not('fecha_envio', 'is', null)
        .gte('fecha_envio', inicioMes);

      if (errorEnviados) throw errorEnviados;

      // Sobrantes pendientes
      const { data: sobrantesPendientes, error: errorPendientes } = await supabase
        .from('sobrantes')
        .select('cantidad')
        .is('fecha_envio', null);

      if (errorPendientes) throw errorPendientes;

      const estadisticas = {
        mes: {
          registrados: {
            total: sobrantesRegistrados.length,
            cantidad: sobrantesRegistrados.reduce((sum, s) => sum + s.cantidad, 0)
          },
          enviados: {
            total: sobrantesEnviados.length,
            cantidad: sobrantesEnviados.reduce((sum, s) => sum + s.cantidad, 0)
          }
        },
        pendientes: {
          total: sobrantesPendientes.length,
          cantidad: sobrantesPendientes.reduce((sum, s) => sum + s.cantidad, 0)
        }
      };

      res.json(successResponse(estadisticas, 'Estadísticas de sobrantes obtenidas exitosamente'));

    } catch (error) {
      console.error('Error al obtener estadísticas de sobrantes:', error);
      res.status(500).json(errorResponse('Error al obtener estadísticas de sobrantes', error.message));
    }
  }

  /**
   * Generar reporte de sobrantes para envío a departamental
   */
  async generateShipmentReport(req, res) {
    try {
      const { fechaDesde, fechaHasta } = req.query;

      let query = supabase
        .from('sobrantes')
        .select(`
          *,
          productos (
            codigo_item,
            nombre_item,
            nombre_marca,
            nombre_medida,
            orden_compra
          )
        `)
        .is('fecha_envio', null); // Solo sobrantes no enviados

      if (fechaDesde) {
        query = query.gte('created_at', fechaDesde);
      }

      if (fechaHasta) {
        query = query.lte('created_at', fechaHasta);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      // Formatear reporte
      const reporte = {
        institucion: process.env.INSTITUTE_NAME || 'Instituto Educativo',
        codigo_institucion: process.env.INSTITUTE_CODE || 'IE001',
        destino: 'Departamental Lima',
        fecha_reporte: getCurrentDate(),
        total_productos: data.length,
        total_cantidad: data.reduce((sum, item) => sum + item.cantidad, 0),
        productos: data.map(item => ({
          id: item.id,
          codigo_item: item.productos.codigo_item,
          nombre_item: item.productos.nombre_item,
          marca: item.productos.nombre_marca,
          medida: item.productos.nombre_medida,
          orden_compra: item.productos.orden_compra,
          cantidad_sobrante: item.cantidad,
          fecha_registro: item.created_at,
          observaciones: item.observaciones
        }))
      };

      res.json(successResponse(reporte, 'Reporte de sobrantes generado exitosamente'));

    } catch (error) {
      console.error('Error al generar reporte de sobrantes:', error);
      res.status(500).json(errorResponse('Error al generar reporte de sobrantes', error.message));
    }
  }
}

module.exports = new SurplusController();
