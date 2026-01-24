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

exports.listar = async ({ limit, offset, withAvatar }) => {
  const rows = await usuariosDao.listar({ limit, offset });

  const out = withAvatar
    ? await Promise.all(rows.map((u) => attachAvatarUrl(u, true)))
    : rows;

  return { items: out, limit, offset };
};

exports.obtener = async (id, { withAvatar }) => {
  const u = await usuariosDao.obtenerPorId(id);
  if (!u) throw new HttpError(404, 'Usuario no encontrado');

  const out = await attachAvatarUrl(u, withAvatar);
  return { usuario: out };
};

exports.crear = async (data) => {
  const email = normEmail(data.email);

  const existe = await usuariosDao.obtenerPorEmail(email);
  if (existe) throw new HttpError(409, 'El email ya está registrado');

  let passwordHash = null;
  if (data.password) passwordHash = await bcrypt.hash(String(data.password), 10);

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
};

exports.actualizar = async (id, data) => {
  const affected = await usuariosDao.actualizar(id, data);
  if (affected < 1) throw new HttpError(404, 'Usuario no encontrado');
  return { affected };
};

exports.cambiarEstado = async (id, estado) => {
  const affected = await usuariosDao.cambiarEstado(id, estado);
  if (affected < 1) throw new HttpError(404, 'Usuario no encontrado');
  return { affected };
};
