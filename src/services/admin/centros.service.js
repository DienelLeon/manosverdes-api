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
  return { items, total };
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
