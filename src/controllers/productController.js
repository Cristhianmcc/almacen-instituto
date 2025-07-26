const { supabase } = require('../services/supabaseClient');
const { successResponse, errorResponse, notFoundResponse } = require('../utils/responseUtils');
const { getCurrentDate } = require('../utils/dateUtils');

class ProductController {
  /**
   * Obtener todos los productos activos
   */
  async getAllProducts(req, res) {
    try {
      const { 
        page = 1, 
        limit = 50, 
        search = '', 
        estado = 'activo',
        orderBy = 'created_at',
        order = 'desc'
      } = req.query;

      const offset = (page - 1) * limit;

      let query = supabase
        .from('productos')
        .select('*', { count: 'exact' });

      // Aplicar filtros
      if (estado !== 'todos') {
        query = query.eq('estado', estado);
      }

      if (search) {
        query = query.or(`nombre_item.ilike.%${search}%,codigo_item.ilike.%${search}%,nombre_marca.ilike.%${search}%`);
      }

      // Aplicar ordenamiento y paginación
      query = query
        .order(orderBy, { ascending: order === 'asc' })
        .range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      res.json(successResponse(data, 'Productos obtenidos exitosamente', {
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }));

    } catch (error) {
      console.error('Error al obtener productos:', error);
      res.status(500).json(errorResponse('Error al obtener productos', error.message));
    }
  }

  /**
   * Obtener producto por ID
   */
  async getProductById(req, res) {
    try {
      const { id } = req.params;

      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code === 'PGRST116') {
        return res.status(404).json(notFoundResponse('Producto', id));
      }

      if (error) throw error;

      res.json(successResponse(data, 'Producto obtenido exitosamente'));

    } catch (error) {
      console.error('Error al obtener producto:', error);
      res.status(500).json(errorResponse('Error al obtener producto', error.message));
    }
  }

  /**
   * Crear nuevo producto
   */
  async createProduct(req, res) {
    try {
      // Extraer orden de compra de nombre_marca si existe
      const { nombre_marca } = req.body;
      let orden_compra = req.body.orden_compra || '';
      
      if (nombre_marca && !orden_compra) {
        // Buscar patrón de orden de compra en formato "292-24"
        const ocMatch = nombre_marca.match(/(\d{3}-\d{2})/);
        if (ocMatch) {
          orden_compra = ocMatch[1];
        }
      }

      const productData = {
        ...req.body,
        orden_compra,
        fecha_ingreso: getCurrentDate().split('T')[0],
        estado: 'activo',
        created_at: getCurrentDate(),
        updated_at: getCurrentDate()
      };

      const { data, error } = await supabase
        .from('productos')
        .insert([productData])
        .select()
        .single();

      if (error) throw error;

      // Registrar movimiento de entrada inicial si hay stock
      if (productData.stock_actual > 0) {
        try {
          await this.registerMovement(
            data.id,
            'entrada',
            productData.stock_actual,
            'Stock inicial al crear producto',
            0,
            productData.stock_actual
          );
        } catch (movError) {
          console.error('Error al registrar movimiento inicial:', movError);
          // No fallar la creación del producto por esto
        }
      }

      res.status(201).json(successResponse(data, 'Producto creado exitosamente'));

    } catch (error) {
      console.error('Error al crear producto:', error);
      
      // Manejar error de código duplicado
      if (error.code === '23505' && error.details && error.details.includes('codigo_item')) {
        return res.status(409).json(errorResponse(
          'Código duplicado', 
          `Ya existe un producto con el código ${req.body.codigo_item}. Por favor use un código diferente.`
        ));
      }
      
      // Manejar otros errores de base de datos
      if (error.code && error.message) {
        return res.status(400).json(errorResponse('Error de base de datos', error.message));
      }
      
      res.status(500).json(errorResponse('Error al crear producto', error.message));
    }
  }

  /**
   * Actualizar producto
   */
  async updateProduct(req, res) {
    try {
      const { id } = req.params;

      // Verificar si el producto existe
      const { data: existingProduct, error: fetchError } = await supabase
        .from('productos')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError && fetchError.code === 'PGRST116') {
        return res.status(404).json(notFoundResponse('Producto', id));
      }

      if (fetchError) throw fetchError;

      const updates = {
        ...req.body,
        updated_at: getCurrentDate()
      };

      const { data, error } = await supabase
        .from('productos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Si cambió el stock, registrar movimiento
      if (req.body.stock_actual !== undefined && req.body.stock_actual !== existingProduct.stock_actual) {
        const diferencia = req.body.stock_actual - existingProduct.stock_actual;
        const tipoMovimiento = diferencia > 0 ? 'entrada' : 'salida';
        const cantidad = Math.abs(diferencia);
        
        await this.registerMovement(
          id, 
          tipoMovimiento, 
          cantidad, 
          `Ajuste de stock: ${existingProduct.stock_actual} → ${req.body.stock_actual}`,
          existingProduct.stock_actual,
          req.body.stock_actual
        );
      }

      res.json(successResponse(data, 'Producto actualizado exitosamente'));

    } catch (error) {
      console.error('Error al actualizar producto:', error);
      res.status(500).json(errorResponse('Error al actualizar producto', error.message));
    }
  }

  /**
   * Eliminar producto (cambiar estado a baja)
   */
  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const { motivo = 'Eliminación manual' } = req.body;

      const { data, error } = await supabase
        .from('productos')
        .update({ 
          estado: 'baja',
          updated_at: getCurrentDate()
        })
        .eq('id', id)
        .select()
        .single();

      if (error && error.code === 'PGRST116') {
        return res.status(404).json(notFoundResponse('Producto', id));
      }

      if (error) throw error;

      // Registrar en tabla de bajas
      await supabase
        .from('bajas')
        .insert([{
          producto_id: id,
          motivo_baja: motivo,
          fecha_baja: getCurrentDate(),
          observaciones: 'Producto dado de baja desde la API'
        }]);

      res.json(successResponse(data, 'Producto dado de baja exitosamente'));

    } catch (error) {
      console.error('Error al eliminar producto:', error);
      res.status(500).json(errorResponse('Error al eliminar producto', error.message));
    }
  }

  /**
   * Obtener productos con bajo stock
   */
  async getLowStockProducts(req, res) {
    try {
      const threshold = parseInt(req.query.threshold) || parseInt(process.env.LOW_STOCK_THRESHOLD) || 10;

      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .eq('estado', 'activo')
        .lte('stock_actual', threshold)
        .order('stock_actual', { ascending: true });

      if (error) throw error;

      res.json(successResponse(data, `Productos con stock menor o igual a ${threshold}`));

    } catch (error) {
      console.error('Error al obtener productos con bajo stock:', error);
      res.status(500).json(errorResponse('Error al obtener productos con bajo stock', error.message));
    }
  }

  /**
   * Obtener productos próximos a vencer
   */
  async getExpiringProducts(req, res) {
    try {
      const days = parseInt(req.query.days) || parseInt(process.env.EXPIRATION_ALERT_DAYS) || 30;
      const today = new Date();
      const alertDate = new Date(today.getTime() + (days * 24 * 60 * 60 * 1000));

      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .eq('estado', 'activo')
        .not('fecha_vencimiento', 'is', null)
        .lte('fecha_vencimiento', alertDate.toISOString().split('T')[0])
        .order('fecha_vencimiento', { ascending: true });

      if (error) throw error;

      res.json(successResponse(data, `Productos que vencen en los próximos ${days} días`));

    } catch (error) {
      console.error('Error al obtener productos próximos a vencer:', error);
      res.status(500).json(errorResponse('Error al obtener productos próximos a vencer', error.message));
    }
  }

  /**
   * Registrar movimiento de stock
   */
  async registerMovement(productId, tipo, cantidad, observaciones = '', stockAnterior = null, stockPostMovimiento = null) {
    try {
      const { data, error } = await supabase
        .from('movimientos')
        .insert([{
          producto_id: productId,
          tipo_movimiento: tipo,
          cantidad: cantidad,
          fecha_movimiento: getCurrentDate(),
          observaciones: observaciones,
          stock_anterior: stockAnterior,
          stock_post_movimiento: stockPostMovimiento
        }]);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al registrar movimiento:', error);
      throw error;
    }
  }
}

module.exports = new ProductController();
