const HttpError = require("../utils/httpError");
const usuarioService = require("../services/usuarios.service");

exports.me = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new HttpError(401, "No autenticado");
    const out = await usuarioService.getMe(userId);
    res.json({ ok: true, usuario: out });
  } catch (e) {
    next(e);
  }
};
