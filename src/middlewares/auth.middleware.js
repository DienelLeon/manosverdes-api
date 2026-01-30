// src/middlewares/auth.middleware.js
const HttpError = require("../utils/httpError");
const { verifyToken } = require("../utils/jwt");

module.exports = (req, _res, next) => {
  try {
    const header = req.headers.authorization || req.headers.Authorization || "";
    const [type, token] = String(header).split(" ");

    if (type !== "Bearer" || !token) throw new HttpError(401, "Token requerido");

    const payload = verifyToken(token);

    if (payload && payload.rol && !payload.role) payload.role = payload.rol;

    req.user = payload;
    return next();
  } catch (e) {
    return next(new HttpError(401, "Token inválido o expirado"));
  }
};
