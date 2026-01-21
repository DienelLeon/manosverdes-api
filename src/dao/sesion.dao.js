// src/dao/sesion.dao.js
async function crear(connOrPool, { usuario_id, jti_hash, expira_en, ip, user_agent }) {
  await connOrPool.query(
    `INSERT INTO sesion (usuario_id, jti_hash, expira_en, ip, user_agent)
     VALUES (?, ?, ?, ?, ?)`,
    [usuario_id, jti_hash, expira_en, ip || null, user_agent || null]
  );
}

async function cerrar(connOrPool, jti_hash) {
  await connOrPool.query(
    `UPDATE sesion
     SET activo = 0, cerrado_en = NOW()
     WHERE jti_hash = ?`,
    [jti_hash]
  );
}

async function obtenerPorJtiHash(connOrPool, jti_hash) {
  const [rows] = await connOrPool.query(
    `SELECT id, usuario_id, expira_en, activo
     FROM sesion
     WHERE jti_hash = ?
     LIMIT 1`,
    [jti_hash]
  );
  return rows[0] || null;
}

module.exports = { crear, cerrar, obtenerPorJtiHash };
