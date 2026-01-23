// src/dao/auth.dao.js
const dbMod = require('../db');
const db = dbMod.pool || dbMod;

function pickFirstRow(callResult) {
  const rows = callResult?.[0];
  if (!rows) return null;
  if (Array.isArray(rows) && Array.isArray(rows[0])) return rows[0][0] || null;
  if (Array.isArray(rows)) return rows[0] || null;
  return null;
}

async function obtenerUsuarioPorEmail(email) {
  const r = await db.query('CALL sp_auth_usuario_obtener_por_email(?)', [email]);
  return pickFirstRow(r);
}

async function obtenerUsuarioPorId(id) {
  const q = `SELECT u.id, u.nombre, u.apellido_paterno, u.apellido_materno, u.email, u.telefono, u.avatar_key, u.estado, u.rol_id, r.clave AS rol_clave, ua.email_verificado
    FROM usuario u
    JOIN rol r ON r.id = u.rol_id
    LEFT JOIN usuario_auth ua ON ua.usuario_id = u.id
    WHERE u.id = ?
    LIMIT 1`;
  const r = await db.query(q, [id]);
  return pickFirstRow(r);
}

async function crearUsuario(data) {
  const r = await db.query(
    'CALL sp_auth_usuario_crear(?,?,?,?,?,?,?,?,?)',
    [
      data.nombre,
      data.apellido_paterno,
      data.apellido_materno ?? '',
      data.email,
      data.telefono ?? null,
      data.fecha_nacimiento ?? null,
      data.avatar_key ?? null,
      data.password_hash,
      data.rol_clave ?? 'app',
    ]
  );
  const row = pickFirstRow(r);
  return row?.usuario_id || null;
}

async function marcarEmailVerificado(usuario_id) {
  const r = await db.query('CALL sp_auth_email_verificar(?)', [usuario_id]);
  const row = pickFirstRow(r);
  return Number(row?.affected || 0);
}

async function actualizarPassword(usuario_id, password_hash) {
  const r = await db.query('CALL sp_auth_password_actualizar(?,?)', [usuario_id, password_hash]);
  const row = pickFirstRow(r);
  return Number(row?.affected || 0);
}

async function resetIntentos(usuario_id) {
  const r = await db.query('CALL sp_auth_intentos_reset(?)', [usuario_id]);
  const row = pickFirstRow(r);
  return Number(row?.affected || 0);
}

async function intentoFallido(usuario_id, maxFails, lockMinutes) {
  const r = await db.query('CALL sp_auth_intento_fallido(?,?,?)', [
    usuario_id,
    Number(maxFails),
    Number(lockMinutes),
  ]);

  // este SP devuelve un SELECT con intentos_fallidos/bloqueado_hasta
  const row = pickFirstRow(r);
  return row || null;
}

async function otpUpsert(usuario_id, tipo, codigo_hash, expira_en) {
  await db.query('CALL sp_auth_otp_upsert(?,?,?,?)', [usuario_id, tipo, codigo_hash, expira_en]);
  return true;
}

async function otpUsarSiValido(usuario_id, tipo, codigo_hash) {
  const r = await db.query('CALL sp_auth_otp_usar_si_valido(?,?,?)', [usuario_id, tipo, codigo_hash]);
  const row = pickFirstRow(r);
  return Number(row?.affected || 0) === 1;
}

module.exports = {
  obtenerUsuarioPorEmail,
  crearUsuario,
  marcarEmailVerificado,
  actualizarPassword,
  resetIntentos,
  intentoFallido,
  otpUpsert,
  otpUsarSiValido,
  obtenerUsuarioPorId,
};
