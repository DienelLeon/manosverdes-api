// src/services/token.service.js
const HttpError = require('../utils/httpError');
const { sha256Hex } = require('../utils/crypto');
const { signToken } = require('../utils/jwt');
const { pool } = require('../db');
const sesionDAO = require('../dao/sesion.dao');

function parseExpiresToMs(str) {
  const s = String(str || '7d').trim().toLowerCase();
  const m = s.match(/^(\d+)\s*([smhd])$/);
  if (!m) return 7 * 24 * 60 * 60 * 1000;
  const n = Number(m[1]);
  const u = m[2];
  const mult = u === 's' ? 1000 : u === 'm' ? 60000 : u === 'h' ? 3600000 : 86400000;
  return n * mult;
}

async function emitir(user, req) {
  if (!user?.id || !user?.rol) throw new HttpError(500, 'No se pudo emitir token');

  const { token, jti } = signToken({
    id: user.id,
    email: user.email ?? null,
    nombre: user.nombre ?? null,
    rol: user.rol
  });

  const jti_hash = sha256Hex(jti);
  const expMs = parseExpiresToMs(process.env.JWT_EXPIRES || '7d');
  const expira_en = new Date(Date.now() + expMs);

  await sesionDAO.crear(pool, {
    usuario_id: user.id,
    jti_hash,
    expira_en,
    ip: req?.ip,
    user_agent: req?.headers?.['user-agent']
  });

  return { token, expira_en, jti };
}

async function cerrarSesion(reqUser) {
  const jti = reqUser?.jti;
  if (!jti) throw new HttpError(400, 'Token sin jti');
  await sesionDAO.cerrar(pool, sha256Hex(jti));
  return { message: 'Sesión cerrada' };
}

module.exports = { emitir, cerrarSesion };
