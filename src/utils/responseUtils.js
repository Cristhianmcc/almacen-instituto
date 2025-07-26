/**
 * Utilidades para formatear respuestas de la API
 */

/**
 * Formatea una respuesta exitosa
 * @param {*} data - Datos a retornar
 * @param {string} message - Mensaje personalizado
 * @param {Object} meta - Metadatos adicionales
 * @returns {Object} Respuesta formateada
 */
const successResponse = (data, message = null, meta = {}) => {
  const response = {
    success: true,
    data: data,
    timestamp: new Date().toISOString()
  };
  
  if (message) {
    response.message = message;
  }
  
  if (Object.keys(meta).length > 0) {
    response.meta = meta;
  }
  
  return response;
};

/**
 * Formatea una respuesta de error
 * @param {string} error - Mensaje de error
 * @param {string} details - Detalles del error
 * @param {number} code - Código de error
 * @returns {Object} Respuesta de error formateada
 */
const errorResponse = (error, details = null, code = null) => {
  const response = {
    success: false,
    error: error,
    timestamp: new Date().toISOString()
  };
  
  if (details) {
    response.details = details;
  }
  
  if (code) {
    response.code = code;
  }
  
  return response;
};

/**
 * Formatea una respuesta paginada
 * @param {Array} data - Datos a retornar
 * @param {number} page - Página actual
 * @param {number} limit - Elementos por página
 * @param {number} total - Total de elementos
 * @param {string} message - Mensaje personalizado
 * @returns {Object} Respuesta paginada formateada
 */
const paginatedResponse = (data, page, limit, total, message = null) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  
  const response = {
    success: true,
    data: data,
    pagination: {
      currentPage: page,
      totalPages: totalPages,
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage: hasNextPage,
      hasPrevPage: hasPrevPage,
      nextPage: hasNextPage ? page + 1 : null,
      prevPage: hasPrevPage ? page - 1 : null
    },
    timestamp: new Date().toISOString()
  };
  
  if (message) {
    response.message = message;
  }
  
  return response;
};

/**
 * Formatea una respuesta de validación
 * @param {Array} errors - Array de errores de validación
 * @returns {Object} Respuesta de validación formateada
 */
const validationErrorResponse = (errors) => {
  return {
    success: false,
    error: 'Error de validación',
    details: errors.map(err => ({
      field: err.path ? err.path.join('.') : err.field,
      message: err.message,
      value: err.value
    })),
    timestamp: new Date().toISOString()
  };
};

/**
 * Formatea una respuesta de recurso no encontrado
 * @param {string} resource - Nombre del recurso
 * @param {string|number} id - ID del recurso
 * @returns {Object} Respuesta de recurso no encontrado
 */
const notFoundResponse = (resource, id = null) => {
  let message = `${resource} no encontrado`;
  if (id) {
    message += ` con ID: ${id}`;
  }
  
  return {
    success: false,
    error: 'Recurso no encontrado',
    message: message,
    timestamp: new Date().toISOString()
  };
};

/**
 * Formatea una respuesta de conflicto
 * @param {string} message - Mensaje de conflicto
 * @param {Object} details - Detalles del conflicto
 * @returns {Object} Respuesta de conflicto formateada
 */
const conflictResponse = (message, details = null) => {
  const response = {
    success: false,
    error: 'Conflicto',
    message: message,
    timestamp: new Date().toISOString()
  };
  
  if (details) {
    response.details = details;
  }
  
  return response;
};

/**
 * Formatea una respuesta de autorización
 * @param {string} message - Mensaje de autorización
 * @returns {Object} Respuesta de autorización formateada
 */
const unauthorizedResponse = (message = 'No autorizado') => {
  return {
    success: false,
    error: 'No autorizado',
    message: message,
    timestamp: new Date().toISOString()
  };
};

/**
 * Formatea una respuesta de límite excedido
 * @param {string} message - Mensaje de límite excedido
 * @param {Object} limits - Información sobre los límites
 * @returns {Object} Respuesta de límite excedido formateada
 */
const rateLimitResponse = (message, limits = null) => {
  const response = {
    success: false,
    error: 'Límite excedido',
    message: message,
    timestamp: new Date().toISOString()
  };
  
  if (limits) {
    response.limits = limits;
  }
  
  return response;
};

/**
 * Formatea estadísticas para respuestas
 * @param {Object} stats - Estadísticas a formatear
 * @returns {Object} Estadísticas formateadas
 */
const formatStats = (stats) => {
  return {
    ...stats,
    generatedAt: new Date().toISOString(),
    period: stats.period || 'current'
  };
};

/**
 * Formatea una respuesta de operación exitosa
 * @param {string} operation - Tipo de operación
 * @param {Object} data - Datos resultado de la operación
 * @param {Object} meta - Metadatos adicionales
 * @returns {Object} Respuesta de operación exitosa
 */
const operationSuccessResponse = (operation, data = null, meta = {}) => {
  const messages = {
    create: 'Registro creado exitosamente',
    update: 'Registro actualizado exitosamente',
    delete: 'Registro eliminado exitosamente',
    process: 'Operación procesada exitosamente'
  };
  
  return successResponse(data, messages[operation] || 'Operación exitosa', {
    operation: operation,
    ...meta
  });
};

/**
 * Middleware para manejo de respuestas
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 */
const responseMiddleware = (req, res, next) => {
  // Agregar métodos de respuesta al objeto res
  res.success = (data, message, meta) => {
    return res.json(successResponse(data, message, meta));
  };
  
  res.error = (error, details, code) => {
    const statusCode = code || 500;
    return res.status(statusCode).json(errorResponse(error, details, code));
  };
  
  res.paginated = (data, page, limit, total, message) => {
    return res.json(paginatedResponse(data, page, limit, total, message));
  };
  
  res.notFound = (resource, id) => {
    return res.status(404).json(notFoundResponse(resource, id));
  };
  
  res.conflict = (message, details) => {
    return res.status(409).json(conflictResponse(message, details));
  };
  
  res.unauthorized = (message) => {
    return res.status(401).json(unauthorizedResponse(message));
  };
  
  next();
};

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse,
  validationErrorResponse,
  notFoundResponse,
  conflictResponse,
  unauthorizedResponse,
  rateLimitResponse,
  formatStats,
  operationSuccessResponse,
  responseMiddleware
};
