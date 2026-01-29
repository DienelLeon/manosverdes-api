const dbMod = require('../../db');
const db = dbMod.pool || dbMod;

function pickFirstRow(callResult) {
  const rows = callResult?.[0];
  if (!rows) return null;
  if (Array.isArray(rows) && Array.isArray(rows[0])) return rows[0][0] || null;
  if (Array.isArray(rows)) return rows[0] || null;
  return null;
}
function pickRows(callResult) {
  const rows = callResult?.[0];
  if (!rows) return [];
  if (Array.isArray(rows) && Array.isArray(rows[0])) return rows[0];
  if (Array.isArray(rows)) return rows;
  return [];
}

async function obtenerPorEmail(email) {
  const r = await db.query('CALL sp_admin_usuario_get_by_email(?)', [email]);
  return pickFirstRow(r);
}

async function listar({ limit, offset }) {
  const r = await db.query('CALL sp_admin_usuario_list(?,?)', [Number(limit), Number(offset)]);
  return pickRows(r);
}

async function obtenerPorId(id) {
  const r = await db.query('CALL sp_admin_usuario_get(?)', [id]);
  return pickFirstRow(r);
}

async function crearUsuarioConAuth(data) {
  const r = await db.query('CALL sp_admin_usuario_create(?,?,?,?,?,?,?,?,?,?)', [
    data.nombre,
    data.apellido_paterno,
    data.apellido_materno ?? '',
    data.email,
    data.telefono ?? null,
    data.fecha_nacimiento ?? null,
    data.estado ?? 'activo',
    data.rol_clave ?? 'app',
    data.password_hash ?? null,
    Number(data.email_verificado) ? 1 : 0,
  ]);
  const row = pickFirstRow(r);
  return row?.usuario_id || null;
}

async function actualizar(id, data) {
  const r = await db.query('CALL sp_admin_usuario_update(?,?,?,?,?,?,?,?)', [
    id,
    data.nombre ?? null,
    data.apellido_paterno ?? null,
    data.apellido_materno ?? null,
    data.telefono ?? null,
    data.fecha_nacimiento ?? null,
    data.estado ?? null,
    data.rol_clave ?? null,
  ]);
  const row = pickFirstRow(r);
  return Number(row?.affected || 0);
}

async function cambiarEstado(id, estado) {
  const r = await db.query('CALL sp_admin_usuario_set_estado(?,?)', [id, estado]);
  const row = pickFirstRow(r);
  return Number(row?.affected || 0);
}

async function centrosSearch(q, limit = 20) {
  const r = await db.query('CALL sp_admin_usuario_centro_search(?,?)', [
    q ?? null,
    Math.min(Number(limit || 20), 100),
  ]);
  return pickRows(r);
}

module.exports = {
  obtenerPorEmail,
  listar,
  obteneri: listar,
  obtenerPorId,
  crearUsuarioConAuth,
  actualizar,
  cambiarEstado,
  centrosSearch,
};
