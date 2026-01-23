const HttpError = require('../../utils/httpError');
const dao = require('../../dao/admin/centros.dao');

const toId = (x, name='id') => {
  const n = Number(x);
  if (!Number.isInteger(n) || n <= 0) throw new HttpError(400, `${name} inválido`);
  return n;
};

exports.list = async (q = {}) => {
  const limit = q.limit ? Math.min(500, Number(q.limit)) : 50;
  const offset = q.offset ? Math.max(0, Number(q.offset)) : 0;
  const search = q.q ?? null;
  const items = await dao.list(limit, offset, search);
  const total = await dao.count(search);
  // map representante fields to top-level keys expected by client
  const mapped = (items || []).map(it => {
    const r = { ...it };
    // representante fields may come as representante_* or direct names in other queries
    r.ruc = r.representante_ruc || r.ruc || null;
    r.razon_social = r.representante_razon_social || r.razon_social || null;
    r.contacto_nombre = r.representante_nombre || r.contacto_nombre || null;
    r.contacto_tel = r.representante_tel || r.contacto_tel || null;
    r.contacto_email = r.representante_email || r.contacto_email || null;
    // remove internal representante_* props to keep response tidy
    delete r.representante_ruc; delete r.representante_razon_social; delete r.representante_nombre; delete r.representante_tel; delete r.representante_email;
    return r;
  });
  return { items: mapped, total };
};

exports.get = async (id) => {
  id = toId(id);
  const row = await dao.get(id);
  if (!row) throw new HttpError(404, 'Centro no encontrado');
  return row;
};

exports.create = async (b) => {
  // minimal validation
  if (!b || !b.usuario_id || !b.nombre || !b.distrito_id) throw new HttpError(400, 'usuario_id, nombre y distrito_id son requeridos');
  const id = await dao.create(b);
  return { id };
};

exports.update = async (id, b) => {
  id = toId(id);
  const affected = await dao.update(id, b);
  if (affected < 1) throw new HttpError(404, 'Centro no encontrado');
  return { affected };
};

exports.delete = async (id) => {
  id = toId(id);
  const affected = await dao.delete(id);
  if (affected < 1) throw new HttpError(404, 'Centro no encontrado');
  return { affected };
};
