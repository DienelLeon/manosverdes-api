// src/services/admin/usuarios.service.js
const bcrypt = require('bcryptjs');
const HttpError = require('../../utils/httpError');
const usuariosDao = require('../../dao/admin/usuarios.dao');
const gcs = require('../../utils/gcs');

function normEmail(email) {
  return String(email || '').trim().toLowerCase();
}

async function attachAvatarUrl(u, withAvatar) {
  if (!withAvatar) return u;
  if (!u.avatar_key) return { ...u, avatar_url: null };
  const avatar_url = await gcs.signUrl({ key: u.avatar_key, expiresSeconds: 600 });
  return { ...u, avatar_url };
}

function validarRolClave(rol_clave) {
  if (rol_clave === undefined || rol_clave === null) return;
  if (!['admin', 'centro', 'app'].includes(String(rol_clave))) {
    throw new HttpError(400, 'Rol inválido');
  }
}

function validarEstado(estado) {
  if (estado === undefined || estado === null) return;
  if (!['activo', 'inactivo', 'bloqueado'].includes(String(estado))) {
    throw new HttpError(400, 'Estado inválido');
  }
}

async function listar({ limit, offset, withAvatar }) {
  const rows = await usuariosDao.listar({ limit, offset });

  const out = withAvatar
    ? await Promise.all(rows.map((u) => attachAvatarUrl(u, true)))
    : rows;

  return { items: out, limit, offset };
}

async function obtener(id, { withAvatar }) {
  const u = await usuariosDao.obtenerPorId(id);
  if (!u) throw new HttpError(404, 'Usuario no encontrado');

  const out = await attachAvatarUrl(u, withAvatar);
  return { usuario: out };
}

async function crear(data) {
  const email = normEmail(data.email);

  validarRolClave(data.rol_clave ?? 'app');
  validarEstado(data.estado ?? 'activo');

  const existe = await usuariosDao.obtenerPorEmail(email);
  if (existe) throw new HttpError(409, 'El email ya está registrado');

  let passwordHash = null;
  if (data.password) {
    const pw = String(data.password);
    if (pw.length < 8) throw new HttpError(400, 'La contraseña debe tener mínimo 8 caracteres');
    passwordHash = await bcrypt.hash(pw, 10);
  }

  const id = await usuariosDao.crearUsuarioConAuth({
    nombre: data.nombre,
    apellido_paterno: data.apellido_paterno,
    apellido_materno: data.apellido_materno,
    email,
    telefono: data.telefono,
    fecha_nacimiento: data.fecha_nacimiento,
    rol_clave: data.rol_clave ?? 'app',
    estado: data.estado ?? 'activo',
    password_hash: passwordHash,
    email_verificado: Number(data.email_verificado) ? 1 : 0,
  });

  return { id };
}

async function actualizar(id, data) {
  validarRolClave(data.rol_clave);
  validarEstado(data.estado);

  const affected = await usuariosDao.actualizar(id, data);
  if (affected < 1) throw new HttpError(404, 'Usuario no encontrado');
  return { affected };
}

async function cambiarEstado(id, estado) {
  validarEstado(estado);

  const affected = await usuariosDao.cambiarEstado(id, estado);
  if (affected < 1) throw new HttpError(404, 'Usuario no encontrado');
  return { affected };
}
async function centrosSearch({ q, limit }) {
  const lim = Math.min(Number(limit || 20), 100);
  const query = (q ?? '').toString().trim();

  const items = await usuariosDao.centrosSearch(query, lim);
  return { items, limit: lim, q: query };
}
module.exports = {
  listar,
  obtener,
  crear,
  actualizar,
  cambiarEstado,
  centrosSearch,
};
