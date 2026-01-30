// src/middlewares/role.middleware.js
const HttpError = require('../utils/httpError');

module.exports = (...allowed) => (req, _res, next) => {
  const rol = req.user?.rol || req.user?.role || req.user?.clave;
  if (!rol) return next(new HttpError(401, 'No autenticado'));
  if (!allowed.includes(rol)) return next(new HttpError(403, 'No autorizado'));
  return next();
};
