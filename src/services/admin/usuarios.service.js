const HttpError = require('../../utils/httpError');
const dao = require('../../dao/admin/usuarios.dao');
const authDao = require('../../dao/auth.dao');
const bcrypt = require('bcryptjs');

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
  if (!row) throw new HttpError(404, 'Usuario no encontrado');
  return row;
};

exports.create = async (b) => {
  if (!b || !b.email || !b.nombre || !b.apellido_paterno) throw new HttpError(400, 'email, nombre y apellido_paterno son requeridos');
  if (!b.password) throw new HttpError(400, 'password requerido');
  const password_hash = await bcrypt.hash(String(b.password), 10);
  const usuario_id = await authDao.crearUsuario({
    ...b,
    password_hash,
  });
  if (!usuario_id) throw new HttpError(500, 'No se pudo crear usuario');
  return { id: usuario_id };
};

exports.update = async (id, b) => {
  id = toId(id);
  const affected = await dao.update(id, b);
  if (affected < 1) throw new HttpError(404, 'Usuario no encontrado');
  if (b.password) {
    const hash = await bcrypt.hash(String(b.password), 10);
    await authDao.actualizarPassword(id, hash);
  }
  return { affected };
};

exports.delete = async (id) => {
  id = toId(id);
  const affected = await dao.delete(id);
  if (affected < 1) throw new HttpError(404, 'Usuario no encontrado');
  return { affected };
};
