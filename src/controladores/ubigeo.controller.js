const HttpError = require('../utils/httpError');
const dao = require('../dao/admin/ubigeo.dao');

function toId(x, name) {
  const n = Number(x);
  if (!Number.isInteger(n) || n <= 0) throw new HttpError(400, `${name} requerido`);
  return n;
}

async function departamentos(_req, res, next) {
  try {
    const items = await dao.departamentoList();
    res.json({ ok: true, items });
  } catch (e) { next(e); }
}

async function provincias(req, res, next) {
  try {
    const departamento_id = toId(req.query.departamento_id, 'departamento_id');
    const items = await dao.provinciaList(departamento_id);
    res.json({ ok: true, items });
  } catch (e) { next(e); }
}

async function distritos(req, res, next) {
  try {
    const provincia_id = toId(req.query.provincia_id, 'provincia_id');
    const items = await dao.distritoList(provincia_id);
    res.json({ ok: true, items });
  } catch (e) { next(e); }
}

module.exports = {
  departamentos,
  provincias,
  distritos,
};
