const bcrypt = require('bcryptjs');
const HttpError = require('../../utils/httpError');
const centrosDao = require('../../dao/admin/centros.dao');

const isStr = (v) => typeof v === 'string' && v.trim().length > 0;

function toId(x, name) {
  const n = Number(x);
  if (!Number.isInteger(n) || n <= 0) throw new HttpError(400, `${name} inválido`);
  return n;
}
function validarEstadoCentro(estado) {
  if (!['activo', 'inactivo'].includes(String(estado))) throw new HttpError(400, 'estado inválido');
}
function validarModo(modo) {
  if (!['vincular_usuario', 'crear_usuario'].includes(String(modo))) {
    throw new HttpError(400, 'modo inválido');
  }
}

async function listar({ limit, offset, estado, distrito_id, tipo_id, q }) {
  const lim = Math.min(Number(limit || 20), 100);
  const off = Math.max(Number(offset || 0), 0);

  const items = await centrosDao.listar({
    limit: lim,
    offset: off,
    estado: estado ?? null,
    distrito_id: distrito_id ? Number(distrito_id) : null,
    tipo_id: tipo_id ? Number(tipo_id) : null,
    q: (q ?? '').toString().trim() || null,
  });

  return { items, limit: lim, offset: off };
}

async function obtener(id) {
  id = toId(id, 'id');
  const out = await centrosDao.obtenerDetalle(id);
  if (!out?.centro) throw new HttpError(404, 'Centro no encontrado');
  return out;
}

async function crear(payload) {
  const modo = payload?.modo || 'vincular_usuario';
  validarModo(modo);

  const centro = payload?.centro || {};
  if (!isStr(centro.nombre)) throw new HttpError(400, 'centro.nombre requerido');
  centro.distrito_id = toId(centro.distrito_id, 'centro.distrito_id');
  if (centro.estado) validarEstadoCentro(centro.estado);

  const representante = payload?.representante || null;

  if (modo === 'vincular_usuario') {
    const usuario_id = toId(payload?.usuario_id, 'usuario_id');
    const centro_id = await centrosDao.crearForUsuario({ usuario_id, centro, representante });
    return { centro_id };
  }

  // modo crear_usuario
  const usuario = payload?.usuario || {};
  if (!isStr(usuario.nombre)) throw new HttpError(400, 'usuario.nombre requerido');
  if (!isStr(usuario.apellido_paterno)) throw new HttpError(400, 'usuario.apellido_paterno requerido');
  if (!isStr(usuario.email)) throw new HttpError(400, 'usuario.email requerido');

  // password opcional (pero recomendado)
  let password_hash = null;
  if (usuario.password) {
    const pw = String(usuario.password);
    if (pw.length < 8) throw new HttpError(400, 'usuario.password mínimo 8 caracteres');
    password_hash = await bcrypt.hash(pw, 10);
  }
  usuario.email = String(usuario.email).trim().toLowerCase();
  usuario.password_hash = password_hash;

  const res = await centrosDao.crearFull({ usuario, centro, representante });
  if (!res?.centro_id) throw new HttpError(500, 'No se pudo crear el centro');
  return res;
}

async function actualizar(id, data) {
  id = toId(id, 'id');
  if (data?.distrito_id !== undefined && data.distrito_id !== null) toId(data.distrito_id, 'distrito_id');
  const affected = await centrosDao.actualizar(id, data || {});
  if (affected < 1) throw new HttpError(404, 'Centro no encontrado');
  return { affected };
}

async function cambiarEstado(id, estado) {
  id = toId(id, 'id');
  validarEstadoCentro(estado);
  const affected = await centrosDao.cambiarEstado(id, estado);
  if (affected < 1) throw new HttpError(404, 'Centro no encontrado');
  return { affected };
}

async function repUpsert(id, rep) {
  const centro_id = toId(id, 'id');
  if (!rep || typeof rep !== 'object') throw new HttpError(400, 'representante requerido');
  const affected = await centrosDao.repUpsert(centro_id, rep);
  return { affected };
}

async function repDelete(id) {
  const centro_id = toId(id, 'id');
  const affected = await centrosDao.repDelete(centro_id);
  return { affected };
}

async function eliminar(id) {
  id = toId(id, 'id');
  const affected = await centrosDao.eliminar(id); // puede tirar SIGNAL por dependencias
  if (affected < 1) throw new HttpError(404, 'Centro no encontrado');
  return { affected };
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
