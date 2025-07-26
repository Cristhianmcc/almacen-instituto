const moment = require('moment');

// Configurar moment en español
moment.locale('es');

/**
 * Formatea una fecha para mostrar en la aplicación
 * @param {Date|string} date - Fecha a formatear
 * @param {string} format - Formato deseado (opcional)
 * @returns {string} Fecha formateada
 */
const formatDate = (date, format = 'DD/MM/YYYY') => {
  if (!date) return '';
  return moment(date).format(format);
};

/**
 * Formatea una fecha y hora para mostrar en la aplicación
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} Fecha y hora formateada
 */
const formatDateTime = (date) => {
  if (!date) return '';
  return moment(date).format('DD/MM/YYYY HH:mm:ss');
};

/**
 * Obtiene la fecha actual en formato ISO
 * @returns {string} Fecha actual en formato ISO
 */
const getCurrentDate = () => {
  return moment().toISOString();
};

/**
 * Obtiene la fecha actual en formato de solo fecha (YYYY-MM-DD)
 * @returns {string} Fecha actual en formato YYYY-MM-DD
 */
const getCurrentDateOnly = () => {
  return moment().format('YYYY-MM-DD');
};

/**
 * Calcula los días restantes hasta una fecha
 * @param {Date|string} date - Fecha objetivo
 * @returns {number} Días restantes (negativo si ya pasó)
 */
const getDaysUntil = (date) => {
  if (!date) return null;
  return moment(date).diff(moment(), 'days');
};

/**
 * Verifica si una fecha está vencida
 * @param {Date|string} date - Fecha a verificar
 * @returns {boolean} True si está vencida
 */
const isExpired = (date) => {
  if (!date) return false;
  return moment(date).isBefore(moment(), 'day');
};

/**
 * Verifica si una fecha está próxima a vencer
 * @param {Date|string} date - Fecha a verificar
 * @param {number} days - Días de anticipación (por defecto 30)
 * @returns {boolean} True si está próxima a vencer
 */
const isNearExpiration = (date, days = 30) => {
  if (!date) return false;
  const daysUntil = getDaysUntil(date);
  return daysUntil !== null && daysUntil <= days && daysUntil > 0;
};

/**
 * Convierte una fecha a formato de base de datos
 * @param {Date|string} date - Fecha a convertir
 * @returns {string} Fecha en formato YYYY-MM-DD
 */
const toDbDate = (date) => {
  if (!date) return null;
  return moment(date).format('YYYY-MM-DD');
};

/**
 * Convierte una fecha a formato de base de datos con hora
 * @param {Date|string} date - Fecha a convertir
 * @returns {string} Fecha en formato ISO
 */
const toDbDateTime = (date) => {
  if (!date) return null;
  return moment(date).toISOString();
};

/**
 * Obtiene el inicio del día para una fecha
 * @param {Date|string} date - Fecha (opcional, por defecto hoy)
 * @returns {string} Fecha al inicio del día
 */
const getStartOfDay = (date = null) => {
  return moment(date).startOf('day').toISOString();
};

/**
 * Obtiene el final del día para una fecha
 * @param {Date|string} date - Fecha (opcional, por defecto hoy)
 * @returns {string} Fecha al final del día
 */
const getEndOfDay = (date = null) => {
  return moment(date).endOf('day').toISOString();
};

/**
 * Obtiene un rango de fechas para filtros
 * @param {string} period - Período: 'today', 'week', 'month', 'quarter', 'year'
 * @returns {Object} Objeto con fechas de inicio y fin
 */
const getDateRange = (period) => {
  const start = moment().startOf(period);
  const end = moment().endOf(period);
  
  return {
    start: start.toISOString(),
    end: end.toISOString(),
    startDate: start.format('YYYY-MM-DD'),
    endDate: end.format('YYYY-MM-DD')
  };
};

/**
 * Calcula la antigüedad de un producto basado en su fecha de ingreso
 * @param {Date|string} ingressDate - Fecha de ingreso
 * @returns {Object} Objeto con días, meses y años de antigüedad
 */
const getProductAge = (ingressDate) => {
  if (!ingressDate) return { days: 0, months: 0, years: 0 };
  
  const now = moment();
  const ingress = moment(ingressDate);
  
  return {
    days: now.diff(ingress, 'days'),
    months: now.diff(ingress, 'months'),
    years: now.diff(ingress, 'years')
  };
};

/**
 * Valida si una fecha es válida
 * @param {Date|string} date - Fecha a validar
 * @returns {boolean} True si es válida
 */
const isValidDate = (date) => {
  return moment(date).isValid();
};

/**
 * Obtiene el mes y año actual para reportes
 * @returns {Object} Objeto con mes y año
 */
const getCurrentMonthYear = () => {
  const now = moment();
  return {
    month: now.month() + 1, // moment months are 0-based
    year: now.year(),
    monthName: now.format('MMMM'),
    monthYear: now.format('MMMM YYYY')
  };
};

/**
 * Formatea un tiempo transcurrido de manera legible
 * @param {Date|string} date - Fecha de inicio
 * @returns {string} Tiempo transcurrido legible
 */
const getTimeAgo = (date) => {
  if (!date) return '';
  return moment(date).fromNow();
};

module.exports = {
  formatDate,
  formatDateTime,
  getCurrentDate,
  getCurrentDateOnly,
  getDaysUntil,
  isExpired,
  isNearExpiration,
  toDbDate,
  toDbDateTime,
  getStartOfDay,
  getEndOfDay,
  getDateRange,
  getProductAge,
  isValidDate,
  getCurrentMonthYear,
  getTimeAgo
};
