const HttpError = require('../../utils/httpError');
const dao = require('../../dao/admin/centro_representante.dao');

const toId = (x, name='id') => {
  const n = Number(x);
  if (!Number.isInteger(n) || n <= 0) throw new HttpError(400, `${name} inválido`);
  return n;
};

exports.list = async () => dao.list();
exports.get = async (centro_id) => {
  centro_id = toId(centro_id, 'centro_id');
  const row = await dao.getByCentro(centro_id);
  if (!row) throw new HttpError(404, 'Representante no encontrado');
  return row;
};
exports.createOrUpdate = async (centro_id, b) => {
  centro_id = toId(centro_id, 'centro_id');
  await dao.createOrUpdate(centro_id, b || {});
  return { ok: true };
};
exports.delete = async (centro_id) => {
  centro_id = toId(centro_id, 'centro_id');
  const affected = await dao.delete(centro_id);
  if (affected < 1) throw new HttpError(404, 'Representante no encontrado');
  return { affected };
};
