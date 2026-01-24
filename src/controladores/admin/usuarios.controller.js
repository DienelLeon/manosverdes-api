const HttpError = require('../../utils/httpError');
const usuariosService = require('../../services/admin/usuarios.service');

const isStr = (v) => typeof v === 'string' && v.trim().length > 0;

exports.listar = async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit || 20), 100);
    const offset = Math.max(Number(req.query.offset || 0), 0);
    const withAvatar = String(req.query.with_avatar_url || '0') === '1';

    const out = await usuariosService.listar({ limit, offset, withAvatar });
    res.json({ ok: true, ...out });
  } catch (e) {
    next(e);
  }
};

exports.obtener = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!id || id <= 0) throw new HttpError(400, 'ID inválido');
    const withAvatar = String(req.query.with_avatar_url || '0') === '1';

    const out = await usuariosService.obtener(id, { withAvatar });
    res.json({ ok: true, ...out });
  } catch (e) {
    next(e);
  }
};

exports.crear = async (req, res, next) => {
  try {
    const b = req.body || {};
    if (!isStr(b.nombre) || !isStr(b.apellido_paterno) || !isStr(b.email)) {
      throw new HttpError(400, 'Faltan campos obligatorios');
    }

    const out = await usuariosService.crear({
      nombre: b.nombre,
      apellido_paterno: b.apellido_paterno,
      apellido_materno: b.apellido_materno ?? null,
      email: b.email,
      telefono: b.telefono ?? null,
      fecha_nacimiento: b.fecha_nacimiento ?? null,
      rol_clave: b.rol_clave ?? 'app',
      estado: b.estado ?? 'activo',
      // si quieres permitir crear con password desde admin (opcional)
      password: b.password ?? null,
      email_verificado: b.email_verificado ?? 1,
    });

    res.status(201).json({ ok: true, ...out });
  } catch (e) {
    next(e);
  }
};

exports.actualizar = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!id || id <= 0) throw new HttpError(400, 'ID inválido');

    const b = req.body || {};
    const out = await usuariosService.actualizar(id, {
      nombre: b.nombre,
      apellido_paterno: b.apellido_paterno,
      apellido_materno: b.apellido_materno,
      telefono: b.telefono,
      fecha_nacimiento: b.fecha_nacimiento,
      rol_clave: b.rol_clave,
      estado: b.estado,
    });

    res.json({ ok: true, ...out });
  } catch (e) {
    next(e);
  }
};

exports.cambiarEstado = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!id || id <= 0) throw new HttpError(400, 'ID inválido');

    const { estado } = req.body || {};
    if (!['activo', 'inactivo', 'bloqueado'].includes(estado)) {
      throw new HttpError(400, 'Estado inválido');
    }

    const out = await usuariosService.cambiarEstado(id, estado);
    res.json({ ok: true, ...out });
  } catch (e) {
    next(e);
  }
};
