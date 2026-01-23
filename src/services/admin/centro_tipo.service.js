const HttpError = require('../../utils/httpError');
const dao = require('../../dao/admin/centro_tipo.dao');

exports.list = async () => dao.list();
exports.get = async (id) => {
  const n = Number(id);
  if (!Number.isInteger(n) || n <= 0) throw new HttpError(400, 'id inválido');
  const row = await dao.get(n);
  if (!row) throw new HttpError(404, 'Tipo de centro no encontrado');
  return row;
};
exports.create = async (b) => {
  if (!b || !b.nombre) throw new HttpError(400, 'nombre requerido');
  const id = await dao.create(b.nombre);
  return { id };
};
exports.update = async (id, b) => {
  const n = Number(id);
  if (!Number.isInteger(n) || n <= 0) throw new HttpError(400, 'id inválido');
  if (!b || !b.nombre) throw new HttpError(400, 'nombre requerido');
  const affected = await dao.update(n, b.nombre);
  if (affected < 1) throw new HttpError(404, 'Tipo de centro no encontrado');
  return { affected };
};
exports.delete = async (id) => {
  const n = Number(id);
  if (!Number.isInteger(n) || n <= 0) throw new HttpError(400, 'id inválido');
  const affected = await dao.delete(n);
  if (affected < 1) throw new HttpError(404, 'Tipo de centro no encontrado');
  return { affected };
};
