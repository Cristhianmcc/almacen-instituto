const Joi = require('joi');

// Esquema de validación para productos
const productSchema = Joi.object({
  codigo_item: Joi.string().required().min(1).max(50).messages({
    'string.empty': 'El código del item es requerido',
    'string.min': 'El código del item debe tener al menos 1 carácter',
    'string.max': 'El código del item no puede exceder 50 caracteres',
    'any.required': 'El código del item es requerido'
  }),
  
  nombre_item: Joi.string().required().min(1).max(255).messages({
    'string.empty': 'El nombre del item es requerido',
    'string.min': 'El nombre del item debe tener al menos 1 carácter',
    'string.max': 'El nombre del item no puede exceder 255 caracteres',
    'any.required': 'El nombre del item es requerido'
  }),
  
  nombre_marca: Joi.string().allow('').max(255).messages({
    'string.max': 'El nombre de la marca no puede exceder 255 caracteres'
  }),
  
  orden_compra: Joi.string().allow('').max(50).messages({
    'string.max': 'La orden de compra no puede exceder 50 caracteres'
  }),
  
  nombre_medida: Joi.string().required().max(50).messages({
    'string.empty': 'La unidad de medida es requerida',
    'string.max': 'La unidad de medida no puede exceder 50 caracteres',
    'any.required': 'La unidad de medida es requerida'
  }),
  
  mayor: Joi.number().min(0).precision(2).messages({
    'number.min': 'El precio mayorista no puede ser negativo',
    'number.precision': 'El precio mayorista debe tener máximo 2 decimales'
  }),
  
  sub_cta: Joi.string().allow('').max(50).messages({
    'string.max': 'La subcuenta no puede exceder 50 caracteres'
  }),
  
  stock_actual: Joi.number().integer().min(0).required().messages({
    'number.base': 'El stock actual debe ser un número',
    'number.integer': 'El stock actual debe ser un número entero',
    'number.min': 'El stock actual no puede ser negativo',
    'any.required': 'El stock actual es requerido'
  }),
  
  fecha_vencimiento: Joi.date().allow(null).messages({
    'date.base': 'La fecha de vencimiento debe ser una fecha válida'
  }),
  
  estado: Joi.string().valid('activo', 'vencido', 'baja', 'sobrante').default('activo').messages({
    'any.only': 'El estado debe ser: activo, vencido, baja o sobrante'
  })
});

// Esquema de validación para actualización de productos (campos opcionales)
const productUpdateSchema = Joi.object({
  codigo_item: Joi.string().min(1).max(50).messages({
    'string.min': 'El código del item debe tener al menos 1 carácter',
    'string.max': 'El código del item no puede exceder 50 caracteres'
  }),
  
  nombre_item: Joi.string().min(1).max(255).messages({
    'string.min': 'El nombre del item debe tener al menos 1 carácter',
    'string.max': 'El nombre del item no puede exceder 255 caracteres'
  }),
  
  nombre_marca: Joi.string().allow('').max(255).messages({
    'string.max': 'El nombre de la marca no puede exceder 255 caracteres'
  }),
  
  orden_compra: Joi.string().allow('').max(50).messages({
    'string.max': 'La orden de compra no puede exceder 50 caracteres'
  }),
  
  nombre_medida: Joi.string().max(50).messages({
    'string.max': 'La unidad de medida no puede exceder 50 caracteres'
  }),
  
  mayor: Joi.number().min(0).precision(2).messages({
    'number.min': 'El precio mayorista no puede ser negativo',
    'number.precision': 'El precio mayorista debe tener máximo 2 decimales'
  }),
  
  sub_cta: Joi.string().allow('').max(50).messages({
    'string.max': 'La subcuenta no puede exceder 50 caracteres'
  }),
  
  stock_actual: Joi.number().integer().min(0).messages({
    'number.base': 'El stock actual debe ser un número',
    'number.integer': 'El stock actual debe ser un número entero',
    'number.min': 'El stock actual no puede ser negativo'
  }),
  
  fecha_vencimiento: Joi.date().allow(null).messages({
    'date.base': 'La fecha de vencimiento debe ser una fecha válida'
  }),
  
  estado: Joi.string().valid('activo', 'vencido', 'baja', 'sobrante').messages({
    'any.only': 'El estado debe ser: activo, vencido, baja o sobrante'
  })
});

// Esquema para movimientos (general)
const movementSchema = Joi.object({
  producto_id: Joi.number().integer().positive().required().messages({
    'number.base': 'El ID del producto debe ser un número',
    'number.integer': 'El ID del producto debe ser un número entero',
    'number.positive': 'El ID del producto debe ser positivo',
    'any.required': 'El ID del producto es requerido'
  }),
  
  tipo_movimiento: Joi.string().valid('entrada', 'salida').required().messages({
    'any.only': 'El tipo de movimiento debe ser: entrada o salida',
    'any.required': 'El tipo de movimiento es requerido'
  }),
  
  cantidad: Joi.number().integer().positive().required().messages({
    'number.base': 'La cantidad debe ser un número',
    'number.integer': 'La cantidad debe ser un número entero',
    'number.positive': 'La cantidad debe ser positiva',
    'any.required': 'La cantidad es requerida'
  }),
  
  usuario: Joi.string().max(255).messages({
    'string.max': 'El nombre del usuario no puede exceder 255 caracteres'
  }),
  
  observaciones: Joi.string().allow('').max(500).messages({
    'string.max': 'Las observaciones no pueden exceder 500 caracteres'
  })
});

// Esquema para entradas específicas (sin tipo_movimiento)
const entrySchema = Joi.object({
  producto_id: Joi.number().integer().positive().required().messages({
    'number.base': 'El ID del producto debe ser un número',
    'number.integer': 'El ID del producto debe ser un número entero',
    'number.positive': 'El ID del producto debe ser positivo',
    'any.required': 'El ID del producto es requerido'
  }),
  
  cantidad: Joi.number().integer().positive().required().messages({
    'number.base': 'La cantidad debe ser un número',
    'number.integer': 'La cantidad debe ser un número entero',
    'number.positive': 'La cantidad debe ser positiva',
    'any.required': 'La cantidad es requerida'
  }),
  
  usuario: Joi.string().max(255).messages({
    'string.max': 'El nombre del usuario no puede exceder 255 caracteres'
  }),
  
  observaciones: Joi.string().allow('').max(500).messages({
    'string.max': 'Las observaciones no pueden exceder 500 caracteres'
  })
});

// Esquema para salidas específicas (sin tipo_movimiento)
const exitSchema = Joi.object({
  producto_id: Joi.number().integer().positive().required().messages({
    'number.base': 'El ID del producto debe ser un número',
    'number.integer': 'El ID del producto debe ser un número entero',
    'number.positive': 'El ID del producto debe ser positivo',
    'any.required': 'El ID del producto es requerido'
  }),
  
  cantidad: Joi.number().integer().positive().required().messages({
    'number.base': 'La cantidad debe ser un número',
    'number.integer': 'La cantidad debe ser un número entero',
    'number.positive': 'La cantidad debe ser positiva',
    'any.required': 'La cantidad es requerida'
  }),
  
  usuario: Joi.string().max(255).messages({
    'string.max': 'El nombre del usuario no puede exceder 255 caracteres'
  }),
  
  observaciones: Joi.string().allow('').max(500).messages({
    'string.max': 'Las observaciones no pueden exceder 500 caracteres'
  })
});

// Esquema para alertas
const alertSchema = Joi.object({
  producto_id: Joi.number().integer().positive().required(),
  tipo_alerta: Joi.string().valid('bajo_stock', 'proximo_vencimiento', 'vencido').required(),
  descripcion: Joi.string().max(500).required(),
  estado_alerta: Joi.string().valid('pendiente', 'resuelta', 'ignorada').default('pendiente')
});

// Esquema para bajas
const withdrawalSchema = Joi.object({
  producto_id: Joi.number().integer().positive().required(),
  cantidad_baja: Joi.number().integer().positive().required().messages({
    'number.base': 'La cantidad de baja debe ser un número',
    'number.integer': 'La cantidad de baja debe ser un número entero',
    'number.positive': 'La cantidad de baja debe ser mayor a 0',
    'any.required': 'La cantidad de baja es requerida'
  }),
  motivo_baja: Joi.string().required().max(255).messages({
    'string.empty': 'El motivo de la baja es requerido',
    'string.max': 'El motivo de la baja no puede exceder 255 caracteres',
    'any.required': 'El motivo de la baja es requerido'
  }),
  usuario: Joi.string().max(255),
  observaciones: Joi.string().allow('').max(500)
});

// Esquema para sobrantes
const surplusSchema = Joi.object({
  producto_id: Joi.number().integer().positive().required(),
  cantidad: Joi.number().integer().positive().required(),
  observaciones: Joi.string().allow('').max(500)
});

// Funciones de validación
const validateProduct = (data) => {
  return productSchema.validate(data, { abortEarly: false });
};

const validateProductUpdate = (data) => {
  return productUpdateSchema.validate(data, { abortEarly: false });
};

const validateMovement = (data) => {
  return movementSchema.validate(data, { abortEarly: false });
};

const validateAlert = (data) => {
  return alertSchema.validate(data, { abortEarly: false });
};

const validateWithdrawal = (data) => {
  return withdrawalSchema.validate(data, { abortEarly: false });
};

const validateSurplus = (data) => {
  return surplusSchema.validate(data, { abortEarly: false });
};

// Middleware de validación
const validationMiddleware = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json({
        success: false,
        error: 'Error de validación',
        details: errorDetails
      });
    }
    
    next();
  };
};

module.exports = {
  productSchema,
  productUpdateSchema,
  movementSchema,
  entrySchema,
  exitSchema,
  alertSchema,
  withdrawalSchema,
  surplusSchema,
  validateProduct,
  validateProductUpdate,
  validateMovement,
  validateAlert,
  validateWithdrawal,
  validateSurplus,
  validationMiddleware
};
