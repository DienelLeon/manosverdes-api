// src/utils/roleGuard.js
const HttpError = require('./httpError');

module.exports = (...allowed) => (req, _res, next) => {
  const rol = req.user?.rol || req.user?.role || req.user?.clave; // según tu JWT
  if (!rol) return next(new HttpError(401, 'No autenticado'));
  if (!allowed.includes(rol)) return next(new HttpError(403, 'No autorizado'));
  return next();
};
