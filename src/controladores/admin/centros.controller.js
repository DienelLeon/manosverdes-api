const HttpError = require('../../utils/httpError');
const s = require('../../services/admin/centros.service');

async function listar(req, res, next) {
  try {
    const out = await s.listar({
      limit: req.query.limit,
      offset: req.query.offset,
      estado: req.query.estado,
      distrito_id: req.query.distrito_id,
      tipo_id: req.query.tipo_id,
      q: req.query.q,
    });
    res.json({ ok: true, ...out });
  } catch (e) { next(e); }
}

async function obtener(req, res, next) {
  try {
    const out = await s.obtener(req.params.id);
    res.json({ ok: true, ...out });
  } catch (e) { next(e); }
}

async function crear(req, res, next) {
  try {
    const out = await s.crear(req.body || {});
    res.status(201).json({ ok: true, ...out });
  } catch (e) { next(e); }
}

async function actualizar(req, res, next) {
  try {
    const out = await s.actualizar(req.params.id, req.body || {});
    res.json({ ok: true, ...out });
  } catch (e) { next(e); }
}

async function cambiarEstado(req, res, next) {
  try {
    const { estado } = req.body || {};
    if (!estado) throw new HttpError(400, 'estado requerido');
    const out = await s.cambiarEstado(req.params.id, estado);
    res.json({ ok: true, ...out });
  } catch (e) { next(e); }
}

async function repUpsert(req, res, next) {
  try {
    const out = await s.repUpsert(req.params.id, req.body || {});
    res.json({ ok: true, ...out });
  } catch (e) { next(e); }
}

async function repDelete(req, res, next) {
  try {
    const out = await s.repDelete(req.params.id);
    res.json({ ok: true, ...out });
  } catch (e) { next(e); }
}

async function eliminar(req, res, next) {
  try {
    const out = await s.eliminar(req.params.id);
    res.json({ ok: true, ...out });
  } catch (e) { next(e); }
}

module.exports = {
  listar,
  obtener,
  crear,
  actualizar,
  cambiarEstado,
  repUpsert,
  repDelete,
  eliminar,
};
