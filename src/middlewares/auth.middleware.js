// src/middlewares/auth.middleware.js
const HttpError = require('../utils/httpError');
const jwtUtil = require('../utils/jwt');

module.exports = function auth(req, _res, next) {
  try {
    const authH = req.headers.authorization || '';
    const m = authH.match(/^Bearer\s+(.+)$/i);
    if (!m) return next(new HttpError(401, 'Token requerido'));

    const token = m[1].trim();
    const payload = jwtUtil.verifyToken(token);

    const id = Number(payload.id);
    if (!id) return next(new HttpError(401, 'Token sin id'));

    req.user = {
      id,
      rol: payload.rol ?? null,
    };
    req.token = token;

    next();
  } catch (e) {
    next(new HttpError(401, 'Token inválido o expirado'));
  }
};
